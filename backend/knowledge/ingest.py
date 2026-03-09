"""
knowledge/ingest.py
Reads .txt (and .md) files from knowledge/documents/,
splits them into ~500-token chunks, embeds via Gemini embeddings,
and stores them in a persistent ChromaDB collection.
"""

import os
import re
import chromadb
import google.generativeai as genai


# ── Configuration ──────────────────────────────────────────────────
DOCUMENTS_DIR = os.path.join(os.path.dirname(__file__), "documents")
VECTORDB_DIR = os.path.join(os.path.dirname(__file__), "vectordb")
COLLECTION_NAME = "campus_knowledge"
CHUNK_SIZE = 500          # approximate tokens (≈ words × 1.3)
CHUNK_OVERLAP = 80        # overlap tokens for context continuity
EMBEDDING_MODEL = "models/gemini-embedding-001"


# ── Chunking ───────────────────────────────────────────────────────
def _split_into_chunks(text: str, chunk_size: int = CHUNK_SIZE,
                       overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Splits text into chunks of approximately `chunk_size` tokens,
    with `overlap` tokens of overlap between consecutive chunks.
    Uses paragraph breaks as natural split points when possible.
    """
    # Split on double newlines (paragraph boundaries) first
    paragraphs = re.split(r'\n{2,}', text.strip())

    chunks: list[str] = []
    current_chunk: list[str] = []
    current_len = 0

    for para in paragraphs:
        para_tokens = len(para.split())
        if current_len + para_tokens > chunk_size and current_chunk:
            # Save current chunk
            chunk_text = "\n\n".join(current_chunk)
            chunks.append(chunk_text)

            # Keep last paragraph(s) as overlap for next chunk
            overlap_paras: list[str] = []
            overlap_len = 0
            for p in reversed(current_chunk):
                p_len = len(p.split())
                if overlap_len + p_len > overlap:
                    break
                overlap_paras.insert(0, p)
                overlap_len += p_len
            current_chunk = overlap_paras
            current_len = overlap_len

        current_chunk.append(para)
        current_len += para_tokens

    # Final chunk
    if current_chunk:
        chunks.append("\n\n".join(current_chunk))

    return chunks


# ── Embedding ──────────────────────────────────────────────────────
def _embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts using the Gemini embedding model."""
    results = []
    # Process in batches of 20 (API limit)
    batch_size = 20
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=batch,
            task_type="retrieval_document",
        )
        results.extend(response["embedding"])
    return results


# ── Main ingestion ─────────────────────────────────────────────────
def ingest_documents(verbose: bool = True):
    """
    Reads all .txt and .md files in the documents folder,
    chunks them, embeds, and upserts into ChromaDB.
    Returns a list of (filename, chunk_count) tuples.
    """
    # Configure Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set in environment.")
    genai.configure(api_key=api_key)

    # Set up persistent ChromaDB client
    os.makedirs(VECTORDB_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=VECTORDB_DIR)

    # Delete and recreate collection for clean ingestion
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    # Discover documents
    valid_exts = {".txt", ".md"}
    files = sorted(
        f for f in os.listdir(DOCUMENTS_DIR)
        if os.path.splitext(f)[1].lower() in valid_exts
    )

    if verbose:
        print(f"Found {len(files)} document(s) in {DOCUMENTS_DIR}")

    report: list[tuple[str, int]] = []

    for filename in files:
        filepath = os.path.join(DOCUMENTS_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as fh:
            text = fh.read()

        # Extract title from first line
        first_line = text.strip().split("\n")[0].strip(" =#-")
        title = first_line if len(first_line) < 200 else filename

        chunks = _split_into_chunks(text)
        if not chunks:
            if verbose:
                print(f"  SKIP {filename} — no content")
            continue

        # Build IDs and metadata
        ids = [f"{filename}::chunk-{i}" for i in range(len(chunks))]
        metadatas = [
            {
                "source": filename,
                "title": title,
                "chunk_index": i,
                "total_chunks": len(chunks),
            }
            for i in range(len(chunks))
        ]

        # Embed
        embeddings = _embed_texts(chunks)

        # Upsert into ChromaDB
        collection.upsert(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
        )

        report.append((filename, len(chunks)))
        if verbose:
            print(f"  ✓ {filename}: {len(chunks)} chunks ({len(text)} chars)")

    if verbose:
        total_chunks = sum(c for _, c in report)
        print(f"\nIngestion complete: {len(report)} document(s), {total_chunks} total chunks.")

    return report


# ── Query helper (used by the agent tool) ──────────────────────────
def query_knowledge_base(query: str, n_results: int = 5) -> list[dict]:
    """
    Queries the ChromaDB knowledge base and returns the top-k results.
    Each result is a dict with 'text', 'source', 'title', 'distance'.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return [{"text": "Knowledge base unavailable (GEMINI_API_KEY not set).", "source": "", "title": "", "distance": 1.0}]
    genai.configure(api_key=api_key)

    if not os.path.exists(VECTORDB_DIR):
        return [{"text": "Knowledge base has not been built yet. Run: python manage.py ingest_knowledge", "source": "", "title": "", "distance": 1.0}]

    client = chromadb.PersistentClient(path=VECTORDB_DIR)
    try:
        collection = client.get_collection(COLLECTION_NAME)
    except Exception:
        return [{"text": "Knowledge base collection not found. Run: python manage.py ingest_knowledge", "source": "", "title": "", "distance": 1.0}]

    # Embed the query
    query_embedding = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=query,
        task_type="retrieval_query",
    )["embedding"]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, collection.count()),
    )

    output = []
    for i in range(len(results["ids"][0])):
        output.append({
            "text": results["documents"][0][i],
            "source": results["metadatas"][0][i].get("source", ""),
            "title": results["metadatas"][0][i].get("title", ""),
            "distance": results["distances"][0][i] if results.get("distances") else None,
        })

    return output
