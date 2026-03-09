# Atlas Backend

Django REST API backend for the Atlas Student Success Agent. Powers the agentic AI chat via Google Gemini and integrates with Salesforce as the system of record.

## Tech Stack

- Python 3.13+, Django 6, Django REST Framework
- Google Gemini API (`google-generativeai`) — LLM agent brain
- Salesforce Developer Edition (`simple-salesforce`) — enterprise data backend
- SQLite (local dev)

## Setup

```sh
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate   # macOS/Linux
# venv\Scripts\activate    # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and Salesforce credentials

# 4. Run migrations
python manage.py migrate

# 5. Seed demo data (requires Salesforce credentials)
python manage.py seed_sf_data

# 6. Start development server
python manage.py runserver 8000
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (required for agent) |
| `SF_USERNAME` | Salesforce username |
| `SF_PASSWORD` | Salesforce password |
| `SF_SECURITY_TOKEN` | Salesforce security token |
| `SF_CONSUMER_KEY` | Salesforce Connected App consumer key |
| `SF_CONSUMER_SECRET` | Salesforce Connected App consumer secret |
| `SF_DOMAIN` | `login` (production) or `test` (sandbox) |

## Key API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/actions/process_chat/` | POST | Send a chat message to the AI agent |
| `/api/students/sync_sf/` | POST | Sync students from Salesforce |
| `/api/students/` | GET | List all students |
| `/api/actions/` | GET | List all agent actions |

## Project Structure

```
atlas_backend/
├── api/
│   ├── agent.py          # Gemini agent + tool definitions (CRITICAL)
│   ├── views.py           # DRF ViewSets
│   ├── models.py          # Student, AtlasAction models
│   ├── serializers.py     # DRF serializers
│   ├── sf_client.py       # Salesforce connection helper
│   ├── urls.py            # API router
│   └── management/commands/
│       └── seed_sf_data.py  # Demo data seeder
├── atlas_backend_project/
│   ├── settings.py        # Django settings
│   └── urls.py            # Root URL config
├── requirements.txt
├── .env.example
└── manage.py
```

## Frontend

The companion React frontend lives in a separate repository: [atlas-compass-buddy](https://github.com/krishbharucha/atlas-compass-buddy). It runs on port 8080 and communicates with this backend via the REST API.
