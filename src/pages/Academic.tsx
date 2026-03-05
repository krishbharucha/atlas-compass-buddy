import { useState, useMemo } from "react";
import { BookOpen, TrendingUp, Calendar, FileText, CheckCircle, Clock, ChevronRight, AlertTriangle, GraduationCap, ArrowLeft, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// ── Data ──
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

const timelineCourses = {
  "Fall 2026": ["INFO 340 — Client-Side Dev", "STAT 311 — Intro to Statistics", "DATA 100 — Intro to Data Science"],
  "Winter 2027": ["DATA 301 — ML Fundamentals", "MATH 307 — Discrete Math", "INFO 370 — Data Ethics"],
  "Spring 2027": ["DATA 401 — Capstone", "CS 401 — Senior Project", "INFO 380 — Data Visualization"],
};

const atRiskCourses = courses.filter((c) => c.status === "At Risk");

type FlowState = "landing" | "minor-select" | "minor-audit" | "minor-confirm" | "minor-done" | "course-select" | "course-impact" | "course-actions" | "course-done";

const Academic = () => {
  const [flow, setFlow] = useState<FlowState>("landing");
  const [selectedMinor, setSelectedMinor] = useState("");
  const [selectedPath, setSelectedPath] = useState<"standard" | "accelerated" | null>(null);
  const [prepareForm, setPrepareForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [emailReviewed, setEmailReviewed] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [showCourseEmailDialog, setShowCourseEmailDialog] = useState(false);
  const [courseEmailTarget, setCourseEmailTarget] = useState<typeof courses[0] | null>(null);
  const [courseEmailRecipient, setCourseEmailRecipient] = useState("");
  const { toast } = useToast();

  const selectedCourseData = useMemo(() => courses.find(c => c.code === selectedCourse), [selectedCourse]);

  const recipients = useMemo(() => {
    const prof = selectedCourseData?.professor ?? "";
    const list = [
      { id: "professor", label: prof, role: "Course Professor" },
      { id: "advisor", label: "Dr. Patel", role: "Academic Advisor" },
      { id: "department", label: "CS Department Office", role: "Department Contact" },
    ];
    return list;
  }, [selectedCourseData]);

  const getEmailDraft = (recipientLabel: string, courseCode: string, courseName: string) => ({
    to: recipientLabel,
    subject: `Request for Support — ${courseCode} ${courseName}`,
    body: `Dear ${recipientLabel},

I hope this message finds you well. I am writing to discuss my current standing in ${courseCode} — ${courseName}.

I have been facing some challenges this quarter that have affected my performance, and I would like to explore any options available to help me improve. I have also scheduled tutoring sessions and an advising appointment to develop a stronger study plan.

Would it be possible to meet during your office hours this week to discuss strategies for the remaining assignments and exams? I am committed to putting in the effort needed to finish the course on the best possible terms.

Thank you for your time and understanding.

Best regards,
[Your Name]
Student ID: [Your ID]`,
  });

  // ── Landing ──
  if (flow === "landing") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Academic Support</h1>
          <p className="text-sm text-muted-foreground">Make informed decisions before deadlines hit.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: TrendingUp, label: "Cumulative GPA", value: "3.41", sub: "On Track" },
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

        {/* Action Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <Card className="cursor-pointer hover:border-primary/30 transition-colors group" onClick={() => setFlow("minor-select")}>
            <CardContent className="p-6">
              <GraduationCap className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-foreground transition-colors" />
              <h3 className="font-heading font-semibold text-foreground mb-1">Degree & Minor Planning</h3>
              <p className="text-sm text-muted-foreground mb-4">Planning a major or minor? See your options instantly.</p>
              <Button size="sm" className="gap-1">
                Plan my degree <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/30 transition-colors group" onClick={() => setFlow("course-select")}>
            <CardContent className="p-6">
              <AlertTriangle className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-foreground transition-colors" />
              <h3 className="font-heading font-semibold text-foreground mb-1">Course Trouble</h3>
              <p className="text-sm text-muted-foreground mb-4">Worried about a class or deadline?</p>
              <Button size="sm" variant="outline" className="gap-1">
                See my options <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Degree Progress */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="text-lg">Degree Progress</CardTitle></CardHeader>
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
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {courses.map((course) => (
                <div key={course.code} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-accent text-xs text-muted-foreground">{course.code}</span>
                      <span className="text-sm font-medium text-foreground">{course.name}</span>
                      {course.status === "At Risk" && <span className="pill-danger text-[10px] flex items-center gap-1"><AlertTriangle className="w-3 h-3" />At Risk</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{course.professor} · {course.credits} credits</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-foreground">{course.grade}</span>
                    {course.status === "At Risk" ? (
                      <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => { setCourseEmailTarget(course); setCourseEmailRecipient(course.professor); setShowCourseEmailDialog(true); }}>
                        <FileText className="w-3 h-3" /> Reach Out
                      </Button>
                    ) : course.status === "Completed" ? (
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At-risk course reach-out dialog */}
        <Dialog open={showCourseEmailDialog} onOpenChange={setShowCourseEmailDialog}>
          <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Reach Out — {courseEmailTarget?.code} {courseEmailTarget?.name}</DialogTitle>
            </DialogHeader>
            {courseEmailTarget && (() => {
              const courseRecipients = [
                { id: "prof", label: courseEmailTarget.professor, role: "Course Professor" },
                { id: "advisor", label: "Dr. Patel", role: "Academic Advisor" },
                { id: "department", label: "CS Department Office", role: "Department Contact" },
              ];
              const draft = getEmailDraft(courseEmailRecipient, courseEmailTarget.code, courseEmailTarget.name);
              return (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Who would you like to reach out to?</p>
                    <div className="space-y-2">
                      {courseRecipients.map((r) => (
                        <div
                          key={r.id}
                          className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${courseEmailRecipient === r.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            }`}
                          onClick={() => setCourseEmailRecipient(r.label)}
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{r.label}</p>
                            <p className="text-xs text-muted-foreground">{r.role}</p>
                          </div>
                          {courseEmailRecipient === r.label && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground w-16 shrink-0">To:</span>
                      <span className="text-foreground font-medium">{draft.to}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground w-16 shrink-0">Subject:</span>
                      <span className="text-foreground font-medium break-all">{draft.subject}</span>
                    </div>
                  </div>

                  <div className="border border-border rounded-md p-3 sm:p-4 bg-muted/30">
                    <pre className="text-xs sm:text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{draft.body}</pre>
                  </div>

                  <p className="text-xs text-muted-foreground">Atlas drafted this email based on your situation. Review the content and send when ready.</p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowCourseEmailDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      setShowCourseEmailDialog(false);
                      toast({ title: "Email sent", description: `Your message has been sent to ${draft.to}.` });
                    }}>
                      Send Email
                    </Button>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── Back button helper ──
  const BackButton = ({ to }: { to: FlowState }) => (
    <button onClick={() => setFlow(to)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );

  // ── Flow 1: Minor Planning ──
  if (flow === "minor-select") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="landing" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">What are you thinking about adding?</h2>
        <p className="text-sm text-muted-foreground mb-6">Select a minor and Atlas will check feasibility against your degree audit.</p>
        <Select onValueChange={setSelectedMinor}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select a minor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data-science">Data Science</SelectItem>
            <SelectItem value="informatics">Informatics</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
          </SelectContent>
        </Select>
        <Button disabled={!selectedMinor} onClick={() => setFlow("minor-audit")} className="w-full">
          Check feasibility
        </Button>
      </div>
    );
  }

  if (flow === "minor-audit") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="minor-select" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-6">Degree Audit — Data Science Minor</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card>
            <CardHeader><CardTitle className="text-base">Course Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(timelineCourses).map(([term, crs]) => (
                  <div key={term}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-sm font-semibold text-foreground">{term}</span>
                    </div>
                    <div className="ml-5 border-l border-border pl-4 space-y-1.5">
                      {crs.map((c) => (
                        <p key={c} className="text-sm text-muted-foreground">{c}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pathway Comparison */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Pathway Comparison</h3>
            {[
              { id: "standard" as const, title: "Option A: Standard Path", grad: "Spring 2027", load: "Normal (15 cr/qtr)", risk: "Low", riskClass: "pill-success" },
              { id: "accelerated" as const, title: "Option B: Accelerated Path", grad: "Spring 2027", load: "Heavy (19 cr/qtr)", risk: "Medium", riskClass: "pill-warning" },
            ].map((opt) => (
              <Card
                key={opt.id}
                className={`cursor-pointer transition-all ${selectedPath === opt.id ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/30"}`}
                onClick={() => setSelectedPath(opt.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">{opt.title}</span>
                    {selectedPath === opt.id && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Graduation</p>
                      <p className="font-medium text-foreground">{opt.grad}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Credit Load</p>
                      <p className="font-medium text-foreground">{opt.load}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Risk</p>
                      <span className={opt.riskClass}>{opt.risk}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button disabled={!selectedPath} onClick={() => {
              toast({ title: "Minor pathway selected", description: "Preparing declaration…" });
              setTimeout(() => setFlow("minor-confirm"), 800);
            }} className="w-full">
              Select this path
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (flow === "minor-confirm") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="minor-audit" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Confirmation</h3>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p><span className="text-foreground font-medium">Minor:</span> Data Science</p>
              <p><span className="text-foreground font-medium">Path:</span> {selectedPath === "standard" ? "Standard" : "Accelerated"}</p>
              <p><span className="text-foreground font-medium">Graduation:</span> Spring 2027</p>
            </div>
            <div className="flex items-start gap-2 pt-2">
              <Checkbox id="prepare" checked={prepareForm} onCheckedChange={(v) => setPrepareForm(v === true)} />
              <label htmlFor="prepare" className="text-sm text-foreground cursor-pointer">
                I want Atlas to prepare the minor declaration form
              </label>
            </div>
            <Button disabled={!prepareForm} onClick={() => {
              toast({ title: "🎉 Minor declaration prepared", description: "Routed to your advisor for review." });
              setFlow("minor-done");
            }} className="w-full">
              Prepare & Send to Advisor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (flow === "minor-done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">Declaration Sent</h3>
              <p className="text-sm text-muted-foreground">Minor declaration prepared and routed to your advisor.</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Pathway analyzed", status: "done" },
                { label: "Declaration form prepared", status: "done" },
                { label: "Advisor review pending", status: "pending" },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${step.status === "done" ? "bg-success" : "bg-warning"}`} />
                  <span className="text-sm text-foreground">{step.label}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => { setFlow("landing"); setSelectedMinor(""); setSelectedPath(null); setPrepareForm(false); }} className="w-full">
              Back to Academic
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Flow 2: Course Trouble ──
  if (flow === "course-select") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="landing" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Which course are you concerned about?</h2>
        <p className="text-sm text-muted-foreground mb-6">Atlas will analyze your options and take parallel actions.</p>
        <Select onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex items-center gap-2">
                  {c.code} — {c.name}
                  {c.status === "At Risk" && <Badge variant="destructive" className="text-[10px] ml-1">Deadline in 5 days</Badge>}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button disabled={!selectedCourse} onClick={() => setFlow("course-impact")} className="w-full">
          Analyze my options
        </Button>
      </div>
    );
  }

  if (flow === "course-impact") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="course-select" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-6">Impact Comparison — {selectedCourse}</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <Card className="border-warning/30">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-heading font-semibold text-foreground">Withdraw (W)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">GPA impact</span><span className="text-foreground font-medium">No change</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Aid impact</span><span className="pill-warning text-[11px]">⚠ May affect SAP</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Stress level</span><span className="text-foreground font-medium">Lower</span></div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/30">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-heading font-semibold text-foreground">Fail (F)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">GPA impact</span><span className="text-foreground font-medium">−0.4</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Aid impact</span><span className="pill-danger text-[11px]">⚠ High risk</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Stress level</span><span className="text-foreground font-medium">Higher</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button onClick={() => {
          toast({ title: "Emergency advising booked", description: "Wed 2:30pm with Dr. Patel" });
          setTimeout(() => toast({ title: "Tutoring sessions scheduled", description: "3 sessions this week" }), 600);
          setTimeout(() => toast({ title: "Draft email to professor prepared", description: "Ready for your review" }), 1200);
          setTimeout(() => setFlow("course-actions"), 1800);
        }} className="w-full">
          Discuss with advisor
        </Button>
      </div>
    );
  }

  if (flow === "course-actions") {
    const currentRecipient = emailRecipient || recipients[0]?.label || "Professor";
    const emailDraft = getEmailDraft(currentRecipient, selectedCourse, selectedCourseData?.name ?? "");

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="course-impact" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Actions Taken</h3>
            <div className="space-y-3">
              {[
                { label: "Advising appointment booked — Wed 2:30pm", done: true },
                { label: "Tutoring sessions scheduled (3 this week)", done: true },
                { label: "Email to professor / advisor", done: emailReviewed, action: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${item.done ? "bg-success text-success-foreground" : "border border-border"}`}>
                      {item.done && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  {item.action && !emailReviewed && (
                    <Button size="sm" variant="outline" onClick={() => setShowEmailPreview(true)}>
                      Review & Send
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => { setFlow("landing"); setSelectedCourse(""); setEmailReviewed(false); setEmailRecipient(""); }} className="w-full mt-4">
              Back to Academic
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showEmailPreview} onOpenChange={setShowEmailPreview}>
          <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Review Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Recipient selector */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Who would you like to reach out to?</p>
                <div className="space-y-2">
                  {recipients.map((r) => (
                    <div
                      key={r.id}
                      className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${currentRecipient === r.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}
                      onClick={() => setEmailRecipient(r.label)}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.role}</p>
                      </div>
                      {currentRecipient === r.label && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">To:</span>
                  <span className="text-foreground font-medium">{emailDraft.to}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">Subject:</span>
                  <span className="text-foreground font-medium break-all">{emailDraft.subject}</span>
                </div>
              </div>
              <div className="border border-border rounded-md p-3 sm:p-4 bg-muted/30">
                <pre className="text-xs sm:text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{emailDraft.body}</pre>
              </div>
              <p className="text-xs text-muted-foreground">Atlas drafted this email based on your situation. Review the content and send when ready.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowEmailPreview(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => {
                  setShowEmailPreview(false);
                  setEmailReviewed(true);
                  toast({ title: "Email sent", description: `Your message has been sent to ${emailDraft.to}.` });
                }}>
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Fallback
  return null;
};

export default Academic;
