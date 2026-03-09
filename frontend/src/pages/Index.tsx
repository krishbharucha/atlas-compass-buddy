import { useNavigate } from "react-router-dom";
import { GraduationCap, DollarSign, BookOpen, Briefcase, Heart, Settings, ArrowRight, Shield, ChevronRight, Zap, MessageSquare, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { SplineScene } from "@/components/ui/splite";

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
      <header className="border-b border-[#2d1f4b] bg-[#39275b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-white">Atlas</span>
            <span className="hidden sm:inline text-xs text-white/70 font-mono-accent ml-1 bg-white/10 px-2 py-0.5 rounded">Student Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="border-white/20 text-white bg-white/5 hover:bg-white/20 hover:text-white transition-colors">
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/login")} className="bg-[#E3BF42] text-[#39275b] hover:bg-[#d7c896] hover:text-[#39275b] transition-colors font-medium border-0">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero with Illustration */}
      <section className="border-b border-border">
        <Card className="w-full min-h-[540px] bg-gradient-to-br from-[#DFDDE8] via-[#DFDDE8]/60 to-white relative overflow-hidden rounded-none border-0">
          <div className="flex flex-col md:flex-row h-full min-h-[540px]">
            {/* Left content */}
            <div className="flex-1 p-8 sm:p-12 lg:p-16 relative z-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-[#39275b]" />
                <span className="text-sm font-medium text-[#39275b]/80 font-mono-accent">University of Washington · Agentic AI</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#39275b] tracking-tight leading-[1.1] mb-5">
                Atlas
                <br /> Your UW Student Success Assistant
              </h1>
              <p className="text-base sm:text-lg text-[#39275b]/80 font-medium leading-relaxed mb-4 max-w-lg">
                One conversation. Every campus service connected.
              </p>
              <p className="text-sm text-[#39275b]/60 mb-8 max-w-lg">
                Atlas takes action across departments to resolve holds, coordinate financial aid, and build career plans. No more getting bounced between offices.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/chat")} className="gap-2 bg-[#39275b] text-white hover:bg-[#E3BF42] hover:text-[#39275b] transition-colors border-0 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                  Try the Demo
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="gap-2 bg-transparent border-2 border-[#39275b] text-[#39275b] hover:bg-[#E3BF42] hover:text-[#39275b] hover:border-[#E3BF42] transition-colors">
                  Sign in with UW NetID
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right content — 3D Scene */}
            <div className="flex-1 relative hidden md:block opacity-95 mix-blend-multiply filter contrast-[1.15] brightness-90 saturate-[1.5] sepia-[.3] hue-rotate-[250deg] drop-shadow-[0_0_30px_rgba(227,191,66,0.3)]">
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

      {/* Stats KPI Band */}
      <section className="py-10 border-t border-border bg-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-0 sm:divide-x sm:divide-background/20">
            {[
              { value: "20+", label: "Automated Actions" },
              { value: "5", label: "Support Pillars" },
              { value: "<60s", label: "Avg Resolution" },
              { value: "24/7", label: "Crisis Support" },
              { value: "0", label: "Office Visits Needed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <p className="text-2xl sm:text-3xl font-bold font-heading text-background">{stat.value}</p>
                <p className="text-xs text-background/60 mt-1 uppercase tracking-wider font-mono-accent">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety-first Tag */}
      <section className="py-6 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/20 bg-destructive/5">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-medium text-foreground">Safety-first design</span>
            <span className="text-xs text-muted-foreground">— Real-time crisis detection · On-call counselor paging · No student falls through the cracks</span>
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
