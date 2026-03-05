export type MessageRole = "user" | "atlas" | "atlas-crisis" | "atlas-success" | "confirmation";

export interface ChatMessage {
  role: MessageRole;
  content: string;
  confirmationOptions?: { primary: string; secondary: string; detail: string };
}

export interface ActionItem {
  id: string;
  pillar: string;
  title: string;
  description: string;
  status: "Complete" | "In Progress" | "Awaiting" | "Ready" | "Human Taking Over";
  isCrisis?: boolean;
}

export interface Scenario {
  id: string;
  pillar: "financial" | "wellness" | "career" | "academic" | "admin";
  pillarLabel: string;
  title: string;
  trigger: string;
  messages: ChatMessage[];
  actions: ActionItem[];
}

export const scenarios: Scenario[] = [
  // ═══════════════════════════════════════════════════
  // PILLAR 1: FINANCIAL AID & MONEY STRESS
  // ═══════════════════════════════════════════════════
  {
    id: "fin-award-letter",
    pillar: "financial",
    pillarLabel: "Financial Aid",
    title: "Award Letter Confusion",
    trigger: "Award letter confusion — grant decreased $3,000",
    messages: [
      {
        role: "user",
        content: "I just got my financial aid award letter and I don't understand why my grant went down $3,000 from last year.",
      },
      {
        role: "atlas",
        content:
          "Jordan, I can see exactly what happened. Let me pull your complete aid history and compare year-over-year. Give me one moment.",
      },
      {
        role: "atlas",
        content:
          "Found it. Your Expected Family Contribution (EFC) increased by $4,200 this year because of a change in reported income. Additionally, I'm seeing a missing income verification document that was flagged on February 12th — your aid was provisionally reduced until that's submitted. The good news: this is fixable. I'm starting the resolution now.",
      },
      {
        role: "atlas",
        content:
          "I've taken 3 actions simultaneously: (1) identified the exact document needed — your 2025 IRS Tax Return Transcript — and pre-filled the verification form, (2) filed an appeal with the Financial Aid office with an urgency flag and a 5-business-day resolution timeline, and (3) placed a hold prevention flag on your account so your Spring registration is protected while the appeal processes. Check the action log for real-time status.",
      },
      {
        role: "atlas",
        content:
          "I also searched for emergency bridge funding. You're eligible for the University Emergency Grant ($500, disbursed in 48 hours) and the Dean's Discretionary Fund ($1,000, 1-week processing). I've pre-filled both applications with your financial profile. Want me to submit them?",
      },
      {
        role: "confirmation",
        content: "Submit Emergency Fund Applications",
        confirmationOptions: {
          primary: "Submit Both Applications",
          secondary: "Review First",
          detail: "University Emergency Grant ($500) + Dean's Discretionary Fund ($1,000)",
        },
      },
      {
        role: "atlas-success",
        content:
          "All actions are in motion. Your verification document submission is ready — just upload your IRS transcript and I'll route it immediately. Your account is protected, your appeal is filed, and your emergency funding applications are queued. You won't be dropped from any classes.",
      },
    ],
    actions: [
      { id: "F1", pillar: "financial", title: "Root Cause Identified", description: "EFC increase + missing income verification document (2025 IRS Tax Return Transcript)", status: "Complete" },
      { id: "F2", pillar: "financial", title: "Verification Form Pre-filled", description: "Income verification submission form ready — awaiting IRS transcript upload", status: "Awaiting" },
      { id: "F3", pillar: "financial", title: "Aid Appeal Filed & Routed", description: "Pre-filled appeal sent to Financial Aid with urgency flag — ETA 5 business days", status: "In Progress" },
      { id: "F4", pillar: "financial", title: "Hold Prevention Flag Placed", description: "Account protected — Spring registration safe during appeal process", status: "Complete" },
      { id: "F5", pillar: "financial", title: "Emergency Grant Application", description: "University Emergency Grant ($500) — pre-filled, ready to submit", status: "Ready" },
      { id: "F6", pillar: "financial", title: "Dean's Fund Application", description: "Dean's Discretionary Fund ($1,000) — pre-filled, ready to submit", status: "Ready" },
    ],
  },
  {
    id: "fin-textbooks",
    pillar: "financial",
    pillarLabel: "Financial Aid",
    title: "Textbook Emergency",
    trigger: "Need $400 for textbooks with $12 in account",
    messages: [
      {
        role: "user",
        content: "I need $400 for textbooks and I have $12 in my account.",
      },
      {
        role: "atlas",
        content:
          "I hear you, Jordan. $400 is a lot when you're at $12. Let me find every option available to you right now — I'm checking textbook programs, open alternatives, and emergency funding simultaneously.",
      },
      {
        role: "atlas",
        content:
          "Good news on multiple fronts: (1) You're eligible for the University Textbook Lending Program — 3 of your 4 required textbooks are available for semester-long loan at no cost. (2) For MATH 208, I found an OpenStax alternative that your professor has approved as equivalent. (3) For the remaining CS 301 textbook, I've initiated an emergency micro-grant application ($150) pre-filled with your financial profile — typical approval is 24 hours.",
      },
      {
        role: "atlas-success",
        content:
          "Summary: $0 out of pocket for 3 textbooks (lending program + open textbook), and a $150 micro-grant pending for the last one. Total savings: $400. All requests are submitted.",
      },
    ],
    actions: [
      { id: "F7", pillar: "financial", title: "Textbook Lending Program", description: "3 of 4 textbooks available for free semester loan — pickup at Library Room 102", status: "Complete" },
      { id: "F8", pillar: "financial", title: "Open Textbook Alternative Found", description: "MATH 208: OpenStax equivalent approved by professor — download link sent", status: "Complete" },
      { id: "F9", pillar: "financial", title: "Emergency Micro-Grant Filed", description: "CS 301 textbook ($150) — application submitted, ETA 24 hours", status: "In Progress" },
      { id: "F10", pillar: "financial", title: "Work-Study Opportunities Surfaced", description: "3 on-campus positions available — 10-15 hrs/week, $15/hr", status: "Ready" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // PILLAR 2: MENTAL HEALTH & WELLBEING
  // ═══════════════════════════════════════════════════
  {
    id: "well-overwhelmed",
    pillar: "wellness",
    pillarLabel: "Mental Health",
    title: "Sleep & Stress Crisis",
    trigger: "Haven't slept in 4 days, 3 finals next week",
    messages: [
      {
        role: "user",
        content: "I've been so overwhelmed. I haven't slept in 4 days and I have 3 finals next week.",
      },
      {
        role: "atlas",
        content:
          "Jordan, 4 days without sleep is serious, and I want to make sure you get the right kind of support — not just a list of resources. Can I ask you a few quick questions to figure out the best next step?",
      },
      {
        role: "atlas",
        content:
          "Based on what you've shared, I'm connecting you with a same-day counselor slot — not a waitlist, an actual appointment. I've also put together a \"tonight's toolkit\" with 3 resources personalized to sleep deprivation and exam stress, sent to your phone via SMS.",
      },
      {
        role: "confirmation",
        content: "Counseling Appointment",
        confirmationOptions: {
          primary: "Confirm Tomorrow 10:00 AM",
          secondary: "See Other Times",
          detail: "Same-day counselor slot — Wellness Center, Room 204",
        },
      },
      {
        role: "atlas",
        content:
          "I also noticed your wellness pulse scores have been declining for the past 3 weeks. I've sent a confidential welfare flag to your assigned advisor — no clinical details, just a note that you might benefit from a check-in. They'll reach out within 24 hours.",
      },
      {
        role: "atlas-success",
        content:
          "Your appointment is set, your toolkit is on your phone, and your advisor has been notified. Tonight, focus on the breathing exercise I sent — it's a 4-7-8 technique specifically for sleep onset. You've got support around you, Jordan.",
      },
    ],
    actions: [
      { id: "W1", pillar: "wellness", title: "Urgency Triage Completed", description: "3 warm follow-up questions assessed — routed to same-day counselor slot", status: "Complete" },
      { id: "W2", pillar: "wellness", title: "Counseling Appointment Booked", description: "Tomorrow 10:00 AM — Wellness Center Room 204, intake form pre-sent", status: "Complete" },
      { id: "W3", pillar: "wellness", title: "Tonight's Toolkit Sent", description: "3 personalized resources: 4-7-8 breathing, sleep hygiene guide, exam stress meditation — sent via SMS", status: "Complete" },
      { id: "W4", pillar: "wellness", title: "Wellness Trend Alert", description: "Declining scores for 3 consecutive weeks — confidential welfare flag sent to advisor", status: "Complete" },
      { id: "W5", pillar: "wellness", title: "Finals Study Plan Adjusted", description: "Suggested modified study schedule accounting for recovery sleep — sent to your calendar", status: "Ready" },
    ],
  },
  {
    id: "well-crisis",
    pillar: "wellness",
    pillarLabel: "Mental Health",
    title: "Crisis Detection",
    trigger: "Student expresses deeper distress during conversation",
    messages: [
      {
        role: "user",
        content: "I don't really feel like things are going to get better.",
      },
      {
        role: "atlas-crisis",
        content:
          "I hear you. What you're feeling matters, and I'm glad you told me. I want to make sure you have real support right now — not a ticket number, not next week. I'm connecting you with someone directly. Can you stay here with me for just a moment?",
      },
      {
        role: "atlas-crisis",
        content:
          "I've paged the on-call crisis counselor. They'll call you directly within the next few minutes at the number on file. I've also sent a direct callback number to your phone — you can reach a human 24/7 at that number. This conversation is being held safely and confidentially.",
      },
      {
        role: "atlas-crisis",
        content:
          "I'm staying right here with you until you confirm you've connected with someone. You don't have to go through this alone, and you don't have to figure everything out right now.",
      },
    ],
    actions: [
      { id: "W6", pillar: "wellness", title: "Crisis Support Activated", description: "On-call crisis counselor paged — direct callback within minutes", status: "Human Taking Over", isCrisis: true },
      { id: "W7", pillar: "wellness", title: "Direct Callback Number Sent", description: "24/7 crisis support number sent to student's phone via SMS", status: "Complete" },
      { id: "W8", pillar: "wellness", title: "Welfare Concern Logged", description: "Interaction logged confidentially — counseling team notified", status: "Complete" },
      { id: "W9", pillar: "wellness", title: "Conversation Held Safely", description: "Atlas remaining active until student confirms human connection", status: "In Progress" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // PILLAR 3: CAREER & JOB SEARCHING
  // ═══════════════════════════════════════════════════
  {
    id: "career-internship",
    pillar: "career",
    pillarLabel: "Career Services",
    title: "PM Internship Search",
    trigger: "Junior in Info Science wants PM internship",
    messages: [
      {
        role: "user",
        content: "I'm a junior in Information Science. I want a PM internship this summer. I don't know where to start.",
      },
      {
        role: "atlas",
        content:
          "Great goal, Jordan. PM internships are competitive but very achievable from your position. I'm not going to give you a generic checklist — I'm building you a personalized 8-week recruiting action plan based on your exact academic record, skills, and timeline. Give me a moment.",
      },
      {
        role: "atlas",
        content:
          "Done. Here's what I've found and built: (1) I parsed your transcript and identified 6 relevant courses and 2 projects that map directly to PM job descriptions. Your biggest gaps vs. target roles are: SQL proficiency and a case study portfolio piece. (2) I've generated a baseline PM-focused resume highlighting your IS coursework and project experience. (3) I queried the UW alumni network and found 5 alumni in PM roles at your target companies — I've drafted personalized outreach messages for each based on shared courses and interests.",
      },
      {
        role: "atlas",
        content:
          "I also pulled the recruiting calendar: Amazon PM applications close in 3 weeks, Microsoft has an info session this Thursday, and Google's PM internship just opened. I've added all deadlines and events to your calendar. Your 8-week plan starts today — Week 1 is resume polish and first alumni outreach.",
      },
      {
        role: "confirmation",
        content: "Review Your 8-Week Plan",
        confirmationOptions: {
          primary: "View Full Plan",
          secondary: "Adjust Timeline",
          detail: "Personalized PM internship recruiting roadmap — 8 weeks, 12 milestones",
        },
      },
    ],
    actions: [
      { id: "C1", pillar: "career", title: "Academic Record Parsed", description: "6 relevant courses + 2 projects mapped to PM job descriptions. Gaps: SQL, case study portfolio", status: "Complete" },
      { id: "C2", pillar: "career", title: "PM Resume Generated", description: "Baseline resume built from transcript data — ready for review and polish", status: "Ready" },
      { id: "C3", pillar: "career", title: "Alumni Network Queried", description: "5 warm contacts at target companies — personalized outreach drafts ready", status: "Complete" },
      { id: "C4", pillar: "career", title: "Recruiting Calendar Synced", description: "Amazon (3 weeks), Microsoft info session (Thursday), Google PM (just opened) — added to calendar", status: "Complete" },
      { id: "C5", pillar: "career", title: "8-Week Action Plan Created", description: "12 milestones: resume → outreach → applications → interviews → offers", status: "Ready" },
    ],
  },
  {
    id: "career-offer",
    pillar: "career",
    pillarLabel: "Career Services",
    title: "Offer Evaluation",
    trigger: "Got an offer — $22/hr in Seattle, 48-hour deadline",
    messages: [
      {
        role: "user",
        content: "I got an offer for $22/hour in Seattle. Is that good? They want an answer in 48 hours.",
      },
      {
        role: "atlas",
        content:
          "Congrats on the offer, Jordan! Let me pull the data you need to make a confident decision quickly. I'm checking market compensation, Seattle cost-of-living, and our anonymized university offer database right now.",
      },
      {
        role: "atlas",
        content:
          "Here's your analysis: For a PM internship in Seattle, the median rate from our university's offer database is $28/hr. Market data from Levels.fyi shows $25-35/hr for comparable roles. At $22/hr, your offer is below market by approximately 15-20%. After Seattle cost-of-living (rent avg $1,800/mo for shared housing), your take-home would be tight. However — does the offer include housing stipend or relocation?",
      },
      {
        role: "atlas",
        content:
          "I've drafted a negotiation email for you that references market data without being aggressive. The key ask: bump to $27/hr or add a $3,000 housing stipend. I've also booked a 15-minute career counselor session for tomorrow morning to review your approach before sending. You have 48 hours — that's enough time to negotiate once.",
      },
      {
        role: "confirmation",
        content: "Negotiation Support",
        confirmationOptions: {
          primary: "Review Draft Email",
          secondary: "Book Career Session",
          detail: "Market data analysis + negotiation email draft ready",
        },
      },
    ],
    actions: [
      { id: "C6", pillar: "career", title: "Market Comp Data Pulled", description: "Median: $28/hr for PM intern in Seattle. Your offer: $22/hr (below market ~20%)", status: "Complete" },
      { id: "C7", pillar: "career", title: "Cost-of-Living Calculated", description: "Seattle rent avg $1,800/mo shared. Net take-home analysis complete", status: "Complete" },
      { id: "C8", pillar: "career", title: "Negotiation Email Drafted", description: "Professional counter-offer requesting $27/hr or $3K housing stipend", status: "Ready" },
      { id: "C9", pillar: "career", title: "Career Counselor Booked", description: "15-minute session tomorrow AM to review negotiation strategy", status: "Complete" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // PILLAR 4: ACADEMIC SUPPORT & ADVISING
  // ═══════════════════════════════════════════════════
  {
    id: "acad-minor",
    pillar: "academic",
    pillarLabel: "Academic Advising",
    title: "Adding a Minor",
    trigger: "Can I add Data Science minor and still graduate on time?",
    messages: [
      {
        role: "user",
        content: "I want to add a Data Science minor but I'm not sure if I can still graduate on time.",
      },
      {
        role: "atlas",
        content:
          "Great question — let me pull your complete degree audit and map the Data Science minor requirements against your remaining schedule. I'll check for conflicts, prerequisites, and section availability.",
      },
      {
        role: "atlas",
        content:
          "Good news: the minor is feasible. You need 5 additional courses (15 credits). You've already completed 2 prerequisites (STAT 311 and CS 301). Here are your two options:\n\nOption A — On-time graduation (May 2027): Take 2 DS courses per semester for the next 3 semesters. One bottleneck: DS 410 only offered in Fall, so you'd need to take it Fall 2026.\n\nOption B — Accelerated (May 2027, lighter senior year): Take 1 summer course (DS 320, available online) to free up your senior spring for lighter load.",
      },
      {
        role: "atlas",
        content:
          "I've pre-filled the minor declaration form and attached the pathway analysis. This is ready to route to your advisor, Dr. Patel, for signature. Want me to send it?",
      },
      {
        role: "confirmation",
        content: "Minor Declaration",
        confirmationOptions: {
          primary: "Send to Advisor",
          secondary: "Review Pathways First",
          detail: "Declaration form + graduation pathway analysis → Dr. Patel for signature",
        },
      },
    ],
    actions: [
      { id: "A1", pillar: "academic", title: "Degree Audit Analyzed", description: "Complete audit pulled — 87/120 credits, all prerequisites checked", status: "Complete" },
      { id: "A2", pillar: "academic", title: "Two Graduation Pathways Generated", description: "Option A: standard timeline. Option B: summer accelerated. Both feasible for May 2027", status: "Complete" },
      { id: "A3", pillar: "academic", title: "Course Conflicts Checked", description: "DS 410 bottleneck identified — only offered Fall semester. Mapped into pathway", status: "Complete" },
      { id: "A4", pillar: "academic", title: "Minor Declaration Pre-filled", description: "Form ready with pathway analysis attached — pending advisor signature", status: "Awaiting" },
    ],
  },
  {
    id: "acad-failing",
    pillar: "academic",
    pillarLabel: "Academic Advising",
    title: "Failing a Course",
    trigger: "Failing MATH 208 — withdrawal deadline in 5 days",
    messages: [
      {
        role: "user",
        content: "I'm failing MATH 208 and the withdrawal deadline is in 5 days.",
      },
      {
        role: "atlas",
        content:
          "Jordan, this is a time-sensitive decision and I want to make sure you have all the facts before you decide. I'm running the numbers on both scenarios right now.",
      },
      {
        role: "atlas",
        content:
          "Here's the impact analysis:\n\nScenario 1 — Withdraw (W on transcript): GPA stays at 3.52. No financial aid impact. No effect on athletic eligibility. W appears on transcript but is not calculated in GPA.\n\nScenario 2 — Stay and fail (F): GPA drops to 3.18. This would remove you from Dean's List and could trigger a Satisfactory Academic Progress review for financial aid.\n\nMy recommendation: Stay in the course with intensive tutoring support. Your midterm was a 58 — students who score 50-65 at midterm and attend tutoring have an 73% pass rate in MATH 208.",
      },
      {
        role: "atlas",
        content:
          "I've taken two parallel actions: (1) Booked an emergency advising appointment with Dr. Patel for Wednesday 2pm — I've pre-sent a decision brief so your meeting is a real decision conversation, not an information-gathering session. (2) Scheduled tutoring sessions Mon/Wed/Fri at 4pm for the remaining 4 weeks. I also drafted an email to Professor Liu requesting office hours — ready to send with one tap.",
      },
      {
        role: "confirmation",
        content: "Confirm Actions",
        confirmationOptions: {
          primary: "Confirm Tutoring + Send Email",
          secondary: "Just Book Advising",
          detail: "Tutoring: Mon/Wed/Fri 4pm · Professor email: office hours request",
        },
      },
    ],
    actions: [
      { id: "A5", pillar: "academic", title: "GPA Impact Calculated", description: "Withdraw: GPA stays 3.52. Fail: GPA drops to 3.18. Aid + eligibility checked", status: "Complete" },
      { id: "A6", pillar: "academic", title: "Emergency Advising Booked", description: "Wed 2pm with Dr. Patel — decision brief pre-sent with both scenario analyses", status: "Complete" },
      { id: "A7", pillar: "academic", title: "Tutoring Sessions Scheduled", description: "Mon/Wed/Fri 4pm for 4 weeks — MATH 208 Tutoring Center. Pending confirmation", status: "Awaiting" },
      { id: "A8", pillar: "academic", title: "Professor Email Drafted", description: "Office hours request to Prof. Liu — personalized, ready to send with one tap", status: "Ready" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // PILLAR 5: CAMPUS NAVIGATION & ADMIN
  // ═══════════════════════════════════════════════════
  {
    id: "admin-hold",
    pillar: "admin",
    pillarLabel: "Campus Admin",
    title: "Account Hold Resolution",
    trigger: "Hold on account for 3 weeks — nobody responds",
    messages: [
      {
        role: "user",
        content: "I've been trying to get a hold removed from my account for 3 weeks. Nobody responds to my emails.",
      },
      {
        role: "atlas",
        content:
          "That's incredibly frustrating, Jordan, and it shouldn't take 3 weeks. Let me identify exactly what's going on and route this to the right person — not a general inbox.",
      },
      {
        role: "atlas",
        content:
          "Found it. You have a Library Fine Hold ($47.50) placed by the University Library on February 10th. The specific document needed is a fine payment or dispute form. The responsible office is the Library Circulation Desk, but I can see your 3 emails went to the general library inbox which has a 2-week response backlog.",
      },
      {
        role: "atlas",
        content:
          "I've created a formal resolution request routed directly to the Library Circulation Manager (not the general inbox) with your 3-week attempt history attached as documentation. Since your registration deadline is in 6 days, I've also escalated to the Dean of Students office with the full documentation trail. The Dean's office has a 24-hour response SLA for registration-blocking holds.",
      },
      {
        role: "atlas-success",
        content:
          "Your resolution request is in motion with the right people. Expected resolution: 24-48 hours. I'll notify you the moment the hold is cleared. In the meantime, your course selections are saved and will process automatically once the hold lifts.",
      },
    ],
    actions: [
      { id: "D1", pillar: "admin", title: "Hold Type Identified", description: "Library Fine Hold ($47.50) — placed Feb 10. Required: payment or dispute form", status: "Complete" },
      { id: "D2", pillar: "admin", title: "Direct Resolution Request Filed", description: "Routed to Library Circulation Manager (bypassing general inbox backlog)", status: "In Progress" },
      { id: "D3", pillar: "admin", title: "Escalated to Dean of Students", description: "Registration deadline in 6 days — full 3-week documentation trail attached", status: "In Progress" },
      { id: "D4", pillar: "admin", title: "Course Selections Protected", description: "Saved selections will auto-process when hold clears — no re-registration needed", status: "Complete" },
    ],
  },
  {
    id: "admin-notary",
    pillar: "admin",
    pillarLabel: "Campus Admin",
    title: "Campus Services",
    trigger: "Need a notary for apartment lease on campus",
    messages: [
      {
        role: "user",
        content: "I need to find a notary for my apartment lease and I have no idea where to go on campus.",
      },
      {
        role: "atlas",
        content:
          "Easy — there are 2 free notary locations on campus. Let me check hours and availability right now.",
      },
      {
        role: "atlas",
        content:
          "Here are your options:\n\n1. Student Legal Services — HUB Room 306. Open today until 4:30 PM. Walk-in available, but I can book a slot to skip any wait.\n\n2. Office of the Registrar — Mary Gates Hall, Suite 120. By appointment only, next available: tomorrow 11 AM.\n\nBoth are completely free for enrolled students. You just need your student ID and the document to be notarized.",
      },
      {
        role: "confirmation",
        content: "Book Notary Appointment",
        confirmationOptions: {
          primary: "Book Today at Legal Services",
          secondary: "Book Tomorrow at Registrar",
          detail: "Free notary service — bring student ID + lease document",
        },
      },
      {
        role: "atlas-success",
        content:
          "Done — you're booked at Student Legal Services today at 3:00 PM, HUB Room 306. Bring your student ID and the lease. The appointment will take about 10 minutes.",
      },
    ],
    actions: [
      { id: "D5", pillar: "admin", title: "Notary Locations Found", description: "2 free campus locations: Student Legal Services (HUB 306) + Registrar (Mary Gates 120)", status: "Complete" },
      { id: "D6", pillar: "admin", title: "Availability Checked", description: "Legal Services: walk-in today until 4:30 PM. Registrar: tomorrow 11 AM by appointment", status: "Complete" },
      { id: "D7", pillar: "admin", title: "Appointment Booked", description: "Today 3:00 PM — Student Legal Services, HUB Room 306. ~10 minutes", status: "Complete" },
    ],
  },
];

export const pillarConfig = {
  financial: { label: "Financial Aid", color: "text-foreground" },
  wellness: { label: "Mental Health", color: "text-foreground" },
  career: { label: "Career & Jobs", color: "text-foreground" },
  academic: { label: "Academic", color: "text-foreground" },
  admin: { label: "Campus Admin", color: "text-foreground" },
};
