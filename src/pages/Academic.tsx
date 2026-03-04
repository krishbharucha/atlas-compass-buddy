import { BookOpen, TrendingUp, Calendar, FileText, CheckCircle, Clock, ChevronRight, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const courses = [
  { code: "CS 301", name: "Data Structures & Algorithms", grade: "A-", credits: 4, status: "In Progress", professor: "Dr. Sarah Chen" },
  { code: "MATH 208", name: "Linear Algebra", grade: "D+", credits: 3, status: "At Risk", professor: "Dr. James Liu" },
  { code: "ENG 200", name: "Technical Writing", grade: "A", credits: 3, status: "In Progress", professor: "Prof. Maria Santos" },
  { code: "PHYS 201", name: "Mechanics", grade: "B", credits: 4, status: "In Progress", professor: "Dr. Robert Kim" },
  { code: "CS 250", name: "Computer Architecture", grade: "A-", credits: 3, status: "Completed", professor: "Dr. Alan Park" },
];

const milestones = [
  { label: "Credits Completed", value: 87, total: 120, status: "on-track" },
  { label: "Core Requirements", value: 14, total: 18, status: "on-track" },
  { label: "Electives", value: 5, total: 8, status: "warning" },
  { label: "Gen-Ed Requirements", value: 10, total: 10, status: "complete" },
];

const atlasCapabilities = [
  {
    trigger: "Adding a minor",
    example: "\"Can I add Data Science and still graduate on time?\"",
    actions: ["Pulls complete degree audit & maps minor requirements", "Generates 2 graduation pathway options (standard + accelerated)", "Identifies course conflicts and bottlenecks", "Pre-fills minor declaration form for advisor signature"],
  },
  {
    trigger: "Failing a course",
    example: "\"I'm failing MATH 208 — withdrawal deadline is in 5 days\"",
    actions: ["Calculates GPA impact: withdraw (W) vs. fail (F)", "Checks financial aid & eligibility implications", "Books emergency advising with pre-built decision brief", "Schedules tutoring + drafts professor email in parallel"],
  },
  {
    trigger: "Course planning",
    example: "\"Which electives should I take for a career in ML?\"",
    actions: ["Analyzes degree requirements vs. career goal alignment", "Recommends courses based on alumni career paths", "Checks prerequisite chains and section availability", "Generates optimized semester-by-semester plan"],
  },
];

const Academic = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Academic Overview</h1>
        <p className="text-sm text-muted-foreground">Track your progress, courses, and degree requirements.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: "Cumulative GPA", value: "3.52", sub: "Dean's List" },
          { icon: BookOpen, label: "Current Credits", value: "17", sub: "Spring 2026" },
          { icon: Calendar, label: "Expected Graduation", value: "May 2027", sub: "On track" },
          { icon: FileText, label: "Advisor", value: "Dr. Patel", sub: "CS Department" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-xl font-bold font-heading text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Atlas AI */}
      <Card className="mb-8 border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-foreground" />
            <CardTitle className="text-lg">Atlas AI — Academic Advising</CardTitle>
          </div>
          <Button size="sm" onClick={() => navigate("/chat")} className="gap-1">
            Try Demo <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Atlas performs real-time degree audits, calculates GPA impact scenarios, and takes action — booking advising, scheduling tutoring, and filing forms simultaneously.
          </p>
          <div className="space-y-4">
            {atlasCapabilities.map((cap) => (
              <div key={cap.trigger} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{cap.trigger}</span>
                  <span className="text-xs text-muted-foreground font-mono-accent">{cap.example}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {cap.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-foreground/40" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Degree Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Degree Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {milestones.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{m.label}</span>
                <span className="text-xs font-mono-accent text-muted-foreground">{m.value}/{m.total}</span>
              </div>
              <Progress value={(m.value / m.total) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Current Courses</CardTitle>
          <Button variant="outline" size="sm">View All Semesters</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {courses.map((course) => (
              <div key={course.code} className="py-3 flex items-center justify-between group cursor-pointer hover:bg-secondary/50 -mx-6 px-6 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-accent text-xs text-muted-foreground">{course.code}</span>
                    <span className="text-sm font-medium text-foreground">{course.name}</span>
                    {course.status === "At Risk" && (
                      <span className="pill-danger text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        At Risk
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.professor} · {course.credits} credits</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading font-semibold text-foreground">{course.grade}</span>
                  {course.status === "Completed" ? (
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Academic;
