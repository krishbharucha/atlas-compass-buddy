import { useState, useEffect, useCallback, useRef } from "react";
import {
  Briefcase, MapPin, Clock, Building2, ExternalLink, Search, Filter,
  ChevronRight, Bookmark, Star, Zap, CheckCircle2, Loader2, Circle,
  FileText, Send, Copy, X, AlertCircle, CalendarCheck, Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/* ─── TYPES ─── */
type StepStatus = "queued" | "processing" | "completed";

interface WorkflowStep {
  id: string;
  label: string;
  status: StepStatus;
  completedAt?: number;
  duration: number; // ms
}

interface Application {
  company: string;
  role: string;
  status: string;
  date: string;
  location: string;
  atlasGenerated?: boolean;
  tasks?: string[];
}

interface Listing {
  company: string;
  role: string;
  type: string;
  location: string;
  posted: string;
  saved: boolean;
  matchScore?: number;
  deadline?: string;
  taskCreated?: boolean;
}

/* ─── INITIAL DATA ─── */
const initialApps: Application[] = [
  { company: "Google", role: "Software Engineering Intern", status: "Interview", date: "Applied Feb 20", location: "Mountain View, CA", tasks: ["Prep system design"] },
  { company: "Microsoft", role: "Product Management Intern", status: "Under Review", date: "Applied Feb 15", location: "Redmond, WA", tasks: ["Follow up Mar 10"] },
  { company: "Stripe", role: "Backend Engineering Intern", status: "Applied", date: "Applied Mar 1", location: "San Francisco, CA", tasks: ["Tailor resume"] },
  { company: "JPMorgan", role: "Technology Analyst", status: "Rejected", date: "Applied Jan 30", location: "New York, NY" },
];

const initialListings: Listing[] = [
  { company: "Amazon", role: "SDE Intern - Summer 2026", type: "Internship", location: "Seattle, WA", posted: "2d ago", saved: true },
  { company: "Meta", role: "Data Science Intern", type: "Internship", location: "Menlo Park, CA", posted: "3d ago", saved: false },
  { company: "Goldman Sachs", role: "Engineering Analyst", type: "Full-time", location: "New York, NY", posted: "5d ago", saved: false },
  { company: "Apple", role: "Machine Learning Intern", type: "Internship", location: "Cupertino, CA", posted: "1w ago", saved: true },
  { company: "Deloitte", role: "Consulting Analyst", type: "Full-time", location: "Chicago, IL", posted: "1w ago", saved: false },
];

const initialWorkflowSteps: WorkflowStep[] = [
  { id: "profile", label: "Profile Retrieved", status: "queued", duration: 1000 },
  { id: "opportunities", label: "Opportunities Matched", status: "queued", duration: 2000 },
  { id: "resume", label: "Resume Draft Generated", status: "queued", duration: 2000 },
  { id: "tasks", label: "Recruiting Tasks Created", status: "queued", duration: 1500 },
  { id: "alumni", label: "Alumni Drafts Prepared", status: "queued", duration: 2000 },
  { id: "coaching", label: "Career Coaching Scheduled", status: "queued", duration: 1500 },
];

const alumniDrafts = [
  {
    name: "Sarah Chen",
    title: "PM Lead at Microsoft",
    draft: `Hi Sarah,\n\nI'm Jordan, a junior at State University studying CS with a minor in Business. I found your profile through our alumni network and was really inspired by your path from PM intern to PM Lead.\n\nI'm currently preparing for PM internship recruiting and would love to hear about your experience at Microsoft. Would you have 15 minutes for a quick chat?\n\nBest,\nJordan`,
  },
  {
    name: "Marcus Williams",
    title: "APM at Google",
    draft: `Hi Marcus,\n\nI'm Jordan, a CS junior at State University. I saw you completed Google's APM program and I'm very interested in applying this cycle.\n\nI'd love to learn about your experience and any advice for the application process. Would you be open to a brief conversation?\n\nThank you,\nJordan`,
  },
];

const resumeDraftBullets = [
  "Added 'Product Sense' section highlighting case competition wins",
  "Reframed SWE project as product impact: 'Reduced onboarding time 40%'",
  "Added metrics to leadership role: 'Managed 12-person team, shipped 3 features'",
  "Tailored summary for PM roles: user empathy, cross-functional collaboration",
  "Included relevant coursework: HCI, Data Structures, Statistics",
];

const statusStyle = (status: string) => {
  switch (status) {
    case "Interview": return "pill-success";
    case "Under Review": return "pill-warning";
    case "Rejected": return "pill-danger";
    case "Draft Ready": return "pill-blue";
    default: return "pill-neutral";
  }
};

const timeAgo = (ts?: number) => {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
};

/* ─── COMPONENT ─── */
const Jobs = () => {
  const navigate = useNavigate();

  // Workflow state
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialWorkflowSteps);
  const [, setTick] = useState(0); // force re-render for timeAgo

  // Dynamic data
  const [metrics, setMetrics] = useState({ applications: 12, interviews: 3, companies: 8, saved: 15 });
  const [metricFlash, setMetricFlash] = useState<Record<string, boolean>>({});
  const [applications, setApplications] = useState<Application[]>(initialApps);
  const [listings, setListings] = useState<Listing[]>(initialListings);

  // Feature card dynamic content
  const [internshipResults, setInternshipResults] = useState<string[] | null>(null);
  const [interviewResults, setInterviewResults] = useState<string[] | null>(null);
  const [offerResults, setOfferResults] = useState<string[] | null>(null);
  const [tasksCreated, setTasksCreated] = useState(0);
  const [nextDeadline, setNextDeadline] = useState("");
  const [outreachReady, setOutreachReady] = useState(false);

  // Modals
  const [draftModal, setDraftModal] = useState<Application | null>(null);
  const [outreachModal, setOutreachModal] = useState(false);
  const [confirmSendIdx, setConfirmSendIdx] = useState<number | null>(null);
  const [sentDrafts, setSentDrafts] = useState<Set<number>>(new Set());

  const runningRef = useRef(false);

  // Tick for timeAgo updates
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const flashMetric = useCallback((key: string) => {
    setMetricFlash((p) => ({ ...p, [key]: true }));
    setTimeout(() => setMetricFlash((p) => ({ ...p, [key]: false })), 3000);
  }, []);

  const completeStep = useCallback((idx: number) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, status: "completed", completedAt: Date.now() } : s
      )
    );
  }, []);

  const startStep = useCallback((idx: number) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, status: "processing" } : s
      )
    );
  }, []);

  /* ─── DEMO RUNNER ─── */
  const runDemo = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setDemoRunning(true);
    setDemoCompleted(false);

    // Reset
    setSteps(initialWorkflowSteps.map((s) => ({ ...s, status: "queued", completedAt: undefined })));
    setInternshipResults(null);
    setInterviewResults(null);
    setOfferResults(null);
    setTasksCreated(0);
    setOutreachReady(false);
    setApplications(initialApps);
    setListings(initialListings);
    setMetrics({ applications: 12, interviews: 3, companies: 8, saved: 15 });

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Step 1: Profile Retrieved
    startStep(0);
    await delay(1000);
    completeStep(0);

    // Step 2: Opportunities Matched
    startStep(1);
    await delay(2000);
    completeStep(1);
    setMetrics((m) => ({ ...m, saved: m.saved + 3 }));
    flashMetric("saved");
    setListings((prev) =>
      prev.map((l, i) => ({
        ...l,
        matchScore: [94, 87, 72, 91, 65][i],
        deadline: i === 0 ? "Mar 12" : i === 1 ? "Mar 18" : undefined,
        saved: i < 3 ? true : l.saved,
      }))
    );
    setInternshipResults([
      "Matched 5 internships (2 PM, 2 SWE, 1 Data)",
      "Detected 2 urgent deadlines (under 10 days)",
      "Created 3 saved jobs automatically",
      "Generated 8-week recruiting plan (stored in Tasks)",
    ]);
    setTasksCreated(4);
    setNextDeadline("Mar 12");

    // Step 3: Resume Draft Generated
    startStep(2);
    await delay(2000);
    completeStep(2);
    setOfferResults([
      "Market range found for Seattle PM intern: $24–$30/hr",
      "Your offer: $22/hr (below median)",
      "Negotiation email draft prepared (not sent)",
    ]);

    // Step 4: Recruiting Tasks Created
    startStep(3);
    await delay(1500);
    completeStep(3);
    setMetrics((m) => ({ ...m, applications: m.applications + 2 }));
    flashMetric("applications");
    setApplications((prev) => [
      { company: "Amazon", role: "Product Management Intern", status: "Draft Ready", date: "Prepared just now", location: "Seattle, WA", atlasGenerated: true, tasks: ["Tailor resume", "Submit before Mar 12"] },
      { company: "Microsoft", role: "Product Management Intern", status: "Draft Ready", date: "Prepared just now", location: "Redmond, WA", atlasGenerated: true, tasks: ["Customize cover letter", "Submit before Mar 15"] },
      ...prev.map((a, i) => i === 2 ? { ...a, status: "Under Review" } : a),
    ]);
    setTasksCreated(6);
    toast({ title: "📋 Recruiting tasks created", description: "6 tasks added to your pipeline" });

    // Step 5: Alumni Drafts Prepared
    startStep(4);
    await delay(2000);
    completeStep(4);
    setMetrics((m) => ({ ...m, companies: m.companies + 2 }));
    flashMetric("companies");
    setOutreachReady(true);
    toast({ title: "✉️ Alumni outreach drafts ready", description: "2 personalized messages prepared" });

    // Step 6: Career Coaching Scheduled
    startStep(5);
    await delay(1500);
    completeStep(5);
    setMetrics((m) => ({ ...m, interviews: m.interviews + 1 }));
    flashMetric("interviews");
    setInterviewResults([
      "Mock interview set created: PM behavioral set (12 questions)",
      "Weak areas flagged: leadership, conflict, metrics",
      "Career advisor session booked: Tomorrow 2:00 PM",
    ]);
    toast({ title: "📅 Career coaching scheduled", description: "Session booked for tomorrow at 2:00 PM" });

    setDemoRunning(false);
    setDemoCompleted(true);
    runningRef.current = false;
  }, [completeStep, startStep, flashMetric]);

  const handleAddTask = (idx: number) => {
    setListings((prev) => prev.map((l, i) => i === idx ? { ...l, taskCreated: true } : l));
    toast({ title: "✅ Task created", description: `"Apply to ${listings[idx].role}" added to tasks` });
    setTimeout(() => {
      setMetrics((m) => ({ ...m, applications: m.applications + 1 }));
      flashMetric("applications");
    }, 2000);
  };

  const handleApproveSubmit = () => {
    if (!draftModal) return;
    setApplications((prev) =>
      prev.map((a) =>
        a.company === draftModal.company && a.role === draftModal.role
          ? { ...a, status: "Applied", date: "Applied just now", atlasGenerated: false }
          : a
      )
    );
    toast({ title: "🚀 Application submitted", description: `${draftModal.role} at ${draftModal.company}` });
    setDraftModal(null);
  };

  const metricCards = [
    { icon: Briefcase, label: "Applications", value: metrics.applications, sub: "This semester", key: "applications" },
    { icon: Star, label: "Interviews", value: metrics.interviews, sub: "Scheduled", key: "interviews" },
    { icon: Building2, label: "Companies", value: metrics.companies, sub: "Contacted", key: "companies" },
    { icon: Bookmark, label: "Saved Jobs", value: metrics.saved, sub: "Active listings", key: "saved" },
  ];

  const atlasCapabilities = internshipResults || interviewResults || offerResults
    ? [
        {
          trigger: "Internship search",
          example: internshipResults ? "\"I want a PM internship — where do I start?\"" : "\"I want a PM internship — where do I start?\"",
          actions: internshipResults || [
            "Parses transcript for relevant skills & gap analysis",
            "Builds personalized 8-week recruiting action plan",
            "Queries alumni network for warm intros at target companies",
            "Syncs recruiting calendar + deadlines to your calendar",
          ],
          lastRun: internshipResults ? "just now" : undefined,
        },
        {
          trigger: "Interview preparation",
          example: "\"I got an interview at Amazon — help me prepare\"",
          actions: interviewResults || [
            "Runs company-specific mock interview with STAR scoring",
            "Identifies weak answers and provides targeted coaching",
            "Books career counselor session with weak areas pre-flagged",
            "Sends interview prep toolkit (company research, common questions)",
          ],
          lastRun: interviewResults ? "just now" : undefined,
        },
        {
          trigger: "Offer evaluation",
          example: "\"$22/hr in Seattle — is that good? 48-hour deadline\"",
          actions: offerResults || [
            "Pulls market comp data for role/location/industry",
            "Calculates cost-of-living context for the city",
            "Compares against anonymized university offer database",
            "Drafts professional negotiation email if below market",
          ],
          lastRun: offerResults ? "just now" : undefined,
          draftReady: !!offerResults,
        },
      ]
    : [
        {
          trigger: "Internship search",
          example: "\"I want a PM internship — where do I start?\"",
          actions: [
            "Parses transcript for relevant skills & gap analysis",
            "Builds personalized 8-week recruiting action plan",
            "Queries alumni network for warm intros at target companies",
            "Syncs recruiting calendar + deadlines to your calendar",
          ],
        },
        {
          trigger: "Interview preparation",
          example: "\"I got an interview at Amazon — help me prepare\"",
          actions: [
            "Runs company-specific mock interview with STAR scoring",
            "Identifies weak answers and provides targeted coaching",
            "Books career counselor session with weak areas pre-flagged",
            "Sends interview prep toolkit (company research, common questions)",
          ],
        },
        {
          trigger: "Offer evaluation",
          example: "\"$22/hr in Seattle — is that good? 48-hour deadline\"",
          actions: [
            "Pulls market comp data for role/location/industry",
            "Calculates cost-of-living context for the city",
            "Compares against anonymized university offer database",
            "Drafts professional negotiation email if below market",
          ],
        },
      ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Career & Internships</h1>
          <p className="text-sm text-muted-foreground">Track applications, discover opportunities, and build your career.</p>
        </div>
        <Button size="sm" className="gap-1">
          <ExternalLink className="w-3.5 h-3.5" />
          Career Portal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key} className="transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className={`text-xl font-bold font-heading text-foreground transition-all duration-300 ${metricFlash[stat.key] ? "scale-110" : ""}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {metricFlash[stat.key] ? (
                    <span className="text-success font-medium animate-fade-in">Updated now</span>
                  ) : (
                    stat.sub
                  )}
                </p>
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
            <CardTitle className="text-lg">Atlas AI — Career Services</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {outreachReady && (
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setOutreachModal(true)}>
                <Users className="w-3.5 h-3.5" />
                View Outreach Drafts
              </Button>
            )}
            <Button
              size="sm"
              onClick={runDemo}
              disabled={demoRunning}
              className="gap-1"
            >
              {demoRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-3.5 h-3.5" />}
              {demoRunning ? "Running..." : "Try Demo"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Atlas doesn't just answer career questions — it builds complete recruiting plans, runs mock interviews, evaluates offers with market data, and drafts negotiation emails.
          </p>

          {/* Workflow status chips */}
          {(demoRunning || demoCompleted) && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      step.status === "completed"
                        ? "bg-success/10 text-success"
                        : step.status === "processing"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : step.status === "processing" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                    <span>{step.label}</span>
                    {step.status === "completed" && step.completedAt && (
                      <span className="text-[10px] opacity-70">{timeAgo(step.completedAt)}</span>
                    )}
                  </div>
                ))}
              </div>
              {tasksCreated > 0 && (
                <p className="text-xs text-muted-foreground">
                  Tasks created: <span className="font-semibold text-foreground">{tasksCreated}</span> • Next deadline: <span className="font-semibold text-foreground">{nextDeadline}</span>
                </p>
              )}
              {outreachReady && (
                <div className="mt-1">
                  <Badge variant="secondary" className="text-[10px]">
                    <Send className="w-2.5 h-2.5 mr-1" /> Outreach drafts ready
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Feature cards */}
          <div className="space-y-4">
            {atlasCapabilities.map((cap) => (
              <div key={cap.trigger} className="border border-border rounded-lg p-4 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{cap.trigger}</span>
                    {"draftReady" in cap && cap.draftReady && (
                      <Badge variant="secondary" className="text-[10px]">
                        <FileText className="w-2.5 h-2.5 mr-1" /> Draft ready
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono-accent">{cap.example}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {cap.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground animate-fade-in">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-foreground/40" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
                {"lastRun" in cap && cap.lastRun && (
                  <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
                    Last run: <span className="font-medium">{cap.lastRun}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications tracker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {applications.map((app) => (
              <div
                key={app.company + app.role}
                className={`py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-all duration-300 cursor-pointer group ${
                  app.atlasGenerated ? "animate-fade-in-up" : ""
                }`}
                onClick={() => app.status === "Draft Ready" ? setDraftModal(app) : undefined}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{app.role}</span>
                    {app.atlasGenerated && (
                      <Badge variant="secondary" className="text-[10px]">
                        <Zap className="w-2.5 h-2.5 mr-0.5" /> Atlas
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{app.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span>
                    <span>{app.date}</span>
                  </div>
                  {app.atlasGenerated && (
                    <p className="text-[10px] text-muted-foreground mt-1 italic">Atlas prepared: resume + answers</p>
                  )}
                  {app.tasks && app.tasks.length > 0 && (
                    <div className="flex gap-1.5 mt-1.5">
                      {app.tasks.map((t, i) => (
                        <span key={i} className="pill-neutral text-[10px] py-0 px-1.5">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusStyle(app.status)}>{app.status}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recommended Opportunities</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search roles..." className="pl-9 h-8 w-48 text-sm" />
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {listings.map((job, idx) => (
              <div key={job.company + job.role} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{job.role}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono-accent">{job.type}</Badge>
                    {job.matchScore && (
                      <span className={`pill-${job.matchScore >= 90 ? "success" : job.matchScore >= 75 ? "warning" : "neutral"} text-[10px]`}>
                        {job.matchScore}% match
                      </span>
                    )}
                    {job.deadline && (
                      <span className="pill-danger text-[10px] flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> Due {job.deadline}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!job.taskCreated ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[10px] h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); handleAddTask(idx); }}
                    >
                      Add to Tasks
                    </Button>
                  ) : (
                    <span className="pill-success text-[10px]"><CheckCircle2 className="w-2.5 h-2.5 mr-0.5 inline" />Task created</span>
                  )}
                  <Bookmark className={`w-4 h-4 transition-all duration-300 ${job.saved ? "text-foreground fill-foreground" : "text-muted-foreground"}`} />
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Draft Review Modal */}
      <Dialog open={!!draftModal} onOpenChange={() => setDraftModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {draftModal?.role} — {draftModal?.company}
            </DialogTitle>
            <DialogDescription>Review the resume draft Atlas prepared for this application.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 my-2">
            {resumeDraftBullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-success" />
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-xs text-warning">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Atlas does not submit applications without your confirmation.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraftModal(null)}>Close</Button>
            <Button onClick={handleApproveSubmit} className="gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              Approve & Mark as Submitted
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Outreach Drafts Modal */}
      <Dialog open={outreachModal} onOpenChange={setOutreachModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Alumni Outreach Drafts
            </DialogTitle>
            <DialogDescription>Personalized messages prepared by Atlas. Review before sending.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-2">
            {alumniDrafts.map((d, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.title}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => {
                        navigator.clipboard.writeText(d.draft);
                        toast({ title: "Copied to clipboard" });
                      }}
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                    {sentDrafts.has(i) ? (
                      <span className="pill-success text-[10px]">Sent</span>
                    ) : confirmSendIdx === i ? (
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          setSentDrafts((p) => new Set(p).add(i));
                          setConfirmSendIdx(null);
                          toast({ title: "📨 Message sent", description: `Outreach to ${d.name} delivered` });
                        }}
                      >
                        Confirm Send
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => setConfirmSendIdx(i)}
                      >
                        <Send className="w-3 h-3" /> Send
                      </Button>
                    )}
                  </div>
                </div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded p-3 font-body">
                  {d.draft}
                </pre>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-xs text-warning">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Sending requires explicit confirmation for each message.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;
