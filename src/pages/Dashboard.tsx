import { useNavigate } from "react-router-dom";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { DollarSign, BookOpen, Briefcase, Heart, Activity, Calendar, ArrowRight, MessageSquare, Users, ClipboardList, TrendingUp, CheckCircle2 } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

/* ─── Bento feature data for the 4 stat pillars ─── */
const pillarCards = [
  {
    Icon: DollarSign,
    name: "Financial Aid",
    description: "$3,200 outstanding · Action needed on verification document",
    href: "/financial",
    cta: "View Details",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-transparent to-transparent dark:from-amber-900/20 dark:via-transparent" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Heart,
    name: "Wellness",
    description: "60% composite score · Sleep metrics declining for 3 weeks · Counseling tomorrow 3 PM",
    href: "/wellness",
    cta: "Check In",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-transparent to-transparent dark:from-pink-900/20 dark:via-transparent" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  },
  {
    Icon: Briefcase,
    name: "Career",
    description: "4 active applications · 2 due this week · 1 interview scheduled",
    href: "/jobs",
    cta: "View Pipeline",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BookOpen,
    name: "Academic",
    description: "GPA 3.41 · 87 of 120 credits · On track for May 2027 graduation",
    href: "/academic",
    cta: "View Audit",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-transparent to-transparent dark:from-emerald-900/20 dark:via-transparent" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
];

const activities = [
  { color: "bg-primary", text: "Financial aid verification document identified", time: "2 days ago", pill: { text: "Resolved", className: "pill-success" }, link: "/financial" },
  { color: "bg-accent", text: "Counseling appointment booked — Tomorrow 3:00 PM", time: "1 day ago", pill: { text: "Confirmed", className: "pill-blue" }, link: "/wellness" },
  { color: "bg-primary", text: "MATH 208 — Professor emailed for tutoring support", time: "1 day ago", pill: { text: "Sent", className: "pill-success" }, link: "/academic" },
  { color: "bg-destructive", text: "Career check completed — 4 applications, 2 resume drafts", time: "Today", pill: { text: "Review", className: "pill-warning" }, link: "/jobs" },
  { color: "bg-primary", text: "Peer Support: Anxiety group — spot reserved", time: "Today", pill: { text: "Joined", className: "pill-blue" }, link: "/wellness" },
  { color: "bg-accent", text: "Sleep Hygiene Seminar — registered for Mar 14", time: "Today", pill: { text: "Registered", className: "pill-success" }, link: "/wellness" },
];

const deadlines = [
  { border: "border-l-destructive", text: "Microsoft PM Application", time: "Friday", urgent: true, link: "/jobs" },
  { border: "border-l-destructive", text: "Amazon SDE Application", time: "Monday", urgent: true, link: "/jobs" },
  { border: "border-l-accent", text: "MATH 208 Tutoring", time: "Today 4pm", urgent: false, link: "/academic" },
  { border: "border-l-primary", text: "Counseling — Dr. Maya Chen", time: "Tomorrow 3pm", urgent: false, link: "/wellness" },
  { border: "border-l-primary", text: "Peer Support Group", time: "Tuesday 5pm", urgent: false, link: "/wellness" },
  { border: "border-l-accent", text: "Sleep Hygiene Seminar", time: "Mar 14 4pm", urgent: false, link: "/wellness" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">{getGreeting()}, Jordan</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Week 8 of Fall Quarter · 6 items need your attention
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono-accent bg-secondary px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5" />
            Fall 2026
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: ClipboardList, label: "My Atlas Plan", path: "/plan" },
          { icon: MessageSquare, label: "Atlas Chat", path: "/chat" },
          { icon: TrendingUp, label: "Academic", path: "/academic" },
          { icon: Users, label: "Career Services", path: "/jobs" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="glass-card p-3 flex items-center gap-2.5 hover:bg-secondary/50 transition-colors animate-fade-in-up"
              style={{ animationDelay: "250ms" }}
            >
              <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bento Pillar Cards */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <BentoGrid className="lg:grid-rows-3 auto-rows-[14rem]">
          {pillarCards.map((card) => (
            <BentoCard key={card.name} {...card} />
          ))}
          {/* Activity Panel — fills remaining spot */}
          <BentoCard
            Icon={Activity}
            name="Recent Activity"
            description={`${activities.length} actions taken by Atlas this week`}
            href="/plan"
            cta="View All"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-transparent to-transparent dark:from-slate-900/20 dark:via-transparent" />
            }
            className="lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4"
          />
        </BentoGrid>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed — 2 cols */}
        <div className="lg:col-span-2 glass-card animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Activity Feed
            </h2>
            <button onClick={() => navigate("/plan")} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors cursor-pointer"
                onClick={() => navigate(a.link)}
              >
                <div className={`w-2 h-2 rounded-full ${a.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
                <span className={a.pill.className}>{a.pill.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines sidebar */}
        <div className="glass-card animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Deadlines
            </h2>
          </div>
          <div className="p-3 space-y-1">
            {deadlines.map((d, i) => (
              <div
                key={i}
                className={`border-l-[3px] ${d.border} pl-3 py-2.5 px-1 rounded-r-lg hover:bg-secondary/40 transition-colors cursor-pointer`}
                onClick={() => navigate(d.link)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{d.text}</p>
                  {d.urgent && <span className="pill-danger text-[10px]">Due soon</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{d.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atlas Status Footer */}
      <div className="mt-6 glass-card p-4 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-foreground">
          Atlas is monitoring 5 active items across your student profile. Last check: 2 minutes ago.
        </p>
        <button onClick={() => navigate("/plan")} className="text-xs text-primary font-medium hover:underline whitespace-nowrap ml-auto flex items-center gap-1">
          View Plan <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;