import { useState } from "react";
import { Send, Heart, DollarSign, BookOpen, Briefcase, Landmark, AlertTriangle, Zap, CheckCircle2, Clock, Loader2 } from "lucide-react";

interface ActionItem {
  num: number;
  pillarIcon: React.ReactNode;
  borderColor: string;
  title: string;
  description: string;
  status: string;
  statusClass: string;
  statusIcon: React.ReactNode;
  isCrisis?: boolean;
}

const baseActions: ActionItem[] = [
  { num: 1, pillarIcon: <Heart className="w-3.5 h-3.5 text-primary" />, borderColor: "border-l-primary", title: "Counseling Appointment Booked", description: "Same-day slot secured: Tomorrow, Thursday 10:00am", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
  { num: 2, pillarIcon: <Heart className="w-3.5 h-3.5 text-primary" />, borderColor: "border-l-primary", title: "Wellness Toolkit Sent", description: "3 sleep + stress resources sent to your phone via SMS", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
  { num: 3, pillarIcon: <DollarSign className="w-3.5 h-3.5 text-accent" />, borderColor: "border-l-accent", title: "Aid Issue Identified", description: "Root cause: Missing income verification document", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
  { num: 4, pillarIcon: <DollarSign className="w-3.5 h-3.5 text-accent" />, borderColor: "border-l-accent", title: "Appeal Filed & Routed", description: "Pre-filled appeal sent to Financial Aid with urgency flag", status: "In Progress", statusClass: "pill-warning", statusIcon: <Loader2 className="w-3 h-3 animate-spin" /> },
  { num: 5, pillarIcon: <DollarSign className="w-3.5 h-3.5 text-accent" />, borderColor: "border-l-accent", title: "Hold Prevention Flag Placed", description: "Account protected — registration safe during appeal", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
  { num: 6, pillarIcon: <BookOpen className="w-3.5 h-3.5 text-purple-medium" />, borderColor: "border-l-purple-medium", title: "Withdrawal Impact Calculated", description: "W keeps GPA at 3.41. Fail drops to 3.18. Recommendation: Stay + tutoring.", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
  { num: 7, pillarIcon: <BookOpen className="w-3.5 h-3.5 text-purple-medium" />, borderColor: "border-l-purple-medium", title: "Emergency Advising Booked", description: "Wed 2pm — Decision brief pre-sent to your advisor", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
  { num: 8, pillarIcon: <BookOpen className="w-3.5 h-3.5 text-purple-medium" />, borderColor: "border-l-purple-medium", title: "Tutoring Sessions Scheduled", description: "Mon/Wed/Fri 4pm — pending your confirmation", status: "Awaiting", statusClass: "pill-purple", statusIcon: <Clock className="w-3 h-3" /> },
  { num: 9, pillarIcon: <Briefcase className="w-3.5 h-3.5 text-accent" />, borderColor: "border-l-accent", title: "Internship Applications Pre-Filled", description: "Amazon SDE + Microsoft PM — ready for your review", status: "Ready", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
  { num: 10, pillarIcon: <Landmark className="w-3.5 h-3.5 text-muted-foreground" />, borderColor: "border-l-muted-foreground", title: "Library Hold Resolved", description: "Resolution request sent directly to Registrar — ETA 24hrs", status: "In Progress", statusClass: "pill-warning", statusIcon: <Loader2 className="w-3 h-3 animate-spin" /> },
];

const crisisAction: ActionItem = {
  num: 0, pillarIcon: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />, borderColor: "border-l-destructive", title: "Crisis Support Activated",
  description: "On-call counselor paged. Direct callback number sent to your phone. This conversation is being held safely.",
  status: "Human Taking Over", statusClass: "pill-danger", statusIcon: <AlertTriangle className="w-3 h-3" />, isCrisis: true,
};

const AtlasChat = () => {
  const [showEdgeCase, setShowEdgeCase] = useState(false);
  const actions = showEdgeCase ? [crisisAction, ...baseActions] : baseActions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
      <div className="flex flex-col lg:flex-row gap-4" style={{ height: "calc(100vh - 7.5rem)" }}>
        {/* LEFT: Chat */}
        <div className="lg:w-[45%] flex flex-col glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-header flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">Atlas Assistant</h2>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" /> Connected to all university systems
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Jordan */}
            <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="max-w-[80%] bg-primary text-primary-foreground rounded-xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
                I'm really struggling right now. My financial aid changed, I'm behind in one class, I haven't been sleeping, and internship deadlines are coming up. I don't know where to start.
              </div>
            </div>

            {/* Atlas 1 */}
            <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="max-w-[80%] bg-secondary text-secondary-foreground rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed">
                Jordan, that's a lot to carry at once — and it's completely understandable to feel overwhelmed. The good news is I can see everything going on and I know exactly what needs to happen. Let's handle the urgent stuff first, then build you a plan for the rest. I'm starting now.
              </div>
            </div>

            {/* Atlas 2 */}
            <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <div className="max-w-[80%] bg-secondary text-secondary-foreground rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed">
                I've identified <span className="font-semibold">10 actions</span> across your accounts. Watch the panel on the right as I work through each one. I'll need your confirmation at the end.
              </div>
            </div>

            {/* Atlas 3 */}
            <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <div className="max-w-[80%] bg-secondary text-secondary-foreground rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed">
                Everything is in motion, Jordan. Tonight, use the wellness resources I sent you. Tomorrow at 10am is your counseling appointment. Your aid appeal is filed and your account is protected. The only thing I need from you right now is to confirm your tutoring schedule.
              </div>
            </div>

            {/* Confirmation card */}
            <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <div className="max-w-[80%] border border-primary/30 rounded-xl p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Confirm Tutoring Schedule</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Mon / Wed / Fri at 4:00pm — MATH 208 Tutoring Center</p>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                    Confirm Schedule
                  </button>
                  <button className="px-4 py-1.5 border border-border text-foreground rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>

            {/* Final Atlas message */}
            <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              <div className="max-w-[80%] bg-success/10 text-foreground rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed border border-success/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-semibold text-success">All actions complete</span>
                </div>
                You're all set, Jordan. Go get some rest — I've handled everything else.
              </div>
            </div>

            {showEdgeCase && (
              <>
                <div className="flex justify-end animate-fade-in-up">
                  <div className="max-w-[80%] bg-primary text-primary-foreground rounded-xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
                    I don't really feel like things are going to get better.
                  </div>
                </div>
                <div className="flex justify-start animate-fade-in-up">
                  <div className="max-w-[80%] rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-destructive/5 border border-destructive/15 text-foreground">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Heart className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs font-semibold text-destructive">Support mode</span>
                    </div>
                    I hear you. What you're feeling matters, and I'm glad you told me. I want to make sure you have real support right now — not a ticket number. I'm connecting you with someone directly. Can you stay here with me for just a moment?
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Atlas anything..."
                className="flex-1 px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
              />
              <button className="px-3 py-2.5 gradient-header rounded-lg text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">Connected to Financial Aid · Registrar · Counseling · Career Services</p>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="lg:w-[55%] flex flex-col glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Action Log</h2>
            <div className="flex items-center gap-2">
              <span className="pill-success text-[10px]">8 complete</span>
              <span className="pill-warning text-[10px]">2 in progress</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {actions.map((a, i) => (
              <div
                key={a.num + "-" + i}
                className={`flex gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors animate-fade-in-up ${a.isCrisis ? "bg-destructive/5" : ""}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-1 rounded-full shrink-0 ${a.borderColor.replace("border-l-", "bg-")}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-accent text-[10px] text-muted-foreground">
                      {a.isCrisis ? "ALERT" : `#${String(a.num).padStart(2, "0")}`}
                    </span>
                    {a.pillarIcon}
                    <h3 className="text-sm font-medium text-foreground truncate">{a.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                </div>
                <span className={`${a.statusClass} shrink-0 text-[10px] flex items-center gap-1 self-start mt-0.5`}>
                  {a.statusIcon}
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!showEdgeCase && (
        <button
          onClick={() => setShowEdgeCase(true)}
          className="fixed bottom-4 left-4 z-50 px-3 py-1.5 text-[10px] text-muted-foreground bg-card border border-border rounded-lg hover:text-foreground transition-colors font-mono-accent"
        >
          Show Edge Case
        </button>
      )}

      <div className="text-center mt-3">
        <p className="text-[10px] text-muted-foreground">Powered by Salesforce Agentforce</p>
      </div>
    </div>
  );
};

export default AtlasChat;
