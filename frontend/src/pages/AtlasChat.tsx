import { useState, useRef, useEffect } from "react";
import { Send, Zap, CheckCircle2, Clock, Loader2, AlertTriangle, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { scenarios, pillarConfig, type Scenario, type ActionItem, type ChatMessage } from "@/data/atlasScenarios";
import { ChatUiRenderer, type UiTrigger } from "@/components/chat/ChatUiRenderer";

/* ─── Action Log types ─── */
interface ActionLogItem {
  id: string;
  title: string;
  description: string;
  status: "Complete" | "In Progress" | "Awaiting" | "Ready" | "Human Taking Over";
  isCrisis?: boolean;
  agentforceNote?: string;
}

const statusConfig = {
  "Complete": { class: "pill-success", icon: <CheckCircle2 className="w-3 h-3" /> },
  "In Progress": { class: "pill-warning", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  "Awaiting": { class: "pill-neutral", icon: <Clock className="w-3 h-3" /> },
  "Ready": { class: "pill-success", icon: <CheckCircle2 className="w-3 h-3" /> },
  "Human Taking Over": { class: "pill-danger", icon: <AlertTriangle className="w-3 h-3" /> },
};

/* ─── Keyword-based contextual response engine (same as AtlasDrawer) ─── */
interface ResponseRule {
  keywords: string[];
  responses: string[];
  actions: ActionLogItem[];
  action?: { label: string; path: string };
}

const responseRules: ResponseRule[] = [
  // Financial Aid
  {
    keywords: ["financial", "aid", "award", "grant", "scholarship", "fafsa", "money", "tuition", "fee", "payment", "billing", "efc"],
    responses: [
      "I'm pulling up your financial aid profile now, Jordan. Let me check your award history and identify any discrepancies.",
      "I can see your current aid package. Your Expected Family Contribution changed this year, which affected your grant amount by $3,000. I've identified a missing verification document — your 2025 IRS Tax Return Transcript. I'm starting the resolution process now.",
      "I've taken 3 actions: (1) pre-filled your verification form, (2) filed an appeal with urgency flag, and (3) placed a hold prevention flag on your account. Your Spring registration is protected. I also found 2 emergency funding sources you're eligible for.",
    ],
    actions: [
      { id: "FA-001", title: "Pull financial aid history", description: "Retrieved award letter for 2025-26 academic year", status: "Complete", agentforceNote: "Data Cloud · Student record retrieval" },
      { id: "FA-002", title: "Identify EFC discrepancy", description: "Found EFC change impacting $3,000 grant reduction", status: "Complete", agentforceNote: "CRM Analytics · Year-over-year comparison" },
      { id: "FA-003", title: "Pre-fill verification form", description: "Auto-populated IRS Tax Return Transcript form", status: "Complete", agentforceNote: "Flow Orchestration · Auto-fill workflow" },
      { id: "FA-004", title: "File financial aid appeal", description: "Submitted appeal with urgency flag to Financial Aid Office", status: "In Progress", agentforceNote: "Service Cloud · Case creation & escalation" },
      { id: "FA-005", title: "Place hold prevention flag", description: "Protected Spring registration from financial hold", status: "Complete", agentforceNote: "Flow Orchestration · Preventive hold logic" },
      { id: "FA-006", title: "Identify emergency funding", description: "Found 2 eligible emergency funding sources", status: "Ready", agentforceNote: "Einstein AI · Eligibility matching" },
    ],
    action: { label: "View Financial Details", path: "/financial" },
  },
  {
    keywords: ["textbook", "book", "course material"],
    responses: [
      "Let me check textbook options for your enrolled courses, Jordan.",
      "Good news — 3 of your 4 required textbooks are available through the University Textbook Lending Program at no cost. For the remaining one, I found an OpenStax alternative your professor has approved. I've also initiated a $150 micro-grant application for backup.",
    ],
    actions: [
      { id: "TB-001", title: "Check Textbook Lending Program", description: "3 of 4 textbooks available at no cost", status: "Complete", agentforceNote: "MuleSoft · Library inventory API" },
      { id: "TB-002", title: "Find OpenStax alternative", description: "Professor-approved free alternative found", status: "Complete", agentforceNote: "Knowledge Base · OER database search" },
      { id: "TB-003", title: "Initiate micro-grant application", description: "$150 textbook micro-grant submitted", status: "In Progress", agentforceNote: "Flow Orchestration · Grant pipeline" },
    ],
    action: { label: "View Financial Aid", path: "/financial" },
  },
  // Wellness
  {
    keywords: ["stress", "sleep", "overwhelm", "anxious", "anxiety", "depress", "mental", "wellness", "counselor", "therapy", "tired", "burnout", "lonely", "alone"],
    responses: [
      "I hear you, Jordan. Let me make sure you get the right support — not just a list of resources.",
      "I've found a same-day counselor slot with Dr. Maya Chen — Tomorrow at 3:00 PM at the Wellness Center. I've also put together a personalized toolkit with resources for sleep and stress management, sent to your phone. Your wellness pulse scores have been declining for 3 weeks, so I've sent a confidential check-in request to your advisor.",
    ],
    actions: [
      { id: "WE-001", title: "Analyze wellness pulse scores", description: "Decline detected over 3-week period in sleep metrics", status: "Complete", agentforceNote: "CRM Analytics · Wellness trend detection" },
      { id: "WE-002", title: "Book counselor appointment", description: "Dr. Maya Chen — Tomorrow 3:00 PM, Wellness Center", status: "Complete", agentforceNote: "MuleSoft · Calendar integration" },
      { id: "WE-003", title: "Generate coping toolkit", description: "Personalized sleep & stress resources sent to phone", status: "Complete", agentforceNote: "Marketing Cloud · Personalized SMS" },
      { id: "WE-004", title: "Notify academic advisor", description: "Confidential wellness check-in request to Dr. Patel", status: "In Progress", agentforceNote: "Slack Integration · Staff alerts" },
    ],
    action: { label: "View Wellness Resources", path: "/wellness" },
  },
  {
    keywords: ["crisis", "hurt", "suicide", "harm", "die", "hopeless", "give up", "can't go on", "end it"],
    responses: [
      "I hear you. What you're feeling matters, and I'm glad you told me. I want to make sure you have real support right now — not a ticket number, not next week.",
      "I've paged the on-call crisis counselor. They'll call you directly within the next few minutes. I've also sent a direct 24/7 callback number to your phone. You don't have to go through this alone. I'm staying right here with you until you confirm you've connected with someone.",
    ],
    actions: [
      { id: "CR-001", title: "Page on-call crisis counselor", description: "Emergency page sent — response expected in minutes", status: "In Progress", isCrisis: true, agentforceNote: "Service Cloud · Emergency escalation" },
      { id: "CR-002", title: "Send 24/7 callback number", description: "Direct crisis line sent to student phone", status: "Complete", isCrisis: true, agentforceNote: "Marketing Cloud · Priority SMS" },
      { id: "CR-003", title: "Escalate to Dean of Students", description: "Immediate wellbeing alert filed", status: "In Progress", isCrisis: true, agentforceNote: "Service Cloud · Priority escalation" },
    ],
    action: { label: "Crisis Support", path: "/wellness" },
  },
  // Career
  {
    keywords: ["intern", "job", "career", "resume", "interview", "pm", "product manager", "sde", "software", "apply", "application", "offer", "salary", "negotiate", "recruiting"],
    responses: [
      "Great goal, Jordan. Let me build you a personalized action plan based on your academic record and skills.",
      "Done. I parsed your transcript and identified 6 relevant courses and 2 projects. Your biggest gaps: SQL proficiency and a case study portfolio. I've generated a PM-focused resume, found 5 alumni at target companies with personalized outreach drafts, and synced recruiting deadlines to your calendar. Your 8-week plan starts today.",
    ],
    actions: [
      { id: "CA-001", title: "Parse academic transcript", description: "Identified 6 relevant courses and 2 portfolio projects", status: "Complete", agentforceNote: "Data Cloud · Transcript analysis" },
      { id: "CA-002", title: "Skill gap analysis", description: "Gaps identified: SQL proficiency, case study portfolio", status: "Complete", agentforceNote: "Einstein AI · Skill gap detection" },
      { id: "CA-003", title: "Generate PM resume", description: "Tailored resume draft created with project highlights", status: "Complete", agentforceNote: "Einstein AI · Resume generation" },
      { id: "CA-004", title: "Alumni network search", description: "5 alumni at target companies with outreach drafts", status: "Ready", agentforceNote: "Data Cloud · Alumni graph search" },
      { id: "CA-005", title: "Sync recruiting deadlines", description: "All deadlines synced to student calendar", status: "Complete", agentforceNote: "MuleSoft · Calendar integration" },
      { id: "CA-006", title: "Create 8-week recruiting plan", description: "Personalized plan with weekly milestones", status: "In Progress", agentforceNote: "Flow Orchestration · Plan builder" },
    ],
    action: { label: "View Career Services", path: "/jobs" },
  },
  // Academic
  {
    keywords: ["gpa", "grade", "course", "class", "fail", "withdraw", "tutor", "advisor", "academic", "credit", "degree", "major", "minor", "math", "professor", "exam", "final"],
    responses: [
      "Let me pull your complete degree audit and run the numbers, Jordan.",
      "Here's the analysis: Your current GPA is 3.41 with 87 of 120 credits complete. MATH 208 is currently at C-, which I flagged. I've booked an emergency tutoring session and contacted your professor. If you wish, I can schedule an academic advisor meeting with Dr. Patel this week.",
    ],
    actions: [
      { id: "AC-001", title: "Run degree audit", description: "87 of 120 credits complete — on track for May 2027", status: "Complete", agentforceNote: "Data Cloud · Degree audit aggregation" },
      { id: "AC-002", title: "GPA scenario analysis", description: "Current 3.41 — drop to 3.33 if MATH 208 stays at C-", status: "Complete", agentforceNote: "CRM Analytics · GPA scenario engine" },
      { id: "AC-003", title: "Book emergency tutoring", description: "MATH 208 tutoring — Today 4:00 PM, Learning Commons", status: "Complete", agentforceNote: "MuleSoft · Tutoring system API" },
      { id: "AC-004", title: "Contact professor", description: "Email sent to Prof. Johnson requesting support options", status: "In Progress", agentforceNote: "Einstein AI · Email generation" },
      { id: "AC-005", title: "Schedule advisor meeting", description: "Dr. Patel available Thursday 2 PM", status: "Awaiting", agentforceNote: "MuleSoft · Advisor calendar API" },
    ],
    action: { label: "View Academic Details", path: "/academic" },
  },
  // Admin / Hold
  {
    keywords: ["hold", "registration", "register", "admin", "office", "notary", "document", "form", "transcript", "enrollment"],
    responses: [
      "Let me identify what's blocking your account, Jordan.",
      "Found it. You have a Financial Verification hold placed by the Financial Aid Office on Feb 28. The root cause is an incomplete FAFSA verification form. I've pre-filled the form, routed it to the correct office, and escalated to the Dean of Students since your registration deadline is in 3 days. Expected resolution: 24-48 hours.",
    ],
    actions: [
      { id: "AD-001", title: "Identify account holds", description: "Financial Verification hold found — placed Feb 28", status: "Complete", agentforceNote: "Data Cloud · Account hold detection" },
      { id: "AD-002", title: "Trace root cause", description: "Incomplete FAFSA verification form identified", status: "Complete", agentforceNote: "Einstein AI · Root cause analysis" },
      { id: "AD-003", title: "Pre-fill resolution form", description: "Verification form auto-populated with student data", status: "Complete", agentforceNote: "Flow Orchestration · Auto-fill" },
      { id: "AD-004", title: "Route to correct office", description: "Sent directly to Financial Aid — not general inbox", status: "In Progress", agentforceNote: "Service Cloud · Smart routing" },
      { id: "AD-005", title: "Escalate to Dean of Students", description: "Registration deadline urgency flag — 3 days remaining", status: "In Progress", agentforceNote: "Service Cloud · Priority escalation" },
    ],
    action: { label: "View Details", path: "/chat" },
  },
];

const fallbackResponses = [
  "I'm analyzing your request now, Jordan. Let me pull up the relevant information from your student profile and take action.",
  "I understand. Let me look into this and coordinate across your student services. I'll have specific actions and next steps ready shortly.",
];

const fallbackActions: ActionLogItem[] = [
  { id: "GEN-001", title: "Analyze student request", description: "Parsing message and identifying relevant services", status: "In Progress", agentforceNote: "Einstein AI · Intent classification" },
  { id: "GEN-002", title: "Pull student profile", description: "Gathering data from enrolled services", status: "Awaiting", agentforceNote: "Data Cloud · Profile aggregation" },
];

function getContextualResponse(userMessage: string): { responses: string[]; actions: ActionLogItem[]; action?: { label: string; path: string } } {
  const lower = userMessage.toLowerCase();
  let bestRule: ResponseRule | null = null;
  let bestScore = 0;

  for (const rule of responseRules) {
    const score = rule.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  if (bestRule && bestScore > 0) {
    return { responses: bestRule.responses, actions: bestRule.actions, action: bestRule.action };
  }

  return { responses: fallbackResponses, actions: fallbackActions, action: { label: "View Dashboard", path: "/dashboard" } };
}

/* ─── Chat message type ─── */
interface LiveMessage {
  role: "user" | "atlas";
  text: string;
  action?: { label: string; path: string };
  uiTriggers?: UiTrigger[];
}

/* ─── Quick prompts ─── */
const quickPrompts = [
  "I don't understand my financial aid letter",
  "I'm stressed and can't sleep",
  "I need a PM internship this summer",
  "I'm failing MATH 208",
  "I have a hold on my account",
];

/* ─── Scenario selector (kept for demo mode) ─── */
const pillarKeys = Object.keys(pillarConfig) as Array<keyof typeof pillarConfig>;

const ActionRow = ({ action, index }: { action: ActionLogItem; index: number }) => {
  const cfg = statusConfig[action.status];
  return (
    <div
      className={`flex gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors animate-fade-in-up ${action.isCrisis ? "bg-destructive/5" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="w-1 rounded-full shrink-0 bg-foreground/20" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono-accent text-[10px] text-muted-foreground">
            {action.isCrisis ? "ALERT" : `#${action.id}`}
          </span>
          <h3 className="text-sm font-medium text-foreground truncate">{action.title}</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
        {action.agentforceNote && (
          <span className="agentforce-badge mt-1.5">
            <Zap className="w-2.5 h-2.5" />
            {action.agentforceNote}
          </span>
        )}
      </div>
      <span className={`${cfg.class} shrink-0 text-[10px] flex items-center gap-1 self-start mt-0.5`}>
        {cfg.icon}
        {action.status}
      </span>
    </div>
  );
};

const AtlasChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [actionLog, setActionLog] = useState<ActionLogItem[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Demo mode state
  const [mode, setMode] = useState<"live" | "demo">("live");
  const [selectedPillar, setSelectedPillar] = useState<keyof typeof pillarConfig>("financial");
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const pillarScenarios = scenarios.filter((s) => s.pillar === selectedPillar);

  const handlePillarChange = (pillar: keyof typeof pillarConfig) => {
    setSelectedPillar(pillar);
    const first = scenarios.find((s) => s.pillar === pillar);
    if (first) setSelectedScenario(first);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/actions/process_chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, netid: "jordan123" }),
      });

      if (!response.ok) throw new Error("Backend request failed");

      const data = await response.json();

      // Delay response slightly for natural feel
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "atlas",
            text: data.text,
            action: data.action,
            uiTriggers: data.ui_triggers,
          },
        ]);

        // Add actions to the Action Log progressively
        if (data.actions && data.actions.length > 0) {
          data.actions.forEach((act: any, i: number) => {
            setTimeout(() => {
              setActionLog((prev) => {
                const newAction: ActionLogItem = {
                  id: `SF-${Math.floor(Math.random() * 1000)}`,
                  title: act.type === "info" ? "Data Retrieval" :
                    act.type === "warning" ? "Hold Detected" : "System Action",
                  description: act.description,
                  status: act.status === "completed" ? "Complete" :
                    act.status === "pending" ? "In Progress" : "Awaiting",
                  agentforceNote: act.agentforceNote,
                };
                return [...prev, newAction];
              });
            }, i * 600 + 400);
          });
        }
      }, 1000);

    } catch (error) {
      console.error("Error calling backend:", error);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "atlas",
            text: "I'm having trouble connecting to my backend right now. Please ensure the Django server is running.",
          },
        ]);
      }, 1000);
    }
  };

  const completedCount = actionLog.filter((a) => a.status === "Complete" || a.status === "Ready").length;
  const inProgressCount = actionLog.filter((a) => a.status === "In Progress" || a.status === "Awaiting" || a.status === "Human Taking Over").length;

  // Demo scenario counts
  const demoCompleted = selectedScenario.actions.filter((a) => a.status === "Complete" || a.status === "Ready").length;
  const demoInProgress = selectedScenario.actions.filter((a) => a.status === "In Progress" || a.status === "Awaiting" || a.status === "Human Taking Over").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
      {/* Mode Toggle */}
      <div className="mb-4 animate-fade-in-up flex items-center gap-3 flex-wrap" data-tutorial="scenario-tabs">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setMode("live")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "live" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Live Chat
          </button>
          <button
            onClick={() => setMode("demo")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "demo" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Demo Scenarios
          </button>
        </div>

        {mode === "demo" && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              {pillarKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => handlePillarChange(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedPillar === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {pillarConfig[key].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full">
              {pillarScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedScenario.id === s.id
                    ? "border-foreground/20 bg-card text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/10"
                    }`}
                >
                  <ChevronRight className="w-3 h-3" />
                  {s.title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Chat + Actions layout */}
      <div className="flex flex-col lg:flex-row gap-4" style={{ height: "calc(100vh - 14rem)" }}>
        {/* LEFT: Chat */}
        <div className="lg:w-[45%] flex flex-col glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-header flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">Atlas Assistant</h2>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {mode === "demo"
                  ? `${selectedScenario.pillarLabel} · ${selectedScenario.title}`
                  : "Powered by Salesforce Agentforce"
                }
              </p>
            </div>
          </div>

          {mode === "live" ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-sm font-medium text-foreground mb-1">Hi Jordan, I'm Atlas</p>
                      <p className="text-xs text-muted-foreground">
                        I don't just answer questions — I take action. Tell me what's going on and I'll handle it. You'll see every action I take in the Action Log on the right.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Try asking</p>
                      <div className="space-y-2">
                        {quickPrompts.map((p) => (
                          <button
                            key={p}
                            onClick={() => sendMessage(p)}
                            className="w-full text-left text-sm px-3 py-2 rounded-md border border-border hover:bg-secondary transition-colors text-foreground"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                          }`}
                      >
                        {msg.text}
                      </div>
                      {msg.action && (
                        <button
                          onClick={() => navigate(msg.action!.path)}
                          className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline pl-1"
                        >
                          {msg.action.label} <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {msg.uiTriggers && msg.uiTriggers.length > 0 && (
                        <ChatUiRenderer
                          triggers={msg.uiTriggers}
                          onAction={(action, payload) => {
                            console.log("Chat UI action:", action, payload);
                            // Future: dispatch follow-up messages to the agent
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-secondary rounded-lg px-4 py-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
                  className="flex gap-2"
                  data-tutorial="chat-input"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Describe what's going on…"
                    className="flex-1 px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-3 py-2.5 gradient-header rounded-lg text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" key={selectedScenario.id}>
                {selectedScenario.messages.map((msg, i) => {
                  if (msg.role === "user") {
                    return (
                      <div key={`${selectedScenario.id}-${i}`} className="flex justify-end animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="max-w-[80%] bg-primary text-primary-foreground rounded-xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }
                  if (msg.role === "confirmation" && msg.confirmationOptions) {
                    return (
                      <div key={`${selectedScenario.id}-${i}`} className="flex justify-start animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="max-w-[80%] border border-primary/30 rounded-xl p-4 bg-card">
                          <h3 className="text-sm font-semibold text-foreground mb-1">{msg.content}</h3>
                          <p className="text-xs text-muted-foreground mb-3">{msg.confirmationOptions.detail}</p>
                          <div className="flex gap-2">
                            <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                              {msg.confirmationOptions.primary}
                            </button>
                            <button className="px-4 py-1.5 border border-border text-foreground rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
                              {msg.confirmationOptions.secondary}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const isCrisis = msg.role === "atlas-crisis";
                  const isSuccess = msg.role === "atlas-success";
                  return (
                    <div key={`${selectedScenario.id}-${i}`} className="flex justify-start animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className={`max-w-[80%] rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed ${isCrisis ? "bg-destructive/5 border border-destructive/15 text-foreground" :
                        isSuccess ? "bg-secondary border border-border text-foreground" :
                          "bg-secondary text-secondary-foreground"
                        }`}>
                        {isCrisis && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                            <span className="text-xs font-semibold text-destructive">Support mode</span>
                          </div>
                        )}
                        {isSuccess && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                            <span className="text-xs font-semibold text-foreground">All actions complete</span>
                          </div>
                        )}
                        <span style={{ whiteSpace: "pre-line" }}>{msg.content}</span>
                        {msg.uiTriggers && msg.uiTriggers.length > 0 && (
                          <div className="mt-3">
                            <ChatUiRenderer triggers={msg.uiTriggers} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground text-center">
                  Demo Mode — Pre-scripted scenarios showcasing Atlas capabilities. Switch to Live Chat to interact.
                </p>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="lg:w-[55%] flex flex-col glass-card overflow-hidden" data-tutorial="action-log">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Action Log</h2>
            <div className="flex items-center gap-2">
              {mode === "live" ? (
                <>
                  {actionLog.length > 0 && <span className="pill-success text-[10px]">{completedCount} complete</span>}
                  {inProgressCount > 0 && <span className="pill-warning text-[10px]">{inProgressCount} in progress</span>}
                  {actionLog.length === 0 && <span className="text-[10px] text-muted-foreground">No actions yet</span>}
                </>
              ) : (
                <>
                  <span className="pill-success text-[10px]">{demoCompleted} complete</span>
                  {demoInProgress > 0 && <span className="pill-warning text-[10px]">{demoInProgress} in progress</span>}
                </>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border" key={mode === "demo" ? selectedScenario.id : "live"}>
            {mode === "live" ? (
              actionLog.length > 0 ? (
                actionLog.map((a, i) => <ActionRow key={a.id} action={a} index={i} />)
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Send a message to see Atlas take action</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Every action will appear here in real time</p>
                  </div>
                </div>
              )
            ) : (
              selectedScenario.actions.map((a, i) => (
                <ActionRow key={`${selectedScenario.id}-${a.id}`} action={a} index={i} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <p className="text-[10px] text-muted-foreground">Powered by Salesforce Agentforce</p>
      </div>
    </div>
  );
};

export default AtlasChat;
