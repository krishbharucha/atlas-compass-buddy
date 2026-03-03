import StatCard from "../components/StatCard";

const stats = [
  {
    icon: "💰", iconBg: "bg-yellow-light", label: "Financial Aid",
    value: "$3,200", subLabel: "Balance outstanding",
    pill: { text: "Action Needed", className: "pill-warning" }, delay: 0,
  },
  {
    icon: "📚", iconBg: "bg-purple-light", label: "GPA",
    value: "3.41", subLabel: "87 of 180 credits complete",
    pill: { text: "On Track", className: "pill-success" }, delay: 150,
  },
  {
    icon: "💼", iconBg: "bg-yellow-light", label: "Applications",
    value: "2 Due", subLabel: "This week",
    pill: { text: "Urgent", className: "pill-danger" }, delay: 300,
  },
  {
    icon: "🧠", iconBg: "bg-purple-light", label: "Wellness",
    value: "Check-in Due", subLabel: "Last check-in: 7 days ago",
    pill: { text: "Pending", className: "pill-purple" }, delay: 450,
  },
];

const activities = [
  { color: "bg-primary", text: "Financial aid verification document identified", time: "2 days ago", pill: { text: "Resolved", className: "pill-success" } },
  { color: "bg-accent", text: "Counseling appointment booked — Thurs 10am", time: "1 day ago", pill: { text: "Confirmed", className: "pill-blue" } },
  { color: "bg-primary", text: "MATH 208 tutoring sessions scheduled", time: "1 day ago", pill: { text: "Active", className: "pill-success" } },
  { color: "bg-destructive", text: "Library fine hold — resolution pending", time: "Today", pill: { text: "In Progress", className: "pill-warning" } },
];

const deadlines = [
  { border: "border-l-destructive", text: "Amazon SDE Application", time: "Friday" },
  { border: "border-l-destructive", text: "Microsoft PM Application", time: "Monday" },
  { border: "border-l-accent", text: "MATH 208 Tutoring", time: "Today 4pm" },
  { border: "border-l-primary", text: "Advising Appointment", time: "Wednesday 2pm" },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      {/* Hero */}
      <div className="gradient-hero rounded-3xl p-8 mb-8 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
          Good morning, Jordan 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Week 8 of Fall Quarter — here's what needs your attention today
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Activity Feed */}
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
              <span className="text-primary">⚡</span> Recent Atlas Activity
            </h2>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${a.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                  <span className={a.pill.className}>{a.pill.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deadlines sidebar */}
        <div className="lg:w-[30%] shrink-0">
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
            <h2 className="font-heading text-lg font-semibold mb-4">Deadlines This Week</h2>
            <div className="space-y-3">
              {deadlines.map((d, i) => (
                <div key={i} className={`border-l-4 ${d.border} pl-4 py-2`}>
                  <p className="text-sm font-medium text-foreground">{d.text}</p>
                  <p className="text-xs text-muted-foreground">{d.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
