import { useState } from "react";
import { Send, Heart, DollarSign, BookOpen, Briefcase, Landmark, AlertTriangle, Zap } from "lucide-react";

interface ActionItem {
  num: number;
  pillarIcon: React.ReactNode;
  borderColor: string;
  title: string;
  description: string;
  status: string;
  statusClass: string;
  isCrisis?: boolean;
}

const baseActions: ActionItem[] = [
  { num: 1, pillarIcon: <Heart className="w-4 h-4 text-primary" />, borderColor: "border-l-primary", title: "Counseling Appointment Booked", description: "Same-day slot secured: Tomorrow, Thursday 10:00am", status: "Complete", statusClass: "pill-success" },
  { num: 2, pillarIcon: <Heart className="w-4 h-4 text-primary" />, borderColor: "border-l-primary", title: "Wellness Toolkit Sent", description: "3 sleep + stress resources sent to your phone via SMS", status: "Complete", statusClass: "pill-success" },
  { num: 3, pillarIcon: <DollarSign className="w-4 h-4 text-accent" />, borderColor: "border-l-accent", title: "Aid Issue Identified", description: "Root cause: Missing income verification document", status: "Complete", statusClass: "pill-success" },
  { num: 4, pillarIcon: <DollarSign className="w-4 h-4 text-accent" />, borderColor: "border-l-accent", title: "Appeal Filed & Routed", description: "Pre-filled appeal sent to Financial Aid with urgency flag", status: "In Progress", statusClass: "pill-warning animate-pulse-subtle" },
  { num: 5, pillarIcon: <DollarSign className="w-4 h-4 text-accent" />, borderColor: "border-l-accent", title: "Hold Prevention Flag Placed", description: "Account protected — registration safe during appeal", status: "Complete", statusClass: "pill-success" },
  { num: 6, pillarIcon: <BookOpen className="w-4 h-4 text-purple-medium" />, borderColor: "border-l-purple-medium", title: "Withdrawal Impact Calculated", description: "W keeps GPA at 3.41. Fail drops to 3.18. Recommendation: Stay + tutoring.", status: "Complete", statusClass: "pill-success" },
  { num: 7, pillarIcon: <BookOpen className="w-4 h-4 text-purple-medium" />, borderColor: "border-l-purple-medium", title: "Emergency Advising Booked", description: "Wed 2pm — Decision brief pre-sent to your advisor", status: "Complete", statusClass: "pill-success" },
  { num: 8, pillarIcon: <BookOpen className="w-4 h-4 text-purple-medium" />, borderColor: "border-l-purple-medium", title: "Tutoring Sessions Scheduled", description: "Mon/Wed/Fri 4pm — pending your confirmation", status: "Awaiting Confirmation", statusClass: "pill-purple animate-pulse-subtle" },
  { num: 9, pillarIcon: <Briefcase className="w-4 h-4 text-accent" />, borderColor: "border-l-yellow-warm", title: "Internship Applications Pre-Filled", description: "Amazon SDE + Microsoft PM — ready for your review", status: "Ready", statusClass: "pill-success" },
  { num: 10, pillarIcon: <Landmark className="w-4 h-4 text-muted-foreground" />, borderColor: "border-l-muted-foreground", title: "Library Hold Resolved", description: "Resolution request sent directly to Registrar — ETA 24hrs", status: "In Progress", statusClass: "pill-warning animate-pulse-subtle" },
];

const crisisAction: ActionItem = {
  num: 0, pillarIcon: <AlertTriangle className="w-4 h-4 text-destructive" />, borderColor: "border-l-destructive", title: "Crisis Support Activated",
  description: "On-call counselor paged. Direct callback number sent to your phone. This conversation is being held safely.",
  status: "Human Taking Over", statusClass: "pill-danger", isCrisis: true,
};

const AtlasChat = () => {
  const [showEdgeCase, setShowEdgeCase] = useState(false);

  const actions = showEdgeCase ? [crisisAction, ...baseActions] : baseActions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
        {/* LEFT: Chat */}
        <div className="lg:w-[45%] flex flex-col glass-card overflow-hidden">
          {/* Chat header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-header flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">Atlas</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" /> Active — watching all your systems
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Jordan */}
            <div className="flex justify-end animate-slide-right" style={{ animationDelay: "200ms" }}>
              <div className="max-w-[85%] bg-yellow-light text-foreground rounded-2xl rounded-br-md p-4 text-sm leading-relaxed">
                I'm really struggling right now. My financial aid changed, I'm behind in one class, I haven't been sleeping, and internship deadlines are coming up. I don't know where to start.
              </div>
            </div>

            {/* Atlas 1 */}
            <div className="flex justify-start animate-slide-left" style={{ animationDelay: "400ms" }}>
              <div className="max-w-[85%] bg-secondary text-foreground rounded-2xl rounded-bl-md p-4 text-sm leading-relaxed">
                Jordan, that's a lot to carry at once — and it's completely understandable to feel overwhelmed. The good news is I can see everything going on and I know exactly what needs to happen. Let's handle the urgent stuff first, then build you a plan for the rest. I'm starting now.
              </div>
            </div>

            {/* Atlas 2 */}
            <div className="flex justify-start animate-slide-left" style={{ animationDelay: "600ms" }}>
              <div className="max-w-[85%] bg-secondary text-foreground rounded-2xl rounded-bl-md p-4 text-sm leading-relaxed">
                I've identified 10 actions across your accounts. Watch the panel on the right as I work through each one. I'll need your confirmation at the end.
              </div>
            </div>

            {/* Atlas 3 */}
            <div className="flex justify-start animate-slide-left" style={{ animationDelay: "800ms" }}>
              <div className="max-w-[85%] bg-secondary text-foreground rounded-2xl rounded-bl-md p-4 text-sm leading-relaxed">
                Everything is in motion, Jordan. Tonight, use the wellness resources I sent you. Tomorrow at 10am is your counseling appointment. Your aid appeal is filed and your account is protected. The only thing I need from you right now is to confirm your tutoring schedule. Can you do that?
              </div>
            </div>

            {/* Confirmation card */}
            <div className="flex justify-start animate-slide-left" style={{ animationDelay: "1000ms" }}>
              <div className="max-w-[85%] border-2 border-primary rounded-2xl p-5 bg-card">
                <h3 className="font-heading font-semibold text-foreground mb-1">Confirm Tutoring Schedule</h3>
                <p className="text-sm text-muted-foreground mb-4">Mon / Wed / Fri at 4:00pm — MATH 208 Tutoring Center</p>
                <div className="flex gap-3">
                  <button className="px-5 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity animate-bounce-gentle" style={{ animationDelay: "3s" }}>
                    Confirm
                  </button>
                  <button className="px-5 py-2 border-2 border-primary text-primary rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>

            {/* Final Atlas message */}
            <div className="flex justify-start animate-slide-left" style={{ animationDelay: "1200ms" }}>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md p-4 text-sm leading-relaxed" style={{ background: "hsl(160 84% 39% / 0.08)" }}>
                Done. You're all set, Jordan. Go get some rest — I've handled everything else.
              </div>
            </div>

            {/* Edge case messages */}
            {showEdgeCase && (
              <>
                <div className="flex justify-end animate-slide-right">
                  <div className="max-w-[85%] bg-yellow-light text-foreground rounded-2xl rounded-br-md p-4 text-sm leading-relaxed">
                    I don't really feel like things are going to get better.
                  </div>
                </div>
                <div className="flex justify-start animate-slide-left">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md p-4 text-sm leading-relaxed" style={{ background: "hsl(350 80% 60% / 0.08)" }}>
                    I hear you. What you're feeling matters, and I'm glad you told me. I want to make sure you have real support right now — not a ticket number. I'm connecting you with someone directly. Can you stay here with me for just a moment?
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Atlas anything..."
                className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button className="p-3 gradient-header rounded-xl text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 text-center">Atlas has access to all your university systems</p>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="lg:w-[55%] flex flex-col glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-foreground">Atlas Actions</h2>
            <span className="pill-purple font-mono-accent">{actions.length} actions triggered</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {actions.map((a, i) => (
              <div
                key={a.num + "-" + i}
                className={`border-l-4 ${a.borderColor} bg-card rounded-xl p-4 animate-slide-right ${a.isCrisis ? "ring-2 ring-destructive/30" : ""}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-accent text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                      {a.isCrisis ? "!" : `#${a.num}`}
                    </span>
                    {a.pillarIcon}
                    <h3 className="font-semibold text-sm text-foreground">{a.title}</h3>
                  </div>
                  <span className={`${a.statusClass} shrink-0 text-[11px]`}>{a.status}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 ml-[4.5rem]">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edge case button */}
      {!showEdgeCase && (
        <button
          onClick={() => setShowEdgeCase(true)}
          className="fixed bottom-6 left-6 z-50 px-4 py-2 text-xs text-muted-foreground bg-card/80 backdrop-blur border border-border rounded-xl hover:text-foreground transition-colors"
        >
          Show Edge Case
        </button>
      )}

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-[11px] text-muted-foreground">Powered by Salesforce Agentforce</p>
      </div>
    </div>
  );
};

export default AtlasChat;
