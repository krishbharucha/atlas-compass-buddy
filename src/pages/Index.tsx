import { useNavigate } from "react-router-dom";
import { GraduationCap, DollarSign, BookOpen, Briefcase, Heart, Settings, ArrowRight, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  {
    icon: BookOpen,
    title: "Academic",
    description: "Track your courses, GPA, enrollment status, and academic progress. Access advising tools, degree audits, and registration.",
    path: "/academic",
  },
  {
    icon: DollarSign,
    title: "Financial",
    description: "View tuition balances, manage financial aid, track scholarships, and access payment plans all in one place.",
    path: "/financial",
  },
  {
    icon: Briefcase,
    title: "Job Applications",
    description: "Browse internships and career opportunities, track applications, build your resume, and connect with recruiters.",
    path: "/jobs",
  },
  {
    icon: Heart,
    title: "Wellness",
    description: "Access mental health resources, schedule counseling, explore wellness programs, and connect with campus support services.",
    path: "/wellness",
  },
  {
    icon: Settings,
    title: "Administration",
    description: "Manage your student records, update personal information, access transcripts, and handle administrative requests.",
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
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground font-mono-accent">Secure .edu access only</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
              Your complete university experience, unified.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Atlas brings together academics, finances, career services, wellness support, and administration into a single, streamlined student portal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/login")} className="gap-2">
                Sign in with your .edu email
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">Everything you need</h2>
            <p className="text-muted-foreground max-w-lg">Access all your university services from one dashboard. Each module is designed to give you full visibility and control.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.path}
                  onClick={() => navigate(feature.path)}
                  className="glass-card p-6 text-left hover:border-foreground/20 transition-all duration-200 group animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "12,400+", label: "Active Students" },
              { value: "98.5%", label: "Uptime" },
              { value: "24/7", label: "Support Access" },
              { value: "5", label: "Integrated Modules" },
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
            <span className="text-sm text-muted-foreground">Atlas Student Portal © 2026</span>
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
