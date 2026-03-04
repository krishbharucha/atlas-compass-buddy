import { useState, useEffect, useCallback, useRef } from "react";
import {
  Heart, Phone, Calendar, Users, BookOpen, MessageSquare, Clock,
  ChevronRight, ExternalLink, Shield, Zap, CheckCircle2, AlertTriangle,
  Activity, Loader2, Circle, Send, Star, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/* ─── TYPES ─── */
type StepStatus = "queued" | "processing" | "completed";

interface WorkflowStep {
  id: string;
  label: string;
  status: StepStatus;
  completedAt?: number;
  duration: number;
}

/* ─── INITIAL DATA ─── */
const initialSteps: WorkflowStep[] = [
  { id: "trend", label: "Trend Analysis", status: "queued", duration: 1500 },
  { id: "pattern", label: "Pattern Detection", status: "queued", duration: 1500 },
  { id: "resource", label: "Resource Match", status: "queued", duration: 2000 },
  { id: "appointment", label: "Appointment Booked", status: "queued", duration: 2000 },
  { id: "advisor", label: "Advisor Alerted", status: "queued", duration: 1500 },
  { id: "toolkit", label: "Toolkit Sent", status: "queued", duration: 1000 },
];

const initialPulse = [
  { week: "Week 8", score: 6, trend: "stable" as const },
  { week: "Week 7", score: 5, trend: "down" as const },
  { week: "Week 6", score: 7, trend: "up" as const },
  { week: "Week 5", score: 7, trend: "stable" as const },
];

const atlasCapabilities = [
  {
    trigger: "Proactive wellness monitoring",
    example: "Weekly pulse checks + trend tracking",
    actions: [
      "Sends weekly wellness pulse checks & tracks scores over time",
      "Surfaces patterns before they become crises",
      "Alerts advisor with confidential welfare flag after 2+ weeks of decline",
      "Personalizes resources based on specific stress patterns",
    ],
  },
  {
    trigger: "Acute distress detection",
    example: "\"I haven't slept in 4 days and I have 3 finals\"",
    actions: [
      "Triages urgency with 3 warm follow-up questions",
      "Routes to appropriate care level (self-guided → peer → counselor → crisis)",
      "Books same-day counselor slot with pre-filled intake form",
      "Sends personalized \"tonight's toolkit\" via SMS",
    ],
  },
  {
    trigger: "Crisis intervention",
    example: "Student expresses hopelessness during any conversation",
    actions: [
      "Immediately and warmly pivots conversation tone",
      "Pages on-call crisis counselor for direct callback",
      "Sends 24/7 crisis support number to student's phone",
      "Stays active until student confirms human connection",
    ],
    isCrisis: true,
  },
];

const timeAgo = (ts?: number) => {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
};

/* ─── COMPONENT ─── */
const Wellness = () => {
  const navigate = useNavigate();

  // Workflow
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [, setTick] = useState(0);
  const runningRef = useRef(false);

  // Student input
  const [studentMessage, setStudentMessage] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [distressSignals, setDistressSignals] = useState<string[]>([]);
  const [severityLabel, setSeverityLabel] = useState<string | null>(null);

  // Dynamic state
  const [distressLevel, setDistressLevel] = useState<"normal" | "elevated" | "high">("normal");
  const [wellnessInsight, setWellnessInsight] = useState<string | null>(null);
  const [pulseInsight, setPulseInsight] = useState<string | null>(null);
  const [pulseAlerts, setPulseAlerts] = useState<Set<number>>(new Set());
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [recommendedGroup, setRecommendedGroup] = useState<string | null>(null);
  const [recommendedWorkshop, setRecommendedWorkshop] = useState<string | null>(null);
  const [recommendedEvents, setRecommendedEvents] = useState<Set<number>>(new Set());
  const [advisorFlagged, setAdvisorFlagged] = useState(false);
  const [toolkitItems, setToolkitItems] = useState<string[]>([]);
  const [crisisDetected, setCrisisDetected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const completeStep = useCallback((idx: number) => {
    setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, status: "completed", completedAt: Date.now() } : s));
  }, []);

  const startStep = useCallback((idx: number) => {
    setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, status: "processing" } : s));
  }, []);

  // Analyze message for distress signals
  const analyzeMessage = (msg: string) => {
    const lower = msg.toLowerCase();
    const signals: string[] = [];
    const severeKeywords = ["hopeless", "give up", "end it", "can't go on", "no point", "don't want to be here", "hurt myself"];
    const stressKeywords: [string, string][] = [
      ["sleep", "Sleep deprivation"],
      ["insomnia", "Sleep deprivation"],
      ["haven't slept", "Sleep deprivation"],
      ["exam", "Exam stress"],
      ["finals", "Exam stress"],
      ["test", "Exam stress"],
      ["overwhelm", "Feeling overwhelmed"],
      ["stress", "Academic stress"],
      ["anxious", "Anxiety"],
      ["anxiety", "Anxiety"],
      ["panic", "Panic symptoms"],
      ["lonely", "Social isolation"],
      ["alone", "Social isolation"],
      ["sad", "Low mood"],
      ["depressed", "Low mood"],
      ["burnout", "Burnout"],
      ["exhausted", "Exhaustion"],
      ["tired", "Fatigue"],
    ];

    const isCrisis = severeKeywords.some((k) => lower.includes(k));

    const seen = new Set<string>();
    for (const [keyword, label] of stressKeywords) {
      if (lower.includes(keyword) && !seen.has(label)) {
        signals.push(label);
        seen.add(label);
      }
    }
    if (signals.length === 0) signals.push("General stress");

    let level: "normal" | "elevated" | "high" = "normal";
    let severity = "Low";
    if (isCrisis) { level = "high"; severity = "High"; }
    else if (signals.length >= 2) { level = "elevated"; severity = "Moderate"; }
    else { level = "normal"; severity = "Low"; }

    // Upgrade to at least moderate for any real content
    if (level === "normal" && msg.trim().length > 15) { level = "elevated"; severity = "Moderate"; }

    return { signals, level, severity, isCrisis };
  };

  const runWorkflow = useCallback(async (message: string) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setDemoRunning(true);
    setDemoCompleted(false);
    setSubmittedMessage(message);
    setAnalysisMessage("Analyzing your message...");

    // Reset
    setSteps(initialSteps.map((s) => ({ ...s, status: "queued", completedAt: undefined })));
    setDistressLevel("normal");
    setWellnessInsight(null);
    setPulseInsight(null);
    setPulseAlerts(new Set());
    setAppointmentBooked(false);
    setRecommendedGroup(null);
    setRecommendedWorkshop(null);
    setRecommendedEvents(new Set());
    setAdvisorFlagged(false);
    setToolkitItems([]);
    setCrisisDetected(false);
    setDistressSignals([]);
    setSeverityLabel(null);

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const { signals, level, severity, isCrisis } = analyzeMessage(message);

    await delay(800);
    setAnalysisMessage(null);

    // Step 1: Distress Detection
    startStep(0);
    await delay(1500);
    completeStep(0);
    setDistressSignals(signals);
    setSeverityLabel(severity);

    // Step 2: Severity Classification + Pulse Comparison
    startStep(1);
    await delay(1500);
    completeStep(1);
    setDistressLevel(level);
    setWellnessInsight("Your wellness score has declined for two consecutive weeks.");
    setPulseInsight("Detected decline across last two weeks.");
    setPulseAlerts(new Set([0, 1]));
    toast({ title: "Concerns identified", description: `${signals.join(", ")} · ${severity} distress` });

    // Step 3: Resource Recommendation
    startStep(2);
    await delay(2000);
    completeStep(2);
    const groupPick = signals.some((s) => s.includes("Anxiety") || s.includes("Panic")) ? "Peer Support: Anxiety" : "Peer Support: Stress Management";
    const workshopPick = signals.some((s) => s.includes("Sleep")) ? "Sleep Hygiene Seminar" : "Stress Management Workshop";
    setRecommendedGroup(groupPick);
    setRecommendedWorkshop(workshopPick);
    setRecommendedEvents(new Set([1, 2]));
    toast({ title: "Resources matched", description: "Personalized support resources identified" });

    // Step 4: Counseling Appointment
    if (level !== "normal") {
      startStep(3);
      await delay(2000);
      completeStep(3);
      setAppointmentBooked(true);
      toast({ title: "Counselor appointment suggested", description: "Tomorrow at 3:00 PM with Dr. Maya Chen" });
    } else {
      completeStep(3);
    }

    // Step 5: Advisor Welfare Flag
    startStep(4);
    await delay(1500);
    completeStep(4);
    if (level === "elevated" || level === "high") setAdvisorFlagged(true);

    // Step 6: Crisis Detection (if severe)
    if (isCrisis) {
      setCrisisDetected(true);
      setDistressLevel("high");
    }

    // Step 7: Toolkit Sent
    startStep(5);
    await delay(1000);
    completeStep(5);
    const toolkit: string[] = [];
    if (signals.some((s) => s.includes("Sleep"))) toolkit.push("Sleep reset guide sent via SMS");
    toolkit.push("Stress relief exercises added to your dashboard");
    if (level !== "normal") toolkit.push("Counselor appointment reminder scheduled");
    if (signals.some((s) => s.includes("Exam"))) toolkit.push("Exam planning template added to your dashboard");
    setToolkitItems(toolkit);
    toast({ title: "Support toolkit delivered", description: "Personalized resources sent to your phone and dashboard" });

    setDemoRunning(false);
    setDemoCompleted(true);
    runningRef.current = false;
  }, [completeStep, startStep]);

  // Dynamic resource cards
  const resources = [
    {
      title: "Counseling Services",
      description: appointmentBooked
        ? "Your next appointment has been reserved by Atlas."
        : "Schedule one-on-one sessions with licensed therapists. Confidential and free for all enrolled students.",
      icon: MessageSquare,
      availability: "Mon–Fri, 8AM–6PM",
      action: appointmentBooked ? "View Appointment" : "Book Appointment",
      appointmentInfo: appointmentBooked ? { time: "Tomorrow — 3:00 PM", counselor: "Dr. Maya Chen" } : undefined,
    },
    {
      title: "Crisis Support",
      description: distressLevel === "high"
        ? "Atlas detected urgent distress signals. Immediate connection available."
        : "24/7 crisis hotline and immediate support. Trained counselors available around the clock.",
      icon: Phone,
      availability: "24/7",
      action: distressLevel === "high" ? "Connect Now" : "Call Now",
      urgent: true,
      highPriority: distressLevel === "high",
    },
    {
      title: "Peer Support Groups",
      description: recommendedGroup
        ? "Students with similar wellness patterns found this group helpful."
        : "Join student-led support circles for anxiety, stress management, identity, and more.",
      icon: Users,
      availability: "Weekly sessions",
      action: "View Schedule",
      recommended: recommendedGroup,
    },
    {
      title: "Wellness Workshops",
      description: recommendedWorkshop
        ? "Sleep hygiene workshop suggested based on declining sleep scores."
        : "Mindfulness, time management, sleep hygiene, and resilience-building workshops.",
      icon: BookOpen,
      availability: "Bi-weekly",
      action: "Browse Workshops",
      recommended: recommendedWorkshop,
    },
  ];

  const upcomingEvents = [
    { title: "Stress Management Workshop", date: "Mar 8, 2026", time: "2:00 PM", location: "Wellness Center 204" },
    { title: "Meditation Circle", date: "Mar 10, 2026", time: "12:00 PM", location: "Student Union 101" },
    { title: "Sleep Hygiene Seminar", date: "Mar 14, 2026", time: "4:00 PM", location: "Health Sciences 310" },
    { title: "Peer Support: Anxiety", date: "Mar 15, 2026", time: "3:00 PM", location: "Wellness Center 102" },
  ];

  // Sort events: recommended first
  const sortedEvents = [...upcomingEvents].sort((a, i) => {
    const aIdx = upcomingEvents.indexOf(a);
    const isRec = recommendedEvents.has(aIdx);
    return isRec ? -1 : 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Wellness & Support</h1>
          <p className="text-sm text-muted-foreground">Mental health resources, counseling, and campus wellness programs.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Shield className="w-3.5 h-3.5" />
          All services are confidential
        </Button>
      </div>

      {/* Emergency banner */}
      <Card className={`mb-8 transition-all duration-500 ${crisisDetected || distressLevel === "high" ? "border-destructive/40 bg-destructive/10" : "border-destructive/20 bg-destructive/5"}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className={`w-5 h-5 text-destructive ${crisisDetected ? "animate-pulse" : ""}`} />
            <div>
              <p className="text-sm font-medium text-foreground">
                {crisisDetected
                  ? "We're here to help. Immediate support is available."
                  : distressLevel === "high"
                  ? "We noticed you may be under significant stress. Immediate help is available."
                  : "In crisis? Reach out now."}
              </p>
              <p className="text-xs text-muted-foreground">988 Suicide & Crisis Lifeline · Campus Emergency: (555) 123-4567</p>
            </div>
          </div>
          <Button variant={crisisDetected || distressLevel === "high" ? "default" : "outline"} size="sm">
            {crisisDetected ? "Connect to Counselor Now" : "Get Help Now"}
          </Button>
        </CardContent>
      </Card>

      {/* Atlas AI — Wellness */}
      <Card className="mb-8 border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-foreground" />
            <CardTitle className="text-lg">Atlas AI — Mental Health Support</CardTitle>
          </div>
          <Button size="sm" onClick={runDemo} disabled={demoRunning} className="gap-1">
            {demoRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-3.5 h-3.5" />}
            {demoRunning ? "Running..." : "Try Demo"}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Atlas monitors wellness trends, detects stress signals, recommends resources, schedules counseling support, and ensures students receive help before challenges escalate.
          </p>

          {/* Workflow status chips */}
          {(demoRunning || demoCompleted) && (
            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap gap-2">
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

              {/* Wellness insight */}
              {wellnessInsight && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border animate-fade-in">
                  <p className="text-xs font-medium text-foreground mb-1 flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> Last Wellness Insight
                  </p>
                  <p className="text-xs text-muted-foreground">{wellnessInsight}</p>
                </div>
              )}

              {/* Advisor flag */}
              {advisorFlagged && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border animate-fade-in">
                  <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Shield className="w-3 h-3" /> Student wellness advisor notified (confidential flag created).
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">No personal conversation data shared.</p>
                </div>
              )}

              {/* Toolkit */}
              {toolkitItems.length > 0 && (
                <div className="p-3 rounded-lg bg-success/5 border border-success/20 animate-fade-in">
                  <p className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-success" /> Toolkit Sent
                  </p>
                  <div className="space-y-1">
                    {toolkitItems.map((item, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-success shrink-0" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Capability cards */}
          <div className="space-y-4">
            {atlasCapabilities.map((cap) => (
              <div key={cap.trigger} className={`border rounded-lg p-4 ${cap.isCrisis ? "border-destructive/20 bg-destructive/5" : "border-border"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {cap.isCrisis && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                    <span className="text-sm font-semibold text-foreground">{cap.trigger}</span>
                  </div>
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

      {/* Resources */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card
              key={resource.title}
              className={`hover:border-foreground/10 transition-all duration-300 cursor-pointer group ${
                resource.highPriority ? "border-destructive/30 bg-destructive/5" : ""
              } ${resource.recommended ? "border-primary/20" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    {resource.highPriority && (
                      <Badge variant="destructive" className="text-[10px]">High Priority</Badge>
                    )}
                    {resource.appointmentInfo && (
                      <Badge variant="secondary" className="text-[10px]">
                        <Zap className="w-2.5 h-2.5 mr-0.5" /> Reserved by Atlas
                      </Badge>
                    )}
                    {resource.recommended && (
                      <Badge variant="secondary" className="text-[10px]">
                        <Star className="w-2.5 h-2.5 mr-0.5" /> Recommended
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {resource.availability}
                    </div>
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{resource.title}</h3>
                {resource.recommended && (
                  <p className="text-xs font-medium text-foreground mb-1">Recommended for you: {resource.recommended}</p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{resource.description}</p>
                {resource.appointmentInfo && (
                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border mb-3 animate-fade-in">
                    <p className="text-xs font-medium text-foreground">Next Available Appointment</p>
                    <p className="text-sm font-semibold text-foreground">{resource.appointmentInfo.time}</p>
                    <p className="text-xs text-muted-foreground">Counselor: {resource.appointmentInfo.counselor}</p>
                  </div>
                )}
                <Button variant={resource.highPriority ? "default" : "outline"} size="sm" className="gap-1">
                  {resource.action}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <Button variant="outline" size="sm">View Calendar</Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {sortedEvents.map((event) => {
                const origIdx = upcomingEvents.findIndex((e) => e.title === event.title);
                const isRecommended = recommendedEvents.has(origIdx);
                return (
                  <div key={event.title} className={`py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-all duration-300 cursor-pointer group ${isRecommended ? "bg-muted/30" : ""}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{event.title}</p>
                        {isRecommended && (
                          <span className="pill-blue text-[10px]">
                            <Star className="w-2.5 h-2.5 mr-0.5 inline" /> Suggested for you
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{event.date}</span>
                        <span>·</span>
                        <span>{event.time}</span>
                        <span>·</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Wellness Pulse */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Wellness Pulse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initialPulse.map((pulse, idx) => (
                <div key={pulse.week} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">{pulse.week}</span>
                    {pulseAlerts.has(idx) && (
                      <AlertCircle className="w-3.5 h-3.5 text-warning animate-fade-in" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-sm transition-colors duration-300 ${
                            i < pulse.score
                              ? pulseAlerts.has(idx)
                                ? "bg-warning/40"
                                : "bg-foreground/20"
                              : "bg-secondary"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono-accent text-muted-foreground w-8 text-right">{pulse.score}/10</span>
                  </div>
                </div>
              ))}
              {pulseInsight ? (
                <p className="text-xs text-warning mt-2 animate-fade-in flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {pulseInsight}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">
                  Atlas monitors trends and proactively reaches out if scores decline for 2+ consecutive weeks.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wellness;
