import { useNavigate } from "react-router-dom";
import { GraduationCap, DollarSign, BookOpen, Briefcase, Heart, Settings, ArrowRight, Shield, ChevronRight, Zap, MessageSquare, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  {
    Icon: DollarSign,
    name: "Financial Aid & Money Stress",
    description: "Atlas pulls your aid history, files appeals, finds emergency funding, and protects your registration.",
    href: "/financial",
    cta: "Explore",
    background: (
      <img
        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60"
        alt="Financial documents"
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-95"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Heart,
    name: "Mental Health & Wellbeing",
    description: "Proactive wellness monitoring. Same-day counselor booking. Crisis intervention with immediate human handoff.",
    href: "/wellness",
    cta: "Explore",
    background: (
      <img
        src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60"
        alt="Meditation and wellness"
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-95"
      />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  },
  {
    Icon: Briefcase,
    name: "Career & Job Searching",
    description: "8-week recruiting plans, mock interviews, alumni outreach, and offer evaluation.",
    href: "/jobs",
    cta: "Explore",
    background: (
      <img
        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60"
        alt="Team collaboration"
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-95"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BookOpen,
    name: "Academic Advising",
    description: "Degree audits, GPA scenarios, tutoring, and advisor booking.",
    href: "/academic",
    cta: "Explore",
    background: (
      <img
        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=60"
        alt="Library and books"
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-95"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Settings,
    name: "Campus Navigation & Admin",
    description: "Hold resolution, document routing, and registration protection.",
    href: "/chat",
    cta: "Explore",
    background: (
      <img
        src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60"
        alt="University campus"
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-95"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
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

      {/* Hero with 3D Scene */}
      <section className="border-b border-border">
        <Card className="w-full min-h-[540px] bg-black/[0.96] relative overflow-hidden rounded-none border-0">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          <div className="flex h-full min-h-[540px]">
            {/* Left content */}
            <div className="flex-1 p-8 sm:p-12 lg:p-16 relative z-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-neutral-400 font-mono-accent">Agentic AI · Powered by Salesforce Agentforce</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 tracking-tight leading-[1.1] mb-5">
                One conversation.<br />Every problem solved.
              </h1>
              <p className="text-base text-neutral-300 leading-relaxed mb-4 max-w-lg">
                Atlas doesn't just answer questions — it takes action. Financial aid appeals filed. Counseling appointments booked. Career plans built. Holds resolved.
              </p>
              <p className="text-sm text-neutral-500 mb-8 max-w-lg">
                20 automated actions across 5 pillars. No more getting bounced between offices.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/chat")} className="gap-2 bg-white text-black hover:bg-neutral-200">
                  <MessageSquare className="w-4 h-4" />
                  Try the Demo
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="gap-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                  Sign in with .edu email
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right content — 3D Scene */}
            <div className="flex-1 relative hidden md:block">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
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

      {/* 5 Pillars — BentoGrid */}
      <section id="features" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">5 Pillars of Student Support</h2>
            <p className="text-muted-foreground max-w-xl">Each pillar connects to real university systems. Atlas doesn't just inform — it acts, resolves, and follows up.</p>
          </div>

          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
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
