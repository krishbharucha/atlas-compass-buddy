# Atlas Copilot Instructions

## What Atlas Is

Atlas is a **True Agentic AI** student-success platform for universities. A React frontend talks to a Django REST backend whose central "brain" is Google Gemini 2.5-flash. Gemini is given Python tool-functions that can autonomously read/write **Salesforce** (the system of record) and the local Django ORM. The project replaced an earlier hardcoded `if/else` chat with this LLM-orchestrated loop.

---

## Repository Layout

| Path | Role |
|---|---|
| `atlas-compass-buddy/` | Vite + React 18 + TypeScript + Tailwind + shadcn/ui frontend (port **8080**) |
| `atlas_backend/` | Django 6 + DRF + SQLite backend (port **8000**) |
| `atlas_backend/api/agent.py` | **CRITICAL** — Gemini agent, tool definitions, `execute_agent_chat()` loop |
| `atlas_backend/api/views.py` | DRF ViewSets; `process_chat` endpoint hands off to `agent.py` |
| `atlas_backend/api/sf_client.py` | `simple_salesforce` auth helper; returns `None` on failure |
| `atlas_backend/api/models.py` | `Student` (syncs w/ SF Contact) and `AtlasAction` (UI action cards) |
| `atlas_backend/api/serializers.py` | DRF serializers — both use `fields = '__all__'` |
| `atlas_backend/api/management/commands/seed_sf_data.py` | Clears DB, creates 16 students (incl. demo `jordan123`) + 30 SF Cases via Faker |
| `atlas-compass-buddy/src/pages/AtlasChat.tsx` | Main chat UI — manages live chat + demo-scenario modes, renders action log panel |
| `atlas-compass-buddy/src/components/chat/` | Phase 3 rich UI widgets: `DegreeProgressRing`, `CourseResultsTable`, `FinancialSummaryCard`, `AdvisorSlotPicker`, `ChatUiRenderer` |
| `atlas-compass-buddy/src/data/atlasScenarios.ts` | Hardcoded demo scenarios with pillar-based actions for offline demos |

---

## Agentic Architecture (data flow)

```
React (AtlasChat.tsx)
  ──POST {message, netid}──▶  Django view (process_chat)
                                    │
                                    ▼
                              agent.py: execute_agent_chat()
                                    │
                        ┌───────────┼───────────┐
                        ▼           ▼           ▼
                 query_student   query_fin   create_support
                 _hold()        _aid()      _case()  ← calls sf_client
                        │           │           │
                        └───► AtlasAction rows ◄┘
                                    │
                                    ▼
                              Gemini synthesizes text
                                    │
                     ◀──{text, actions[]}──┘
React renders assistant bubble + action-log cards
```

Key mechanic: each tool function creates `AtlasAction` rows as a **side-effect**. After the LLM turn, `execute_agent_chat` queries for actions created since `start_time` and returns them alongside the text.

---

## Environment Variables

### Backend (`atlas_backend/.env`)
Copy from `.env.example`. Required keys:

| Key | Used by |
|---|---|
| `GEMINI_API_KEY` | `agent.py` — agent won't run without it |
| `SF_USERNAME`, `SF_PASSWORD`, `SF_SECURITY_TOKEN` | `sf_client.py` |
| `SF_CONSUMER_KEY`, `SF_CONSUMER_SECRET` | `sf_client.py` (Connected App) |
| `SF_DOMAIN` | defaults to `login`; set `test` for sandbox |

### Frontend (`atlas-compass-buddy/.env`)
Copy from `.env.example`. Key:

| Key | Default | Used by |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | `AtlasChat.tsx` — backend base URL |

---

## Dev Workflows

### Frontend
```sh
cd atlas-compass-buddy
npm i            # install deps (or use bun)
npm run dev      # Vite dev server → http://localhost:8080
npm run test     # Vitest
npm run build    # production build
npm run lint     # eslint
```

### Backend
```sh
cd atlas_backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_sf_data   # populate SF + local DB with demo data
python manage.py runserver 8000
```

> `requirements.txt` is pinned from the project venv. Update it when adding new packages.

### Seeding demo data
`python manage.py seed_sf_data` wipes local `Student`/`AtlasAction` tables, creates the canonical demo student **Jordan Student (netid `jordan123`)** plus 15 Faker-generated students, and pushes 30 Cases into Salesforce. The frontend defaults to `jordan123` everywhere.

---

## API Contract

### POST `/api/actions/process_chat/`
```json
// Request
{ "message": "Check my holds", "netid": "jordan123" }
// Response
{
  "text": "You have an immunization hold…",
  "actions": [
    { "id": 1, "type": "warning", "title": "Immunization Hold Check",
      "description": "…", "status": "Complete", "agentforce_note": "Gemini Tool: query_student_hold", … }
  ]
}
```

### POST `/api/students/sync_sf/`
Pulls SF Contacts with `Title = 'Student'`, derives `netid` from email prefix, and `update_or_create`s local `Student` rows.

### DRF Router (auto-generated CRUD)
`/api/students/` and `/api/actions/` — standard ModelViewSet endpoints registered via `DefaultRouter` in `api/urls.py`.

---

## Adding a New Agent Tool (step-by-step pattern)

1. **Define the function** in `api/agent.py` with a clear docstring (Gemini reads it to decide when to call the tool):
   ```python
   def enroll_student_in_course(netid: str, course_code: str) -> str:
       """Enrolls the student in the specified course section."""
       # …ORM or SF logic…
       AtlasAction.objects.create(
           student=student, type="action",
           title=f"Enrolled in {course_code}", description="…",
           status="Complete", agentforce_note="Gemini Tool: enroll_student_in_course"
       )
       return f"Student {netid} enrolled in {course_code}"
   ```
2. **Append** to `AGENT_TOOLS` list at the bottom of `agent.py`.
3. **No view/url changes needed** — `execute_agent_chat` already passes `AGENT_TOOLS` to Gemini and collects any new `AtlasAction` rows automatically.
4. If the tool needs new Django models or SF objects, add migrations and update `serializers.py` / `seed_sf_data.py` accordingly.

---

## Frontend Conventions

- **Routing**: `App.tsx` defines routes — `/dashboard`, `/chat`, `/financial`, `/academic`, `/jobs`, `/wellness`, `/plan`, `/profile`, `/login`.
- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts` + `tsconfig`).
- **UI library**: shadcn/ui components live in `src/components/ui/`. Use them for any new UI.
- **Icons**: `lucide-react` — import by name (e.g. `<Zap />`).
- **Animations**: Framer Motion is available; existing pages use Tailwind `animate-fade-in-up`.
- **Demo scenarios** in `src/data/atlasScenarios.ts` define pillar-based demo conversations. `AtlasChat.tsx` has a "Live Chat" mode (calls backend) and a "Demo Scenarios" mode (uses these static scripts). Keep both modes working.
- **Action statuses the UI recognises**: `Complete`, `In Progress`, `Awaiting`, `Ready`, `Human Taking Over`. Corresponding badge classes are in `AtlasChat.tsx`'s `statusConfig`.
- **AtlasDrawer** (`src/components/AtlasDrawer.tsx`) is a global floating chat drawer available on every page except landing/login — it uses the same keyword-matching engine as the demo mode.

---

## Model Reference

### Student (`api/models.py`)
`netid` (unique), `first_name`, `last_name`, `email`, `major`, `gpa`, `sf_id` (SF Contact ID, unique, nullable)

### AtlasAction (`api/models.py`)
`student` (FK→Student), `sf_id` (SF Case ID, nullable), `type` (`info|warning|action`), `title`, `description`, `status` (choices: `Complete|In Progress|Awaiting|Ready`), `agentforce_note`, `created_at` (auto)

---

## Roadmap — 4 Phases (detailed implementation checklists)

### Phase 1 — Tool Expansion (Depth)

**Goal**: Give the agent new autonomous capabilities — course registration, advisor booking, degree audit.

#### 1a. Course Registration Tool
- [ ] Add `Course` model in `api/models.py`: `code`, `title`, `section`, `capacity`, `enrolled_count`, `schedule`, `term`.
- [ ] Add `Enrollment` model: FK→Student, FK→Course, `status` (enrolled/waitlisted/dropped), `enrolled_at`.
- [ ] Run `makemigrations` + `migrate`.
- [ ] Update `api/serializers.py` with `CourseSerializer`, `EnrollmentSerializer`.
- [ ] Optionally mirror courses in Salesforce as a custom object; update `seed_sf_data.py` to create sample courses.
- [ ] In `api/agent.py`, add:
  ```python
  def search_courses(query: str) -> str:
      """Searches available courses matching a keyword or department."""
  def enroll_student_in_course(netid: str, course_code: str) -> str:
      """Enrolls the student in the specified course section."""
  ```
  Both must create `AtlasAction` rows. `enroll_student_in_course` should check capacity.
- [ ] Append both to `AGENT_TOOLS`.
- [ ] Add demo scenario in `atlasScenarios.ts` under the `academic` pillar.

#### 1b. Advisor Booking Tool
- [ ] Add `Advisor` model: `name`, `department`, `email`, `sf_id`.
- [ ] Add `AdvisorSlot` model: FK→Advisor, `datetime`, `is_booked`, FK→Student (nullable).
- [ ] In `agent.py`, add:
  ```python
  def check_advisor_availability(department: str) -> str:
      """Lists available advisor appointment slots for the given department."""
  def book_advisor_appointment(netid: str, slot_id: int) -> str:
      """Books an advisor appointment for the student."""
  ```
- [ ] Append to `AGENT_TOOLS`. Each creates `AtlasAction` rows.
- [ ] Update `seed_sf_data.py` to create sample advisors and slots.

#### 1c. Degree Audit Tool
- [ ] Add `DegreeRequirement` model: `major`, `requirement_name`, `credits_required`.
- [ ] Add `StudentCourseHistory` model: FK→Student, `course_code`, `credits`, `grade`, `term`.
- [ ] In `agent.py`, add:
  ```python
  def run_degree_audit(netid: str) -> str:
      """Evaluates the student's progress toward graduation, listing remaining requirements."""
  ```
  Returns a summary string. Creates an `AtlasAction` with type `info`.
- [ ] Append to `AGENT_TOOLS`.
- [ ] Seed transcript data in `seed_sf_data.py` for the demo student.

---

### Phase 2 — RAG Integration (Knowledge Base) ✅ COMPLETE

**Goal**: Give the agent campus policy knowledge so it can cite real rules instead of hallucinating.

- [x] Create directory `atlas_backend/knowledge/` for document sources and vector DB storage.
- [x] Add `chromadb==1.5.2` to `requirements.txt`.
- [x] Write `atlas_backend/knowledge/ingest.py` — a script that:
  1. Reads `.txt`/`.md` files from `knowledge/documents/`.
  2. Splits them into chunks (~500 tokens with 80-token overlap).
  3. Embeds chunks via `gemini-embedding-001` model.
  4. Stores in a persistent ChromaDB collection at `knowledge/vectordb/`.
- [x] Create 5 campus policy documents: academic policies, financial aid, housing, health & wellness, important dates, CS major requirements.
- [x] Create Django management command `python manage.py ingest_knowledge` that calls the ingest script and tracks documents in `KnowledgeDocument` model.
- [x] In `api/agent.py`, added `search_knowledge_base(query: str) -> str` tool that queries ChromaDB top-4 passages with Gemini query embeddings.
- [x] Appended to `AGENT_TOOLS`.
- [x] Updated `execute_agent_chat` system instruction to use `search_knowledge_base` for policy questions with source citation.
- [x] Added 4 RAG-powered demo scenarios to frontend: Add/Drop Deadlines, Financial Aid SAP, Housing Contract, CS Major Requirements.

---

### Phase 3 — Structured UI Payloads ✅

**Goal**: Let the agent trigger rich frontend components (charts, calendars, progress rings) inline in the chat, not just plain text.

- [x] Define a JSON payload convention. Response shape from the backend:
  ```json
  {
    "text": "Here's your degree progress…",
    "actions": [...],
    "ui_triggers": [
      { "component": "DegreeProgressRing", "data": { "completed": 87, "total": 120, "gpa": 3.41 } }
    ]
  }
  ```
- [x] Updated `views.py` `process_chat` to unpack 3-tuple from `execute_agent_chat` and pass `ui_triggers` in response.
- [x] In `agent.py`, added `_emit_ui_trigger(component, data)` helper with thread-local storage. `execute_agent_chat` returns `(text, actions, ui_triggers)`. Four tools emit triggers: `run_degree_audit` → DegreeProgressRing, `search_courses` → CourseResultsTable, `query_financial_aid` → FinancialSummaryCard, `check_advisor_availability` → AdvisorSlotPicker.
- [x] **Frontend**: Created reusable rich components in `src/components/chat/`:
  - `DegreeProgressRing.tsx` — circular SVG progress ring with credits, GPA, graduation note.
  - `CourseResultsTable.tsx` — interactive course table with enroll buttons, seat counts.
  - `FinancialSummaryCard.tsx` — award breakdown with amounts, status pills, balance.
  - `AdvisorSlotPicker.tsx` — advisor slot list with book buttons, office & time display.
  - `ChatUiRenderer.tsx` — dispatcher that maps `ui_triggers[].component` → React component.
  - `index.ts` — barrel export.
- [x] In `AtlasChat.tsx`, updated `LiveMessage` type with `uiTriggers?`, `sendMessage()` captures `data.ui_triggers`, message renderer calls `<ChatUiRenderer>` after the text bubble.
- [x] Updated `ChatMessage` type in `atlasScenarios.ts` to include `uiTriggers?: UiTriggerData[]`.
- [x] Added 4 demo scenarios: Visual Degree Audit, Visual Course Search, Visual Aid Summary, Visual Advisor Booking — all with embedded `uiTriggers` that render rich components in Demo mode.

---

### Phase 4 — Proactive Agent (Background Notifications)

**Goal**: The agent should scan for upcoming deadlines and proactively notify students without waiting for a prompt.

- [ ] Add `celery` and `django-celery-beat` to `requirements.txt` (or use a simpler Django management command + cron).
- [ ] Create `atlas_backend/api/tasks.py`:
  ```python
  def scan_upcoming_deadlines():
      """Queries Salesforce for Cases/Tasks due within 3 days and creates AtlasAction notifications."""
  ```
- [ ] If using Celery: configure broker (Redis) in `settings.py`, register the periodic task.
- [ ] If simpler: create `api/management/commands/run_proactive_scan.py` that can be triggered by cron or a scheduler.
- [ ] Create proactive `AtlasAction` rows with a new type `proactive` and status `Ready`.
- [ ] **Frontend**: On the Dashboard page (`src/pages/Dashboard.tsx`), poll `/api/actions/?type=proactive&student=<netid>` and show a notification banner or toast for new proactive alerts.
- [ ] Optionally integrate email via Django's `send_mail` or a Salesforce email template.

---

## Integration Pitfalls

- `get_sf_connection()` returns **`None`** on auth failure — every caller must guard for this.
- `execute_agent_chat` returns `(text, actions_list)` — the view serialises the actions and sends both. If Gemini errors, the function catches the exception and returns an error string.
- CORS is locked to `localhost:8080` and `127.0.0.1:8080` — update `CORS_ALLOWED_ORIGINS` in `settings.py` if the frontend port changes.
- The seed command (`seed_sf_data`) **deletes all local Students and Actions** before re-creating — don't run it against production data.
- The frontend API base URL is read from `import.meta.env.VITE_API_URL` (defaults to `http://localhost:8000`). Set it in `atlas-compass-buddy/.env`. A `.env.example` is provided.

---

## Key Files to Touch for Common Tasks

| Task | Files |
|---|---|
| Add a new agent tool | `api/agent.py` (function + `AGENT_TOOLS`) |
| Change data model | `api/models.py`, `api/serializers.py`, then `makemigrations` + `migrate` |
| New frontend page | `src/pages/NewPage.tsx`, add route in `App.tsx` |
| New demo scenario | `src/data/atlasScenarios.ts` (add `Scenario` entry) |
| Salesforce field mapping | `api/views.py` (`sync_sf`), `api/management/commands/seed_sf_data.py` |
| CORS / allowed origins | `atlas_backend_project/settings.py` |
