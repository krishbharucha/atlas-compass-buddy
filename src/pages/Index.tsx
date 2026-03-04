import { useNavigate } from "react-router-dom";
import { GraduationCap, DollarSign, BookOpen, Briefcase, Heart, Settings, ArrowRight, Shield, ChevronRight, Zap, MessageSquare, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  {
    icon: DollarSign,
    title: "💰 Financial Aid & Money Stress",
    description: "Atlas pulls your complete aid history, identifies root causes of changes, files appeals, finds emergency funding, and protects your registration — all in one conversation.",
    actions: ["Award letter analysis", "Emergency bridge funding", "Hold prevention", "Textbook assistance"],
    path: "/financial",
  },
  {
    icon: Heart,
    title: "🧠 Mental Health & Wellbeing",
    description: "Proactive wellness monitoring with weekly pulse checks. Reactive distress detection mid-conversation. Crisis intervention with immediate human handoff.",
    actions: ["Same-day counselor booking", "Personalized coping toolkits", "Crisis escalation protocol", "Wellness trend tracking"],
    path: "/wellness",
  },
  {
    icon: Briefcase,
    title: "🎯 Career & Job Searching",
    description: "From first-time job seekers to offer negotiation. Atlas builds recruiting plans, runs mock interviews, and evaluates offers with real market data.",
    actions: ["8-week recruiting plans", "Alumni network warm intros", "Mock interviews with scoring", "Offer evaluation + negotiation"],
    path: "/jobs",
  },
  {
    icon: BookOpen,
    title: "📚 Academic Support & Advising",
    description: "Real-time degree audits, GPA impact scenarios, and automated action — booking advising, scheduling tutoring, and filing forms simultaneously.",
    actions: ["Degree pathway generation", "GPA impact calculator", "Emergency advising", "Professor communication"],
    path: "/academic",
  },
  {
    icon: Settings,
    title: "🏛️ Campus Navigation & Admin",
    description: "Solves the most universally hated student experience — getting bounced between offices. Atlas routes requests to the right person, not a general inbox.",
    actions: ["Hold resolution + escalation", "Service discovery + booking", "Document routing", "Registration protection"],
    path: "/admin",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md gradient-header flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">Atlas</span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-mono-accent ml-1 bg-secondary px-2 py-0.5 rounded">Student Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/login")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-28 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-muted-foreground font-mono-accent">Agentic AI · Powered by Salesforce Agentforce</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
              One conversation.<br />Every problem solved.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              Atlas doesn't just answer questions — it takes action. Financial aid appeals filed. Counseling appointments booked. Career plans built. Holds resolved. All from a single chat interface connected to every university system.
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
              20 automated actions across 5 pillars. No more getting bounced between offices. No more waiting weeks for email replies. Atlas handles it in minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/chat")} className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Try the Demo
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="gap-2">
                Sign in with .edu email
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How Atlas Works */}
      <section className="py-16 border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">How Atlas works</h2>
            <p className="text-muted-foreground max-w-xl">A student says one thing. Atlas does ten things simultaneously — across departments, systems, and offices the student never has to visit.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Student speaks naturally",
                description: "\"My financial aid changed and I don't understand why.\" Atlas understands context, emotion, and urgency — not just keywords.",
              },
              {
                step: "02",
                title: "Atlas takes multi-system action",
                description: "Simultaneously queries financial aid, registrar, and emergency services. Files appeals. Books appointments. Places account protections. All in seconds.",
              },
              {
                step: "03",
                title: "Student confirms, Atlas executes",
                description: "Every action is visible in the Action Log. Students confirm key decisions. Humans are escalated when needed. Nothing happens in the dark.",
              },
            ].map((item) => (
              <div key={item.step} className="glass-card p-6">
                <span className="text-xs font-mono-accent text-muted-foreground">STEP {item.step}</span>
                <h3 className="font-heading font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Pillars */}
      <section id="features" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">5 Pillars of Student Support</h2>
            <p className="text-muted-foreground max-w-xl">Each pillar connects to real university systems. Atlas doesn't just inform — it acts, resolves, and follows up.</p>
          </div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <button
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className="w-full glass-card p-6 text-left hover:border-foreground/20 transition-all duration-200 group animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all mt-1" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-3xl">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.actions.map((action) => (
                    <span key={action} className="px-2.5 py-1 bg-secondary text-xs font-medium text-muted-foreground rounded-md">
                      {action}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Safety */}
      <section className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 border-destructive/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">Safety-first design</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  Atlas includes real-time crisis detection. If a student expresses distress during any conversation — about finances, grades, or anything — Atlas immediately pivots to support mode, pages an on-call counselor, and stays present until the student is connected with a human. No student falls through the cracks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
            {[
              { value: "20+", label: "Automated Actions" },
              { value: "5", label: "Support Pillars" },
              { value: "<60s", label: "Avg Resolution" },
              { value: "24/7", label: "Crisis Support" },
              { value: "0", label: "Office Visits Needed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold font-heading text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Atlas Student Portal © 2026 · Powered by Salesforce Agentforce</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
