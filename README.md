# 🧭 Atlas: The All-In-One Student Success Agent

Welcome to **Atlas**, an enterprise-grade Student Success Agent designed to unify the fragmented university university experience. By translating complex systems (Financial Aid, Advising, Registration, Wellness) into a single conversational interface, Atlas empowers students to navigate their academic journey seamlessly and autonomously.

---

## 🚀 The Agentic AI Architecture
Atlas has evolved from a standard hardcoded REST API into a **True Agentic AI Architecture**. At its core sits Google's Gemini 2.5-flash Large Language Model, acting as the central orchestration "brain." Rather than relying on simple text responses, the LLM is equipped with specialized Python tools that allow it to autonomously fetch data from or mutate data within our system of record (**Salesforce**).

### How the Agent Loop Works:
1. **Frontend Request**: The React application sends a user prompt (e.g., "Check my holds and open a ticket for my dorm") to the Django API.
2. **Action Routing**: The Django View routes the incoming message to the central Agent.
3. **Autonomous Execution**: Gemini evaluates the request and determines which tools to call. If it needs Salesforce data, it calls the tool to execute Python code via the `simple-salesforce` API.
4. **UI Action Triggering**: As the tools execute, they intelligently generate `AtlasAction` records to log the interactions. 
5. **Dynamic Rendering**: Gemini synthesizes the tool outputs into a natural response, returning both text and structured JSON payloads that instruct the React frontend to natively render beautiful components (like Progress Rings, Tables, or Info Cards) right in the chat flow!

---

## 🛠 Tech Stack

### Frontend UI (`/atlas-compass-buddy`)
- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn-ui, Framer Motion
- **Features**: Real-time markdown rendering, fluid animations, dynamic data components triggered by LLM responses.

### Backend Engine (`/atlas_backend`)
- **Framework**: Django & Django REST Framework
- **Language**: Python
- **Database**: SQLite (Local development) / Syncs with Salesforce Models

### Enterprise & AI Integration
- **System of Record**: Salesforce Developer Edition
- **API Client**: `simple-salesforce`
- **Generative AI**: Google Gemini API (`google-generativeai`)

---

## 🧠 Current Agent Capabilities (Features)

The Gemini Agent currently possesses an impressive suite of tools across various university domains:

### 1. 🛡 Administrative & Support
- **Immunization & Hold Checks**: Instantly verifies if a student has account holds and generates visual "Warning" Action Cards.
- **Financial Aid Retrieval**: Pulls the latest award letters, calculating pending verifications and current balances, and displays them via structured Financial Summary Cards.
- **Support Case Escalation**: Autonomously connects to Salesforce and creates high-priority Case tickets assigned to the Student's Contact ID.

### 2. 📚 Academic Planning
- **Course Registration Engine**: The agent searches available courses (filtering by keyword, department, or code) and can physically "enroll" or "waitlist" the student, updating their records in real-time.
- **Degree Audit**: Pulls the student's complete transcript to evaluate graduation progress (Credits, GPA, Requirements), rendering a rich Progress Ring natively in the chat UI.

### 3. 🗓 Advising & Appointments
- **Advisor Booking**: Checks real-time availability for advisors by department and allows the agent to book calendar appointments directly.

### 4. 🧠 Knowledge Base (RAG Integration)
- **Campus Policy Search**: Uses Retrieval-Augmented Generation (RAG) to query a robust vector knowledge base. When a student asks about nuanced campus rules, academic integrity, or deadlines, the Agent retrieves accurate policy passages with cited sources prior to answering.

---

## 💻 Local Development Setup

### 1. Backend Setup
Navigate to the Django application:
```sh
cd atlas_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Environment Variables** (`.env`):
Ensure you have the required credentials:
```env
GEMINI_API_KEY=your_google_api_key
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
SF_SECURITY_TOKEN=your_salesforce_token
```

**Seed Mock Data**:
To reset local records and sync dummy data to Salesforce:
```sh
python manage.py seed_sf_data
```

**Run Server**:
```sh
python manage.py runserver
```

### 2. Frontend Setup
Navigate to the React application in a new terminal:
```sh
cd atlas-compass-buddy
npm install
npm run dev
```

The application will be running locally. Open your browser to the localhost port provided by Vite!

---

## 🔮 Roadmap / Proactive Capabilities
Our future vision involves true background proactivity. The Agent will scan the Salesforce database for upcoming deadlines (e.g., tuition bills or registration windows) and autonomously send email notifications or generate proactive UI alerts without waiting for user prompts.
