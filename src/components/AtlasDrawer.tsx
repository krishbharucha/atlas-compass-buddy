import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Zap, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const quickPrompts = [
  "I don't understand my financial aid letter",
  "I'm stressed and can't sleep",
  "I need a PM internship this summer",
  "I'm failing MATH 208",
  "I have a hold on my account",
];

interface Message {
  role: "user" | "atlas";
  text: string;
  action?: { label: string; path: string };
}

/* ─── Keyword-based contextual response engine ─── */
interface ResponseRule {
  keywords: string[];
  responses: string[];
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
    action: { label: "View Financial Details", path: "/financial" },
  },
  {
    keywords: ["textbook", "book", "course material"],
    responses: [
      "Let me check textbook options for your enrolled courses, Jordan.",
      "Good news — 3 of your 4 required textbooks are available through the University Textbook Lending Program at no cost. For the remaining one, I found an OpenStax alternative your professor has approved. I've also initiated a $150 micro-grant application for backup.",
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
    action: { label: "View Wellness Resources", path: "/wellness" },
  },
  {
    keywords: ["crisis", "hurt", "suicide", "harm", "die", "hopeless", "give up", "can't go on", "end it"],
    responses: [
      "I hear you. What you're feeling matters, and I'm glad you told me. I want to make sure you have real support right now — not a ticket number, not next week.",
      "I've paged the on-call crisis counselor. They'll call you directly within the next few minutes. I've also sent a direct 24/7 callback number to your phone. You don't have to go through this alone. I'm staying right here with you until you confirm you've connected with someone.",
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
    action: { label: "View Career Services", path: "/jobs" },
  },
  // Academic
  {
    keywords: ["gpa", "grade", "course", "class", "fail", "withdraw", "tutor", "advisor", "academic", "credit", "degree", "major", "minor", "math", "professor", "exam", "final"],
    responses: [
      "Let me pull your complete degree audit and run the numbers, Jordan.",
      "Here's the analysis: Your current GPA is 3.41 with 87 of 120 credits complete. I've checked multiple scenarios and have recommendations ready. I've also booked an emergency advising session with Dr. Patel and scheduled tutoring if needed. Want me to draft an email to your professor?",
    ],
    action: { label: "View Academic Details", path: "/academic" },
  },
  // Admin / Hold
  {
    keywords: ["hold", "registration", "register", "admin", "office", "notary", "document", "form", "transcript", "enrollment"],
    responses: [
      "Let me identify what's blocking your account, Jordan.",
      "Found it. I can see the hold on your account and have traced the root cause. I've created a resolution request routed directly to the right person — not a general inbox. Since your registration deadline is approaching, I've also escalated to the Dean of Students office with the full documentation trail. Expected resolution: 24-48 hours.",
    ],
    action: { label: "View Details", path: "/chat" },
  },
];

const fallbackResponses = [
  "I'm analyzing your request now, Jordan. Let me pull up the relevant information from your student profile and take action.",
  "I understand. Let me look into this and coordinate across your student services. I'll have specific actions and next steps ready shortly. In the meantime, you can explore your dashboard for a full overview.",
];

function getContextualResponse(userMessage: string): { responses: string[]; action?: { label: string; path: string } } {
  const lower = userMessage.toLowerCase();

  // Score each rule by number of keyword matches
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
    return { responses: bestRule.responses, action: bestRule.action };
  }

  return { responses: fallbackResponses, action: { label: "View Dashboard", path: "/dashboard" } };
}

const AtlasDrawer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);

    const { responses, action } = getContextualResponse(text);

    // Simulate multi-step response delivery
    let delay = 1200;
    responses.forEach((response, i) => {
      setTimeout(() => {
        if (i === responses.length - 1) setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "atlas",
            text: response,
            action: i === responses.length - 1 ? action : undefined,
          },
        ]);
        if (i < responses.length - 1) setTyping(true);
      }, delay);
      delay += 1800 + Math.random() * 800;
    });
  };

  return (
    <>
      {/* Floating Bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-lg hover:opacity-90 transition-all group animate-fade-in"
          data-tutorial="atlas-fab"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Ask Atlas</span>
        </button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          {/* Header */}
          <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-base">Atlas AI</SheetTitle>
                <p className="text-xs text-muted-foreground">Powered by Salesforce Agentforce</p>
              </div>
            </div>
          </SheetHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Hi Jordan, I'm Atlas</p>
                  <p className="text-xs text-muted-foreground">
                    I don't just answer questions — I take action. Tell me what's going on and I'll handle it.
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
                    className={`rounded-lg px-3 py-2 text-sm ${msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                      }`}
                  >
                    {msg.text}
                  </div>
                  {msg.action && (
                    <button
                      onClick={() => { navigate(msg.action!.path); setOpen(false); }}
                      className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline pl-1"
                    >
                      {msg.action.label} <ArrowRight className="w-3 h-3" />
                    </button>
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

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what's going on…"
                className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
              />
              <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AtlasDrawer;
