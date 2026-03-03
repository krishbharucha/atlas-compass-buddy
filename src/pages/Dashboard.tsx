import StatCard from "../components/StatCard";
import { DollarSign, BookOpen, Briefcase, Heart, Activity, Calendar, ArrowRight } from "lucide-react";

const stats = [
  {
    icon: <DollarSign className="w-4 h-4 text-accent" />, iconBg: "bg-yellow-light", label: "Financial Aid",
    value: "$3,200", subLabel: "Balance outstanding",
    pill: { text: "Action Needed", className: "pill-warning" }, delay: 0,
  },
  {
    icon: <BookOpen className="w-4 h-4 text-primary" />, iconBg: "bg-purple-light", label: "GPA",
    value: "3.41", subLabel: "87 of 180 credits complete",
    pill: { text: "On Track", className: "pill-success" }, delay: 80,
  },
  {
    icon: <Briefcase className="w-4 h-4 text-accent" />, iconBg: "bg-yellow-light", label: "Applications",
    value: "2 Due", subLabel: "This week",
    pill: { text: "Urgent", className: "pill-danger" }, delay: 160,
  },
  {
    icon: <Heart className="w-4 h-4 text-primary" />, iconBg: "bg-purple-light", label: "Wellness",
    value: "Check-in Due", subLabel: "Last check-in: 7 days ago",
    pill: { text: "Pending", className: "pill-purple" }, delay: 240,
  },
];

const activities = [
  { color: "bg-primary", text: "Financial aid verification document identified", time: "2 days ago", pill: { text: "Resolved", className: "pill-success" } },
  { color: "bg-accent", text: "Counseling appointment booked — Thurs 10am", time: "1 day ago", pill: { text: "Confirmed", className: "pill-blue" } },
  { color: "bg-primary", text: "MATH 208 tutoring sessions scheduled", time: "1 day ago", pill: { text: "Active", className: "pill-success" } },
  { color: "bg-destructive", text: "Library fine hold — resolution pending", time: "Today", pill: { text: "In Progress", className: "pill-warning" } },
];

const deadlines = [
  { border: "border-l-destructive", text: "Amazon SDE Application", time: "Friday", urgent: true },
  { border: "border-l-destructive", text: "Microsoft PM Application", time: "Monday", urgent: true },
  { border: "border-l-accent", text: "MATH 208 Tutoring", time: "Today 4pm", urgent: false },
  { border: "border-l-primary", text: "Advising Appointment", time: "Wednesday 2pm", urgent: false },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Good morning, Jordan</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Week 8 of Fall Quarter · 4 items need your attention
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono-accent bg-secondary px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5" />
            Fall 2026
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed — 2 cols */}
        <div className="lg:col-span-2 glass-card animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </h2>
            <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors">
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
              <div key={i} className={`border-l-[3px] ${d.border} pl-3 py-2.5 px-1 rounded-r-lg hover:bg-secondary/40 transition-colors`}>
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
    </div>
  );
};

export default Dashboard;
