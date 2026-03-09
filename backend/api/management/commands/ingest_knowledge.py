"""
Django management command to ingest campus policy documents
into the ChromaDB vector store for RAG-powered knowledge retrieval.

Usage:
    python manage.py ingest_knowledge
"""

import sys
import os
from django.core.management.base import BaseCommand

# Ensure the project root is on the path so knowledge/ can be imported
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))


class Command(BaseCommand):
    help = "Ingest campus policy documents into the ChromaDB knowledge base for RAG retrieval."

    def handle(self, *args, **options):
        from knowledge.ingest import ingest_documents
        from api.models import KnowledgeDocument

        self.stdout.write("Starting knowledge base ingestion...\n")

        try:
            report = ingest_documents(verbose=True)
        except Exception as e:
            self.stderr.write(f"Ingestion failed: {e}")
            return

        # Update Django tracking model
        for filename, chunk_count in report:
            source_path = os.path.join("knowledge", "documents", filename)
            title = filename.replace("_", " ").replace(".txt", "").replace(".md", "").title()
            KnowledgeDocument.objects.update_or_create(
                filename=filename,
                defaults={
                    "title": title,
                    "source_path": source_path,
                    "chunk_count": chunk_count,
                }
            )

        total_chunks = sum(c for _, c in report)
        self.stdout.write(
            self.style.SUCCESS(
                f"\n✓ Knowledge base ready: {len(report)} documents, {total_chunks} chunks indexed."
            )
        )
