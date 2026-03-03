import { BookOpen, TrendingUp, Calendar, FileText, CheckCircle, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const courses = [
  { code: "CS 301", name: "Data Structures & Algorithms", grade: "A-", credits: 4, status: "In Progress", professor: "Dr. Sarah Chen" },
  { code: "MATH 240", name: "Linear Algebra", grade: "B+", credits: 3, status: "In Progress", professor: "Dr. James Liu" },
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

const Academic = () => (
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

export default Academic;
