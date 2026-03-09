# 🧭 Atlas Student portal: Unified Monorepo

Welcome to the **Atlas** monorepo! This repository contains both the React frontend and the Django/Gemini backend for the ultimate agentic Student Success platform.

## 📂 Project Structure
- **/frontend**: React + Vite application. Interactive UI, chat interface, and dynamic widget rendering.
- **/backend**: Django REST framework. Houses the Gemini 2.5-flash AI agent, Salesforce `simple-salesforce` configuration, RAG vector database knowledge base, and mock database.

---

## 🚀 Unified Deployment Guide

Atlas is designed to be hosted seamlessly in the cloud. The backend runs on Render, and the frontend runs on Vercel.

### Phase 1: Deploy Backend (Render)
The backend is fully configured for a "Web Service" deployment on Render.

1. Go to [Render](https://render.com) and click **New > Web Service**.
2. Connect this GitHub repository.
3. **Important:** Set the **Root Directory** to `backend`.
4. Choose **Environment:** `Python 3`
5. Set the **Build Command:** `./build.sh`
6. Set the **Start Command:** `gunicorn atlas_backend_project.wsgi:application`
7. Expand **Environment Variables** and add your secrets:
   - `PYTHON_VERSION`: `3.13.2`
   - `GEMINI_API_KEY`: *(your Gemini AI key)*
   - `SF_USERNAME`: *(Salesforce username)*
   - `SF_PASSWORD`: *(Salesforce password + security token)*
   - `SF_CONSUMER_KEY`: *(Salesforce Connected App Key)*
   - `SF_CONSUMER_SECRET`: *(Salesforce Connected App Secret)*
8. Click **Deploy**. Copy the live URL (e.g., `https://atlas-backend.onrender.com`) when finished.

---

### Phase 2: Deploy Frontend (Vercel)
The Vite-based React frontend is completely zero-config on Vercel.

1. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Import this GitHub repository.
3. **Important:** Set the **Root Directory** to `frontend`.
4. The Framework Preset will automatically be detected as **Vite**.
5. Open the **Environment Variables** section and add:
   - `VITE_API_URL`: *(paste the Render backend URL from Phase 1)*
6. Click **Deploy**.

**You're live!** The frontend will now seamlessly route requests to your cloud-hosted Django Agentic backend.
