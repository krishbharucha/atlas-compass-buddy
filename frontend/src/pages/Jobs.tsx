import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Briefcase, MapPin, Clock, Building2, ExternalLink, Search, Filter,
  ChevronRight, Bookmark, Star, Zap, CheckCircle2, Loader2, Circle,
  FileText, Send, Copy, X, AlertCircle, CalendarCheck, Users,
  User, Target, ListTodo, Mail, GraduationCap, RotateCcw, SlidersHorizontal,
  Calendar, Plus, Video, BookmarkCheck, Square, CheckSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import DemoCalendar, { CalendarEvent } from "@/components/DemoCalendar";

/* ─── TYPES ─── */
type StepStatus = "queued" | "processing" | "completed";

interface WorkflowStep {
  id: string;
  label: string;
  icon: typeof User;
  status: StepStatus;
  completedAt?: number;
  duration: number;
  statusText: string;
}

interface StepDetail {
  bullets: string[];
  source?: string;
  extras?: { label: string; items: string[] };
  sampleBullets?: string[];
  guardrail?: string;
}

interface Interview {
  company: string;
  role: string;
  date: string;
  time: string;
  type: "Phone" | "Video" | "On-site";
  addedToCalendar: boolean;
}

interface Application {
  company: string;
  role: string;
  status: string;
  date: string;
  location: string;
  atlasGenerated?: boolean;
  tasks?: string[];
  interviewDate?: string;
  interviewTime?: string;
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
  industry: string;
  salary: string;
}

interface Filters {
  jobType: string[];
  industry: string[];
  location: string[];
  salary: string[];
  matchScore: number | null;
  saved: boolean;
}

interface TaskItem {
  id: string;
  label: string;
  source: string;
  done: boolean;
}

/* ─── STEP DETAILS BY ROLE ─── */
const getStepDetails = (role: string): Record<string, StepDetail> => {
  const isPM = role.toLowerCase().includes("pm") || role.toLowerCase().includes("product");
  const isData = role.toLowerCase().includes("data") || role.toLowerCase().includes("analyst");

  return {
    profile: {
      bullets: [
        "Loaded student profile: Jordan Rivera, Junior, Information Science",
        `Extracted skills from coursework: ${isPM ? "SQL, Python, Product Analytics" : isData ? "SQL, R, Python, Statistics, Tableau" : "Python, Java, System Design, Algorithms"}`,
        "Pulled projects: 2 major projects detected",
        `Target role inferred: ${role || "PM"} internships`,
        "Location preference: Seattle + Remote",
      ],
      source: "Based on your student profile and academic record",
    },
    matches: {
      bullets: [
        "Found 5 matching opportunities",
        "Top 2 matches flagged as urgent deadlines",
        "Calculated match score using skills + coursework fit",
        "Auto-saved 3 best-fit roles",
        "Ranked opportunities by deadline + relevance",
      ],
      extras: {
        label: "Top matches",
        items: isPM
          ? ["Microsoft PM Intern — 92% — Due Mar 12", "Amazon PM Intern — 89% — Due Mar 15", "Adobe Product Intern — 84% — Due Mar 20"]
          : isData
            ? ["Meta Data Science Intern — 94% — Due Mar 14", "Goldman Sachs Data Analyst — 88% — Due Mar 18", "Pfizer Data Analyst Intern — 82% — Due Mar 22"]
            : ["Amazon SDE Intern — 94% — Due Mar 12", "Microsoft SWE Intern — 91% — Due Mar 15", "Apple ML Intern — 87% — Due Mar 20"],
      },
    },
    resume: {
      bullets: [
        "Generated resume v1 from projects + coursework",
        `Created 4 ${isPM ? "PM" : isData ? "data" : "engineering"}-ready bullet points`,
        "Highlighted measurable outcomes and tools used",
        "Marked 2 bullets as 'needs review'",
        "Draft saved as 'Resume Draft v1'",
      ],
      sampleBullets: isPM
        ? [
          "Built a data pipeline in Python to analyze trends and present insights.",
          "Designed a product-style feature brief based on user needs and constraints.",
        ]
        : isData
          ? [
            "Developed a Tableau dashboard to visualize enrollment trends across 3 semesters.",
            "Performed regression analysis in R to identify key drivers of student retention.",
          ]
          : [
            "Implemented a REST API in Java handling 1K+ requests/day with 99.9% uptime.",
            "Optimized database queries reducing average response time by 40%.",
          ],
      guardrail: "Nothing is submitted without your approval.",
    },
    tasks: {
      bullets: [
        "Created 6 recruiting tasks with deadlines",
        "Added 2 application drafts to My Applications",
        "Set next deadline alert for Mar 12",
        "Created task checklist per job (resume tailor, submit, follow-up)",
        "Updated dashboard metrics",
      ],
      extras: {
        label: "Next tasks",
        items: isPM
          ? ["Tailor resume for Microsoft PM — Due in 2 days", "Submit Microsoft application — Due Mar 12", "Draft STAR stories — Due in 4 days"]
          : isData
            ? ["Tailor resume for Meta Data Science — Due in 2 days", "Submit Goldman Sachs application — Due Mar 18", "Prepare SQL case study — Due in 4 days"]
            : ["Tailor resume for Amazon SDE — Due in 2 days", "Submit Amazon application — Due Mar 12", "Practice system design — Due in 4 days"],
      },
    },
    outreach: {
      bullets: [
        `Matched 2 alumni in ${isPM ? "Product" : isData ? "Data" : "Engineering"} roles at target companies`,
        "Drafted personalized outreach messages using shared context",
        "Saved drafts for student review",
        "Sending disabled until confirmation",
      ],
      sampleBullets: [
        isPM
          ? "\"Hi Sarah, I'm Jordan — a junior studying IS. I'd love to hear about your PM path at Microsoft…\""
          : isData
            ? "\"Hi Alex, I'm Jordan — a junior studying IS. Your data science work at Meta really resonated with me…\""
            : "\"Hi Marcus, I'm Jordan — a CS junior. I'd love to learn about your engineering journey at Google…\"",
      ],
    },
    coaching: {
      bullets: [
        "Booked career coaching session: Tomorrow 2:00 PM",
        `Added mock interview set: 12 ${isPM ? "behavioral" : isData ? "analytical" : "technical"} questions`,
        `Flagged weak areas: ${isPM ? "metrics storytelling + leadership examples" : isData ? "SQL optimization + visualization narration" : "system design + complexity analysis"}`,
        "Added prep tasks to your checklist",
        "Calendar invite prepared (not sent)",
      ],
    },
  };
};

/* ─── INITIAL DATA ─── */
const initialApps: Application[] = [
  { company: "Google", role: "Software Engineering Intern", status: "Interview", date: "Applied Feb 20", location: "Mountain View, CA", tasks: ["Prep system design"], interviewDate: "Mar 8, 2026", interviewTime: "2:00 PM" },
  { company: "Microsoft", role: "Product Management Intern", status: "Under Review", date: "Applied Feb 15", location: "Redmond, WA", tasks: ["Follow up Mar 10"] },
  { company: "Stripe", role: "Backend Engineering Intern", status: "Applied", date: "Applied Mar 1", location: "San Francisco, CA", tasks: ["Tailor resume"] },
  { company: "JPMorgan", role: "Technology Analyst", status: "Rejected", date: "Applied Jan 30", location: "New York, NY" },
];

const initialInterviews: Interview[] = [
  { company: "Google", role: "Software Engineering Intern", date: "Mar 8, 2026", time: "2:00 PM", type: "Video", addedToCalendar: false },
];

const initialListings: Listing[] = [
  { company: "Amazon", role: "SDE Intern - Summer 2026", type: "Internship", location: "Seattle, WA", posted: "2d ago", saved: true, industry: "Technology", salary: "$30 – $50/hr" },
  { company: "Meta", role: "Data Science Intern", type: "Internship", location: "Remote", posted: "3d ago", saved: false, industry: "Technology", salary: "$50 – $80/hr" },
  { company: "Goldman Sachs", role: "Engineering Analyst", type: "Full-time", location: "New York, NY", posted: "5d ago", saved: false, industry: "Finance", salary: "$80k – $120k" },
  { company: "Apple", role: "Machine Learning Intern", type: "Internship", location: "Cupertino, CA", posted: "1w ago", saved: true, industry: "Technology", salary: "$50 – $80/hr" },
  { company: "Deloitte", role: "Consulting Analyst", type: "Full-time", location: "Chicago, IL", posted: "1w ago", saved: false, industry: "Consulting", salary: "$80k – $120k" },
  { company: "Microsoft", role: "PM Intern - Azure", type: "Internship", location: "Redmond, WA", posted: "3d ago", saved: false, industry: "Technology", salary: "$30 – $50/hr" },
  { company: "McKinsey", role: "Business Analyst Intern", type: "Internship", location: "New York, NY", posted: "4d ago", saved: false, industry: "Consulting", salary: "$30 – $50/hr" },
  { company: "Pfizer", role: "Data Analyst Intern", type: "Part-time", location: "Remote", posted: "6d ago", saved: false, industry: "Healthcare", salary: "$0 – $30/hr" },
];

const initialWorkflowSteps: WorkflowStep[] = [
  { id: "profile", label: "Profile", icon: User, status: "queued", duration: 800, statusText: "Retrieving student profile" },
  { id: "matches", label: "Matches", icon: Target, status: "queued", duration: 1800, statusText: "Matching internships to your profile" },
  { id: "resume", label: "Resume", icon: FileText, status: "queued", duration: 1500, statusText: "Drafting resume bullets" },
  { id: "tasks", label: "Tasks", icon: ListTodo, status: "queued", duration: 1200, statusText: "Creating application tasks" },
  { id: "outreach", label: "Outreach", icon: Mail, status: "queued", duration: 1500, statusText: "Preparing alumni outreach drafts" },
  { id: "coaching", label: "Coaching", icon: GraduationCap, status: "queued", duration: 1000, statusText: "Scheduling career coaching" },
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

const FILTER_OPTIONS = {
  jobType: ["Internship", "Part-time", "Full-time", "Research"],
  industry: ["Technology", "Finance", "Consulting", "Healthcare", "Data Science", "Product Management"],
  location: ["Remote", "United States", "Seattle", "California", "New York"],
  salary: ["$0 – $30/hr", "$30 – $50/hr", "$50 – $80/hr", "$80k – $120k", "$120k+"],
  matchScore: [70, 80, 90],
};

const emptyFilters: Filters = { jobType: [], industry: [], location: [], salary: [], matchScore: null, saved: false };

/* ─── COMPONENT ─── */
const Jobs = () => {
  // Workflow state
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialWorkflowSteps);
  const [activeStatusText, setActiveStatusText] = useState("");
  const [summaryPills, setSummaryPills] = useState<{ label: string; value: string }[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("PM internship");

  // Dynamic data
  const [metrics, setMetrics] = useState({ applications: 4, interviews: 1, companies: 8 });
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);

  // Task list
  const [taskList, setTaskList] = useState<TaskItem[]>([
    { id: "t1", label: "Prep system design — Google", source: "Application", done: false },
  ]);

  // Schedule interview dialog
  const [scheduleModal, setScheduleModal] = useState<Application | null>(null);

  // Section refs for KPI scroll
  const applicationsRef = useRef<HTMLDivElement>(null);
  const interviewsRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [metricFlash, setMetricFlash] = useState<Record<string, boolean>>({});
  const [applications, setApplications] = useState<Application[]>(initialApps);
  const [listings, setListings] = useState<Listing[]>(initialListings);

  // Filters
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [draftModal, setDraftModal] = useState<Application | null>(null);
  const [outreachModal, setOutreachModal] = useState(false);
  const [confirmSendIdx, setConfirmSendIdx] = useState<number | null>(null);
  const [sentDrafts, setSentDrafts] = useState<Set<number>>(new Set());
  const [outreachReady, setOutreachReady] = useState(false);

  // Tick for timeAgo
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const runningRef = useRef(false);

  const stepDetails = useMemo(() => getStepDetails(targetRole), [targetRole]);

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
        i === idx ? { ...s, status: "processing" as StepStatus } : s
      )
    );
    setActiveStatusText(initialWorkflowSteps[idx].statusText);
    setSelectedStepId(initialWorkflowSteps[idx].id);
  }, []);

  /* ─── WORKFLOW RUNNER ─── */
  const runDemo = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setDemoRunning(true);
    setDemoCompleted(false);
    setSummaryPills([]);
    setActiveStatusText("");
    setOutreachReady(false);
    setSelectedStepId(null);

    setSteps(initialWorkflowSteps.map((s) => ({ ...s, status: "queued" as StepStatus, completedAt: undefined })));
    setApplications(initialApps);
    setListings(initialListings);
    setMetrics({ applications: 4, interviews: 1, companies: 8 });

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Step 0: Profile
    startStep(0);
    await delay(800);
    completeStep(0);

    // Step 1: Matches
    startStep(1);
    await delay(1800);
    completeStep(1);
    // Matches found
    setListings((prev) =>
      prev.map((l, i) => ({
        ...l,
        matchScore: [94, 87, 72, 91, 65, 92, 78, 60][i],
        deadline: i === 0 ? "Mar 12" : i === 5 ? "Mar 18" : undefined,
        saved: i < 3 ? true : l.saved,
      }))
    );
    setSummaryPills(p => [...p, { label: "matches", value: "5 matches" }]);

    // Step 2: Resume
    startStep(2);
    await delay(1500);
    completeStep(2);
    setSummaryPills(p => [...p, { label: "deadlines", value: "2 urgent deadlines" }, { label: "resumes", value: "2 resume drafts" }]);

    // Step 3: Tasks
    startStep(3);
    await delay(1200);
    completeStep(3);
    setMetrics((m) => ({ ...m, applications: m.applications + 2 }));
    flashMetric("applications");
    setApplications((prev) => [
      { company: "Amazon", role: "Product Management Intern", status: "Draft Ready", date: "Prepared just now", location: "Seattle, WA", atlasGenerated: true, tasks: ["Tailor resume", "Submit before Mar 12"] },
      { company: "Microsoft", role: "PM Intern - Azure", status: "Draft Ready", date: "Prepared just now", location: "Redmond, WA", atlasGenerated: true, tasks: ["Customize cover letter", "Submit before Mar 15"] },
      ...prev.map((a, i) => i === 2 ? { ...a, status: "Under Review" } : a),
    ]);
    setSummaryPills(p => [...p, { label: "tasks", value: "6 tasks created" }]);
    toast({ title: "Recruiting tasks created", description: "6 tasks added to your pipeline" });

    // Step 4: Outreach
    startStep(4);
    await delay(1500);
    completeStep(4);
    setMetrics((m) => ({ ...m, companies: m.companies + 2 }));
    flashMetric("companies");
    setOutreachReady(true);
    setSummaryPills(p => [...p, { label: "outreach", value: "2 outreach drafts" }]);
    toast({ title: "Alumni outreach drafts ready", description: "2 personalized messages prepared" });

    // Step 5: Coaching
    startStep(5);
    await delay(1000);
    completeStep(5);
    setMetrics((m) => ({ ...m, interviews: m.interviews + 1 }));
    flashMetric("interviews");
    setActiveStatusText("Career preparation completed");
    toast({ title: "Career coaching scheduled", description: "Session booked for tomorrow at 2:00 PM" });

    setDemoRunning(false);
    setDemoCompleted(true);
    runningRef.current = false;
  }, [completeStep, startStep, flashMetric]);

  const resetWorkflow = useCallback(() => {
    setSteps(initialWorkflowSteps.map((s) => ({ ...s, status: "queued" as StepStatus, completedAt: undefined })));
    setDemoCompleted(false);
    setDemoRunning(false);
    setSummaryPills([]);
    setActiveStatusText("");
    setOutreachReady(false);
    setSelectedStepId(null);
    setApplications(initialApps);
    setListings(initialListings);
    setMetrics({ applications: 4, interviews: 1, companies: 8 });
    setInterviews(initialInterviews);
    runningRef.current = false;
  }, []);

  const handleAddTask = (idx: number) => {
    const filteredJob = filteredListings[idx];
    const originalIdx = listings.findIndex(l => l.company === filteredJob.company && l.role === filteredJob.role);
    setListings((prev) => prev.map((l, i) => i === originalIdx ? { ...l, taskCreated: true } : l));
    setTaskList(prev => [...prev, { id: `listing-${Date.now()}`, label: `Apply to ${filteredJob.role} — ${filteredJob.company}`, source: "Opportunity", done: false }]);
    toast({ title: "Task created", description: `"Apply to ${filteredJob.role}" added to tasks` });
    setTimeout(() => {
      setMetrics((m) => ({ ...m, applications: m.applications + 1 }));
      flashMetric("applications");
    }, 2000);
  };

  const handleToggleSave = (idx: number) => {
    const filteredJob = filteredListings[idx];
    const originalIdx = listings.findIndex(l => l.company === filteredJob.company && l.role === filteredJob.role);
    setListings((prev) => prev.map((l, i) => i === originalIdx ? { ...l, saved: !l.saved } : l));
    toast({ title: filteredJob.saved ? "Removed from saved" : "Saved", description: filteredJob.role });
  };

  const handleToggleTask = (id: string) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
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
    toast({ title: "Application submitted", description: `${draftModal.role} at ${draftModal.company}` });
    setDraftModal(null);
  };

  // Filter logic
  const hasActiveFilters = filters.jobType.length > 0 || filters.industry.length > 0 || filters.location.length > 0 || filters.salary.length > 0 || filters.matchScore !== null || filters.saved;

  const activeFilterTags = useMemo(() => {
    const tags: { label: string; category: keyof Filters; value: string | number }[] = [];
    filters.jobType.forEach(v => tags.push({ label: v, category: "jobType", value: v }));
    filters.industry.forEach(v => tags.push({ label: v, category: "industry", value: v }));
    filters.location.forEach(v => tags.push({ label: v, category: "location", value: v }));
    filters.salary.forEach(v => tags.push({ label: v, category: "salary", value: v }));
    if (filters.matchScore) tags.push({ label: `${filters.matchScore}%+`, category: "matchScore", value: filters.matchScore });
    if (filters.saved) tags.push({ label: "Saved Only", category: "saved" as keyof Filters, value: "true" });
    return tags;
  }, [filters]);

  const removeFilter = (category: keyof Filters, value: string | number) => {
    setFilters(prev => {
      if (category === "matchScore") return { ...prev, matchScore: null };
      if (category === "saved") return { ...prev, saved: false };
      return { ...prev, [category]: (prev[category] as string[]).filter(v => v !== value) };
    });
  };

  const toggleFilterValue = (category: keyof Omit<Filters, "matchScore">, value: string) => {
    setFilters(prev => {
      const arr = prev[category] as string[];
      return { ...prev, [category]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const locationMatch = (jobLocation: string, filterLoc: string): boolean => {
    if (filterLoc === "United States") return jobLocation !== "Remote";
    if (filterLoc === "California") return jobLocation.includes("CA");
    if (filterLoc === "Seattle") return jobLocation.includes("Seattle");
    if (filterLoc === "New York") return jobLocation.includes("New York") || jobLocation.includes("NY");
    return jobLocation.toLowerCase().includes(filterLoc.toLowerCase());
  };

  const filteredListings = useMemo(() => {
    return listings.filter(job => {
      if (searchQuery && !job.role.toLowerCase().includes(searchQuery.toLowerCase()) && !job.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.jobType.length > 0 && !filters.jobType.includes(job.type)) return false;
      if (filters.industry.length > 0 && !filters.industry.includes(job.industry)) return false;
      if (filters.location.length > 0 && !filters.location.some(loc => locationMatch(job.location, loc))) return false;
      if (filters.salary.length > 0 && !filters.salary.includes(job.salary)) return false;
      if (filters.matchScore && (!job.matchScore || job.matchScore < filters.matchScore)) return false;
      if (filters.saved && !job.saved) return false;
      return true;
    });
  }, [listings, filters, searchQuery]);

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const ref = key === "applications" ? applicationsRef : key === "interviews" ? interviewsRef : companiesRef;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => setActiveSection(null), 2000);
  };

  const handleAddToCalendar = (idx: number) => {
    setInterviews(prev => prev.map((iv, i) => i === idx ? { ...iv, addedToCalendar: true } : iv));
    toast({ title: "Added to calendar", description: `Interview at ${interviews[idx].company} on ${interviews[idx].date}` });
  };

  const handleScheduleInterview = (app: Application) => {
    setScheduleModal(app);
  };

  const confirmSchedule = () => {
    if (!scheduleModal) return;
    const newInterview: Interview = {
      company: scheduleModal.company,
      role: scheduleModal.role,
      date: scheduleModal.interviewDate || "TBD",
      time: scheduleModal.interviewTime || "TBD",
      type: "Video",
      addedToCalendar: true,
    };
    setInterviews(prev => [...prev, newInterview]);
    setTaskList(prev => [...prev, { id: `interview-${Date.now()}`, label: `Prep for ${scheduleModal.role} interview — ${scheduleModal.company}`, source: "Interview", done: false }]);
    setMetrics(m => ({ ...m, interviews: m.interviews + 1 }));
    flashMetric("interviews");
    toast({ title: "Interview scheduled & added to calendar", description: `${scheduleModal.role} at ${scheduleModal.company}` });
    setScheduleModal(null);
  };

  // Calendar events for interview schedule dialog
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];
    interviews.forEach(iv => {
      const dateMatch = iv.date.match(/(\w+)\s+(\d+),\s+(\d+)/);
      if (dateMatch) {
        const months: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
        const m = months[dateMatch[1]] || "01";
        events.push({ date: `${dateMatch[3]}-${m}-${dateMatch[2].padStart(2, "0")}`, title: `${iv.role} — ${iv.company}`, color: "bg-foreground", type: "interview" });
      }
    });
    // Add some sample calendar events to make it feel like a real Google Calendar
    events.push({ date: "2026-03-05", title: "CS 301 Office Hours", color: "bg-muted-foreground", type: "class" });
    events.push({ date: "2026-03-10", title: "Career Fair", color: "bg-foreground", type: "event" });
    events.push({ date: "2026-03-12", title: "MATH 208 Midterm", color: "bg-muted-foreground", type: "exam" });
    events.push({ date: "2026-03-15", title: "Counseling — Dr. Maya Chen", color: "bg-muted-foreground/60", type: "wellness" });
    events.push({ date: "2026-03-18", title: "Building Resilience Workshop", color: "bg-muted-foreground/60", type: "wellness" });
    return events;
  }, [interviews]);

  const metricCards = [
    { icon: Briefcase, label: "Applications", value: metrics.applications, sub: "This semester", key: "applications" },
    { icon: Calendar, label: "Interviews", value: metrics.interviews, sub: "Scheduled", key: "interviews" },
    { icon: Building2, label: "Companies", value: metrics.companies, sub: "Contacted", key: "companies" },
  ];

  const showWorkflow = demoRunning || demoCompleted;

  // Selected step detail
  const selectedStep = steps.find(s => s.id === selectedStepId);
  const selectedDetail = selectedStepId ? stepDetails[selectedStepId] : null;
  const canShowDetail = selectedStep && (selectedStep.status === "processing" || selectedStep.status === "completed");

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

      {/* Stats — clickable KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {metricCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.key}
              className="transition-all duration-300 cursor-pointer hover:ring-1 hover:ring-foreground/10"
              onClick={() => scrollToSection(stat.key)}
            >
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

      {/* Atlas Career Card */}
      <Card className="mb-8 border-primary/10" data-tutorial="career-check">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-foreground" />
            <CardTitle className="text-lg">Atlas — Career Services</CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {outreachReady && (
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setOutreachModal(true)}>
                <Users className="w-3.5 h-3.5" />
                Outreach Drafts
              </Button>
            )}
            {demoCompleted && (
              <Button size="sm" variant="ghost" onClick={resetWorkflow} className="gap-1 text-xs">
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
            )}
            <Button
              size="sm"
              onClick={runDemo}
              disabled={demoRunning}
              className="gap-1"
            >
              {demoRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-3.5 h-3.5" />}
              {demoRunning ? "Running..." : "Run Career Check"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Role input */}
          {!showWorkflow && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Run a career check to match opportunities, draft resumes, create tasks, and prepare alumni outreach.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Target role:</span>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Data Analyst, SWE internship"
                  className="h-8 text-sm max-w-xs"
                />
              </div>
            </div>
          )}

          {showWorkflow && (
            <div className="space-y-4">
              {/* Horizontal Stepper */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                {steps.map((step, i) => {
                  const isActive = step.status === "processing";
                  const isCompleted = step.status === "completed";
                  const isSelected = step.id === selectedStepId;
                  const isClickable = isCompleted || isActive;
                  return (
                    <div key={step.id} className="flex items-center gap-1 flex-1 min-w-0">
                      <button
                        type="button"
                        disabled={!isClickable}
                        onClick={() => isClickable && setSelectedStepId(step.id === selectedStepId ? null : step.id)}
                        className={`flex flex-col items-center gap-1.5 flex-shrink-0 px-2 py-1.5 rounded-lg transition-all duration-200 ${isSelected ? "bg-primary/10 ring-1 ring-primary/20" : isActive ? "bg-primary/5" : ""
                          } ${isClickable ? "cursor-pointer hover:bg-primary/8" : "cursor-default"}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                          ? "bg-success/15 text-success"
                          : isActive
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                          }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isActive ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Circle className="w-3 h-3" />
                          )}
                        </div>
                        <span className={`text-[10px] font-medium leading-none transition-colors ${isSelected ? "text-foreground" : isCompleted ? "text-success" : isActive ? "text-foreground" : "text-muted-foreground"
                          }`}>
                          {step.label}
                        </span>
                      </button>
                      {i < steps.length - 1 && (
                        <div className={`h-px flex-1 min-w-[12px] transition-colors duration-300 ${isCompleted ? "bg-success/30" : "bg-border"
                          }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status Line */}
              {activeStatusText && (
                <p className="text-xs text-muted-foreground font-medium animate-fade-in">
                  <span className="text-foreground/60">Now:</span>{" "}
                  <span className="text-foreground">{activeStatusText}</span>
                </p>
              )}

              {/* Summary Pills */}
              {summaryPills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {summaryPills.map((pill) => (
                    <span key={pill.label} className="pill-neutral text-[10px] animate-fade-in">
                      {pill.value}
                    </span>
                  ))}
                </div>
              )}

              {/* Step Details Area */}
              {canShowDetail && selectedDetail && (
                <div className="border border-border rounded-lg p-4 animate-fade-in bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">What Atlas did</p>
                    {selectedStep.completedAt && (
                      <span className="text-[10px] text-muted-foreground font-mono-accent">
                        Completed {timeAgo(selectedStep.completedAt)}
                      </span>
                    )}
                    {selectedStep.status === "processing" && (
                      <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> In progress
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {selectedDetail.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/80 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                        <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-foreground/30" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Extras list */}
                  {selectedDetail.extras && (
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {selectedDetail.extras.label}
                      </p>
                      <div className="space-y-1">
                        {selectedDetail.extras.items.map((item, i) => (
                          <p key={i} className="text-xs text-foreground/70 font-mono-accent pl-1">{item}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sample bullets */}
                  {selectedDetail.sampleBullets && (
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {selectedStepId === "outreach" ? "Draft preview" : "Sample bullets"}
                      </p>
                      <div className="space-y-1.5">
                        {selectedDetail.sampleBullets.map((b, i) => (
                          <p key={i} className="text-xs text-foreground/70 italic pl-1">"{b.replace(/^"|"$/g, '')}"</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Source */}
                  {selectedDetail.source && (
                    <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border/60 italic">
                      {selectedDetail.source}
                    </p>
                  )}

                  {/* Guardrail */}
                  {selectedDetail.guardrail && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border/60 text-[10px] text-muted-foreground">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{selectedDetail.guardrail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Tasks Section */}
      <div ref={interviewsRef} className={`mb-8 transition-all duration-500 ${activeSection === "interviews" ? "ring-2 ring-primary/30 rounded-xl" : ""}`} data-tutorial="my-tasks">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-primary" />
              My Tasks
            </CardTitle>
            <span className="text-xs text-muted-foreground font-mono-accent">{taskList.filter(t => !t.done).length} remaining</span>
          </CardHeader>
          <CardContent>
            {taskList.length === 0 ? (
              <div className="py-8 text-center">
                <ListTodo className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Tasks from career checks and saved opportunities will appear here.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {taskList.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer ${task.done ? "opacity-50" : ""}`}
                    onClick={() => handleToggleTask(task.id)}
                  >
                    {task.done ? (
                      <CheckSquare className="w-4 h-4 text-foreground shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-sm flex-1 ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.label}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-mono-accent">{task.source}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applications tracker */}
      <div ref={applicationsRef} className={`mb-8 transition-all duration-500 ${activeSection === "applications" ? "ring-2 ring-primary/30 rounded-xl" : ""}`} data-tutorial="my-applications">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {applications.map((app) => (
                <div
                  key={app.company + app.role}
                  className={`py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-all duration-300 cursor-pointer group ${app.atlasGenerated ? "animate-fade-in-up" : ""
                    }`}
                  onClick={() => app.status === "Draft Ready" ? setDraftModal(app) : undefined}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
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
                      <span className="hidden sm:inline">{app.date}</span>
                    </div>
                    {app.tasks && app.tasks.length > 0 && (
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {app.tasks.map((t, i) => (
                          <span key={i} className="pill-neutral text-[10px] py-0 px-1.5">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={statusStyle(app.status)}>{app.status}</span>
                    {app.status === "Interview" && app.interviewDate && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] gap-1"
                        onClick={(e) => { e.stopPropagation(); handleScheduleInterview(app); }}
                      >
                        <Calendar className="w-3 h-3" /> Schedule
                      </Button>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings — companies section */}
      <div ref={companiesRef} className={`transition-all duration-500 ${activeSection === "companies" ? "ring-2 ring-primary/30 rounded-xl" : ""}`} data-tutorial="recommended-opportunities">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg">Recommended Opportunities</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="pl-9 h-8 w-48 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 relative">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                        {activeFilterTags.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Filters</span>
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setFilters(emptyFilters)}>
                        Clear All
                      </Button>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Job Type</p>
                      <div className="space-y-1.5">
                        {FILTER_OPTIONS.jobType.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:bg-secondary/50 rounded px-2 py-1 -mx-2">
                            <Checkbox checked={filters.jobType.includes(opt)} onCheckedChange={() => toggleFilterValue("jobType", opt)} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Industry</p>
                      <div className="space-y-1.5">
                        {FILTER_OPTIONS.industry.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:bg-secondary/50 rounded px-2 py-1 -mx-2">
                            <Checkbox checked={filters.industry.includes(opt)} onCheckedChange={() => toggleFilterValue("industry", opt)} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Location</p>
                      <div className="space-y-1.5">
                        {FILTER_OPTIONS.location.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:bg-secondary/50 rounded px-2 py-1 -mx-2">
                            <Checkbox checked={filters.location.includes(opt)} onCheckedChange={() => toggleFilterValue("location", opt)} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Salary Range</p>
                      <div className="space-y-1.5">
                        {FILTER_OPTIONS.salary.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:bg-secondary/50 rounded px-2 py-1 -mx-2">
                            <Checkbox checked={filters.salary.includes(opt)} onCheckedChange={() => toggleFilterValue("salary", opt)} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Match Score</p>
                      <div className="flex gap-2">
                        {FILTER_OPTIONS.matchScore.map(score => (
                          <Button
                            key={score}
                            variant={filters.matchScore === score ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-7 px-3"
                            onClick={() => setFilters(prev => ({ ...prev, matchScore: prev.matchScore === score ? null : score }))}
                          >
                            {score}%+
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:bg-secondary/50 rounded px-2 py-1 -mx-2">
                        <Checkbox checked={filters.saved} onCheckedChange={() => setFilters(prev => ({ ...prev, saved: !prev.saved }))} />
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        Saved Only
                      </label>
                    </div>
                    <Separator />
                    <Button size="sm" className="w-full" onClick={() => setFilterOpen(false)}>Apply Filters</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            {activeFilterTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {activeFilterTags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {tag.label}
                    <button onClick={() => removeFilter(tag.category, tag.value)} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
                <button onClick={() => setFilters(emptyFilters)} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1">
                  Clear all
                </button>
              </div>
            )}

            <div className="divide-y divide-border">
              {filteredListings.length === 0 ? (
                <div className="py-8 text-center">
                  <SlidersHorizontal className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No opportunities match your filters.</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setFilters(emptyFilters)}>Clear filters</Button>
                </div>
              ) : (
                filteredListings.map((job, idx) => (
                  <div key={job.company + job.role} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
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
                    <div className="flex items-center gap-2 flex-shrink-0">
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
                      <button
                        className="p-1 rounded hover:bg-secondary transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleToggleSave(idx); }}
                      >
                        <Bookmark className={`w-4 h-4 transition-all duration-300 ${job.saved ? "text-foreground fill-foreground" : "text-muted-foreground"}`} />
                      </button>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Interview Dialog (with Calendar) */}
      <Dialog open={!!scheduleModal} onOpenChange={() => setScheduleModal(null)}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Interview
            </DialogTitle>
            <DialogDescription>
              {scheduleModal?.role} at {scheduleModal?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="my-2">
            <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-secondary">
              <Video className="w-4 h-4 text-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{scheduleModal?.interviewDate || "TBD"} · {scheduleModal?.interviewTime || "TBD"}</p>
                <p className="text-xs text-muted-foreground">Video Interview</p>
              </div>
            </div>
            <DemoCalendar events={calendarEvents} className="border border-border rounded-xl p-4" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleModal(null)}>Cancel</Button>
            <Button onClick={confirmSchedule} className="gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              Confirm & Add to Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draft Review Modal */}
      <Dialog open={!!draftModal} onOpenChange={() => setDraftModal(null)}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {draftModal?.role} — {draftModal?.company}
            </DialogTitle>
            <DialogDescription>Review the resume draft prepared for this application.</DialogDescription>
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
            Applications are not submitted without your confirmation.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraftModal(null)}>Close</Button>
            <Button onClick={handleApproveSubmit} className="gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              Approve & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Outreach Drafts Modal */}
      <Dialog open={outreachModal} onOpenChange={setOutreachModal}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Alumni Outreach Drafts
            </DialogTitle>
            <DialogDescription>Personalized messages prepared for review. Sending requires confirmation.</DialogDescription>
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
                          toast({ title: "Message sent", description: `Outreach to ${d.name} delivered` });
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
