import { useState, useEffect, useCallback, useRef } from "react";
import {
  Heart, Phone, Calendar, Users, BookOpen, MessageSquare, Clock,
  ChevronRight, Shield, Zap, CheckCircle2, AlertTriangle,
  Activity, Loader2, Circle, Send, Star, AlertCircle, Video,
  PhoneCall, X, Check, MapPin, User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

/* ─── TYPES ─── */
type StepStatus = "queued" | "processing" | "completed";

interface WorkflowStep {
  id: string;
  label: string;
  status: StepStatus;
  completedAt?: number;
  duration: number;
}

type BookingModal = null | "counseling" | "crisis-call" | "crisis-video" | "peer-group" | "workshop";
type BookingPhase = "scanning" | "found" | "confirming" | "booked";

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

const wellnessCriteria = [
  { id: "sleep", label: "Sleep Quality", description: "Hours of sleep, consistency, difficulty falling asleep", score: 5, max: 10 },
  { id: "stress", label: "Perceived Stress", description: "Academic pressure, workload, deadlines", score: 7, max: 10 },
  { id: "social", label: "Social Connection", description: "Frequency of meaningful social interactions", score: 6, max: 10 },
  { id: "physical", label: "Physical Activity", description: "Exercise frequency, energy levels, appetite", score: 7, max: 10 },
  { id: "mood", label: "Overall Mood", description: "General emotional state, motivation, enjoyment", score: 5, max: 10 },
  { id: "academic", label: "Academic Confidence", description: "Feeling prepared for classes and exams", score: 6, max: 10 },
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

const counselors = [
  { name: "Dr. Maya Chen", specialty: "Anxiety & Academic Stress", nextSlot: "Tomorrow 3:00 PM", rating: 4.9 },
  { name: "Dr. James Park", specialty: "Sleep & Burnout", nextSlot: "Tomorrow 10:00 AM", rating: 4.8 },
  { name: "Sarah Williams, LCSW", specialty: "General Counseling", nextSlot: "Today 4:30 PM", rating: 4.7 },
];

const peerGroups = [
  { name: "Anxiety Support Circle", day: "Tuesdays", time: "5:00 PM", location: "Wellness Center 102", spots: 4, facilitator: "Trained peer mentor" },
  { name: "Stress Management Group", day: "Thursdays", time: "3:00 PM", location: "Student Union 201", spots: 6, facilitator: "Trained peer mentor" },
  { name: "Mindfulness Practice", day: "Wednesdays", time: "12:00 PM", location: "Wellness Center 104", spots: 8, facilitator: "Wellness staff" },
];

const workshops = [
  { name: "Sleep Hygiene Seminar", date: "Mar 14, 2026", time: "4:00 PM", location: "Health Sciences 310", duration: "90 min", capacity: "20 spots left" },
  { name: "Stress Management Workshop", date: "Mar 8, 2026", time: "2:00 PM", location: "Wellness Center 204", duration: "60 min", capacity: "12 spots left" },
  { name: "Building Resilience", date: "Mar 18, 2026", time: "1:00 PM", location: "Student Union 101", duration: "75 min", capacity: "15 spots left" },
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

  // Booking modals
  const [activeModal, setActiveModal] = useState<BookingModal>(null);
  const [bookingPhase, setBookingPhase] = useState<BookingPhase>("scanning");
  const [bookingSteps, setBookingSteps] = useState<string[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedWorkshop, setSelectedWorkshop] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => setCallTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  const completeStep = useCallback((idx: number) => {
    setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, status: "completed", completedAt: Date.now() } : s));
  }, []);

  const startStep = useCallback((idx: number) => {
    setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, status: "processing" } : s));
  }, []);

  const analyzeMessage = (msg: string) => {
    const lower = msg.toLowerCase();
    const signals: string[] = [];
    const severeKeywords = ["hopeless", "give up", "end it", "can't go on", "no point", "don't want to be here", "hurt myself"];
    const stressKeywords: [string, string][] = [
      ["sleep", "Sleep deprivation"], ["insomnia", "Sleep deprivation"], ["haven't slept", "Sleep deprivation"],
      ["exam", "Exam stress"], ["finals", "Exam stress"], ["test", "Exam stress"],
      ["overwhelm", "Feeling overwhelmed"], ["stress", "Academic stress"],
      ["anxious", "Anxiety"], ["anxiety", "Anxiety"], ["panic", "Panic symptoms"],
      ["lonely", "Social isolation"], ["alone", "Social isolation"],
      ["sad", "Low mood"], ["depressed", "Low mood"], ["burnout", "Burnout"],
      ["exhausted", "Exhaustion"], ["tired", "Fatigue"],
    ];

    const isCrisis = severeKeywords.some((k) => lower.includes(k));
    const seen = new Set<string>();
    for (const [keyword, label] of stressKeywords) {
      if (lower.includes(keyword) && !seen.has(label)) { signals.push(label); seen.add(label); }
    }
    if (signals.length === 0) signals.push("General stress");

    let level: "normal" | "elevated" | "high" = "normal";
    let severity = "Low";
    if (isCrisis) { level = "high"; severity = "High"; }
    else if (signals.length >= 2) { level = "elevated"; severity = "Moderate"; }
    if (level === "normal" && msg.trim().length > 15) { level = "elevated"; severity = "Moderate"; }

    return { signals, level, severity, isCrisis };
  };

  // Booking workflow
  const runBookingFlow = useCallback(async (type: BookingModal) => {
    setActiveModal(type);
    setBookingPhase("scanning");
    setBookingSteps([]);
    setCallActive(false);
    setCallTimer(0);

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const addStep = (step: string) => setBookingSteps((prev) => [...prev, step]);

    if (type === "counseling") {
      addStep("Checking counselor availability...");
      await delay(800);
      addStep("Found 3 available counselors");
      await delay(600);
      addStep("Matching based on your wellness profile");
      await delay(700);
      addStep("Pre-filling intake form from student record");
      await delay(500);
      setBookingPhase("found");
    } else if (type === "crisis-call" || type === "crisis-video") {
      addStep("Connecting to crisis support line...");
      await delay(600);
      addStep("Routing to on-call counselor");
      await delay(800);
      addStep("Counselor available — ready to connect");
      await delay(500);
      setBookingPhase("found");
    } else if (type === "peer-group") {
      addStep("Scanning available peer support groups...");
      await delay(700);
      addStep("Found 3 groups with open spots");
      await delay(600);
      addStep("Checking schedule compatibility");
      await delay(500);
      addStep("Matching to your wellness concerns");
      await delay(400);
      setBookingPhase("found");
    } else if (type === "workshop") {
      addStep("Browsing upcoming workshops...");
      await delay(700);
      addStep("Found 3 relevant workshops");
      await delay(500);
      addStep("Checking seat availability");
      await delay(400);
      setBookingPhase("found");
    }
  }, []);

  const confirmBooking = useCallback(async (type: BookingModal) => {
    setBookingPhase("confirming");
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const addStep = (step: string) => setBookingSteps((prev) => [...prev, step]);

    if (type === "counseling") {
      addStep("Reserving appointment slot...");
      await delay(600);
      addStep("Sending confirmation to your email");
      await delay(500);
      addStep("Adding to your calendar");
      await delay(400);
      setAppointmentBooked(true);
    } else if (type === "peer-group") {
      addStep("Reserving your spot...");
      await delay(500);
      addStep("Sending group details to your email");
      await delay(400);
      addStep("Calendar reminder set");
      await delay(400);
      setRecommendedGroup(peerGroups[selectedGroup].name);
    } else if (type === "workshop") {
      addStep("Registering for workshop...");
      await delay(500);
      addStep("Confirmation sent to email");
      await delay(400);
      addStep("Pre-workshop materials will be sent 24h before");
      await delay(400);
      setRecommendedWorkshop(workshops[selectedWorkshop].name);
    }

    setBookingPhase("booked");
    toast({
      title: "✓ Booking confirmed",
      description: type === "counseling"
        ? `Appointment with ${counselors[selectedCounselor].name}`
        : type === "peer-group"
        ? `Joined ${peerGroups[selectedGroup].name}`
        : `Registered for ${workshops[selectedWorkshop].name}`,
    });
  }, [selectedCounselor, selectedGroup, selectedWorkshop]);

  const startCall = () => {
    setCallActive(true);
    setCallTimer(0);
  };

  const endCall = () => {
    setCallActive(false);
    setActiveModal(null);
    toast({ title: "Call ended", description: "Thank you for reaching out. Follow-up resources have been sent." });
  };

  const formatCallTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const runWorkflow = useCallback(async (message: string) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setDemoRunning(true);
    setDemoCompleted(false);
    setSubmittedMessage(message);
    setAnalysisMessage("Analyzing your message...");

    setSteps(initialSteps.map((s) => ({ ...s, status: "queued", completedAt: undefined })));
    setDistressLevel("normal"); setWellnessInsight(null); setPulseInsight(null);
    setPulseAlerts(new Set()); setAppointmentBooked(false);
    setRecommendedGroup(null); setRecommendedWorkshop(null);
    setRecommendedEvents(new Set()); setAdvisorFlagged(false);
    setToolkitItems([]); setCrisisDetected(false);
    setDistressSignals([]); setSeverityLabel(null);

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const { signals, level, severity, isCrisis } = analyzeMessage(message);

    await delay(800);
    setAnalysisMessage(null);

    startStep(0); await delay(1500); completeStep(0);
    setDistressSignals(signals); setSeverityLabel(severity);

    startStep(1); await delay(1500); completeStep(1);
    setDistressLevel(level);
    setWellnessInsight("Your wellness score has declined for two consecutive weeks.");
    setPulseInsight("Detected decline across last two weeks.");
    setPulseAlerts(new Set([0, 1]));
    toast({ title: "Concerns identified", description: `${signals.join(", ")} · ${severity} distress` });

    startStep(2); await delay(2000); completeStep(2);
    const groupPick = signals.some((s) => s.includes("Anxiety") || s.includes("Panic")) ? "Peer Support: Anxiety" : "Peer Support: Stress Management";
    const workshopPick = signals.some((s) => s.includes("Sleep")) ? "Sleep Hygiene Seminar" : "Stress Management Workshop";
    setRecommendedGroup(groupPick); setRecommendedWorkshop(workshopPick);
    setRecommendedEvents(new Set([1, 2]));

    if (level !== "normal") {
      startStep(3); await delay(2000); completeStep(3);
      setAppointmentBooked(true);
      toast({ title: "Counselor appointment suggested", description: "Tomorrow at 3:00 PM with Dr. Maya Chen" });
    } else { completeStep(3); }

    startStep(4); await delay(1500); completeStep(4);
    if (level === "elevated" || level === "high") setAdvisorFlagged(true);
    if (isCrisis) { setCrisisDetected(true); setDistressLevel("high"); }

    startStep(5); await delay(1000); completeStep(5);
    const toolkit: string[] = [];
    if (signals.some((s) => s.includes("Sleep"))) toolkit.push("Sleep reset guide sent via SMS");
    toolkit.push("Stress relief exercises added to your dashboard");
    if (level !== "normal") toolkit.push("Counselor appointment reminder scheduled");
    if (signals.some((s) => s.includes("Exam"))) toolkit.push("Exam planning template added to your dashboard");
    setToolkitItems(toolkit);
    toast({ title: "Support toolkit delivered", description: "Personalized resources sent to your phone and dashboard" });

    setDemoRunning(false); setDemoCompleted(true); runningRef.current = false;
  }, [completeStep, startStep]);

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
      modalType: "counseling" as BookingModal,
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
      modalType: "crisis-call" as BookingModal,
    },
    {
      title: "Peer Support Groups",
      description: recommendedGroup
        ? "Students with similar wellness patterns found this group helpful."
        : "Join student-led support circles for anxiety, stress management, identity, and more.",
      icon: Users,
      availability: "Weekly sessions",
      action: "Join a Group",
      recommended: recommendedGroup,
      modalType: "peer-group" as BookingModal,
    },
    {
      title: "Wellness Workshops",
      description: recommendedWorkshop
        ? "Workshop suggested based on your wellness profile."
        : "Mindfulness, time management, sleep hygiene, and resilience-building workshops.",
      icon: BookOpen,
      availability: "Bi-weekly",
      action: "Register",
      recommended: recommendedWorkshop,
      modalType: "workshop" as BookingModal,
    },
  ];

  const upcomingEvents = [
    { title: "Stress Management Workshop", date: "Mar 8, 2026", time: "2:00 PM", location: "Wellness Center 204" },
    { title: "Meditation Circle", date: "Mar 10, 2026", time: "12:00 PM", location: "Student Union 101" },
    { title: "Sleep Hygiene Seminar", date: "Mar 14, 2026", time: "4:00 PM", location: "Health Sciences 310" },
    { title: "Peer Support: Anxiety", date: "Mar 15, 2026", time: "3:00 PM", location: "Wellness Center 102" },
  ];

  const sortedEvents = [...upcomingEvents].sort((a) => {
    const aIdx = upcomingEvents.indexOf(a);
    return recommendedEvents.has(aIdx) ? -1 : 0;
  });

  const compositeScore = Math.round(wellnessCriteria.reduce((sum, c) => sum + c.score, 0) / wellnessCriteria.length * 10);

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
                {crisisDetected ? "We're here to help. Immediate support is available." : distressLevel === "high" ? "We noticed you may be under significant stress." : "In crisis? Reach out now."}
              </p>
              <p className="text-xs text-muted-foreground">988 Suicide & Crisis Lifeline · Campus Emergency: (555) 123-4567</p>
            </div>
          </div>
          <Button
            variant={crisisDetected || distressLevel === "high" ? "default" : "outline"}
            size="sm"
            onClick={() => runBookingFlow("crisis-call")}
          >
            {crisisDetected ? "Connect to Counselor Now" : "Get Help Now"}
          </Button>
        </CardContent>
      </Card>

      {/* Atlas AI — Wellness */}
      <Card className="mb-8 border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-foreground" />
            <CardTitle className="text-lg">Atlas AI — Mental Health Support</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Atlas monitors wellness trends, detects stress signals, recommends resources, schedules counseling support, and ensures students receive help before challenges escalate.
          </p>

          {/* Student input flow */}
          {!demoRunning && !demoCompleted && (
            <div className="mb-4 p-4 rounded-lg bg-muted/30 border border-border space-y-3">
              <p className="text-sm font-medium text-foreground">How are you feeling today?</p>
              <textarea
                value={studentMessage}
                onChange={(e) => setStudentMessage(e.target.value)}
                placeholder="I haven't slept well and I feel overwhelmed about exams…"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
              />
              <Button size="sm" onClick={() => { if (studentMessage.trim()) runWorkflow(studentMessage.trim()); }} disabled={!studentMessage.trim()} className="gap-1.5">
                <Send className="w-3.5 h-3.5" /> Check In With Atlas
              </Button>
            </div>
          )}

          {analysisMessage && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border animate-fade-in flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{analysisMessage}</p>
            </div>
          )}

          {submittedMessage && !analysisMessage && (
            <div className="mb-4 space-y-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground mb-1">You shared:</p>
                <p className="text-sm text-foreground italic">"{submittedMessage}"</p>
              </div>
              {distressSignals.length > 0 && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border animate-fade-in">
                  <p className="text-xs font-medium text-foreground mb-1.5">Thanks for sharing that. Here's what I noticed:</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {distressSignals.map((signal) => (
                      <span key={signal} className="pill-warning text-[10px]">{signal}</span>
                    ))}
                  </div>
                  {severityLabel && (
                    <p className="text-xs text-muted-foreground">
                      Distress level: <span className={`font-medium ${severityLabel === "High" ? "text-destructive" : "text-foreground"}`}>{severityLabel}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {demoCompleted && (
            <div className="mb-4">
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => {
                setDemoCompleted(false); setSubmittedMessage(""); setStudentMessage("");
                setDistressSignals([]); setSeverityLabel(null);
                setSteps(initialSteps.map((s) => ({ ...s, status: "queued", completedAt: undefined })));
                setDistressLevel("normal"); setWellnessInsight(null); setPulseInsight(null);
                setPulseAlerts(new Set()); setAppointmentBooked(false);
                setRecommendedGroup(null); setRecommendedWorkshop(null);
                setRecommendedEvents(new Set()); setAdvisorFlagged(false);
                setToolkitItems([]); setCrisisDetected(false);
              }}>
                Check in again
              </Button>
            </div>
          )}

          {(demoRunning || demoCompleted) && (
            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {steps.map((step) => (
                  <div key={step.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    step.status === "completed" ? "bg-success/10 text-success" : step.status === "processing" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"
                  }`}>
                    {step.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : step.status === "processing" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Circle className="w-3 h-3" />}
                    <span>{step.label}</span>
                    {step.status === "completed" && step.completedAt && <span className="text-[10px] opacity-70">{timeAgo(step.completedAt)}</span>}
                  </div>
                ))}
              </div>

              {wellnessInsight && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border animate-fade-in">
                  <p className="text-xs font-medium text-foreground mb-1 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Last Wellness Insight</p>
                  <p className="text-xs text-muted-foreground">{wellnessInsight}</p>
                </div>
              )}

              {advisorFlagged && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border animate-fade-in">
                  <p className="text-xs font-medium text-foreground flex items-center gap-1.5"><Shield className="w-3 h-3" /> Student wellness advisor notified (confidential flag created).</p>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">No personal conversation data shared.</p>
                </div>
              )}

              {toolkitItems.length > 0 && (
                <div className="p-3 rounded-lg bg-success/5 border border-success/20 animate-fade-in">
                  <p className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-success" /> Toolkit Sent</p>
                  <div className="space-y-1">
                    {toolkitItems.map((item, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-success shrink-0" />{item}</p>
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
                    {resource.highPriority && <Badge variant="destructive" className="text-[10px]">High Priority</Badge>}
                    {resource.appointmentInfo && (
                      <Badge variant="secondary" className="text-[10px]"><Zap className="w-2.5 h-2.5 mr-0.5" /> Reserved by Atlas</Badge>
                    )}
                    {resource.recommended && (
                      <Badge variant="secondary" className="text-[10px]"><Star className="w-2.5 h-2.5 mr-0.5" /> Recommended</Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {resource.availability}
                    </div>
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{resource.title}</h3>
                {resource.recommended && <p className="text-xs font-medium text-foreground mb-1">Recommended: {resource.recommended}</p>}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{resource.description}</p>
                {resource.appointmentInfo && (
                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border mb-3 animate-fade-in">
                    <p className="text-xs font-medium text-foreground">Next Appointment</p>
                    <p className="text-sm font-semibold text-foreground">{resource.appointmentInfo.time}</p>
                    <p className="text-xs text-muted-foreground">Counselor: {resource.appointmentInfo.counselor}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant={resource.highPriority ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => runBookingFlow(resource.modalType)}
                  >
                    {resource.action} <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                  {resource.title === "Crisis Support" && (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => runBookingFlow("crisis-video")}>
                      <Video className="w-3.5 h-3.5" /> Video Call
                    </Button>
                  )}
                </div>
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
                        {isRecommended && <span className="pill-blue text-[10px]"><Star className="w-2.5 h-2.5 mr-0.5 inline" /> Suggested</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{event.date}</span><span>·</span><span>{event.time}</span><span>·</span><span>{event.location}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Wellness Pulse — Expanded with criteria */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-4 h-4" /> Wellness Pulse
              </CardTitle>
              <div className="text-right">
                <p className="text-2xl font-heading font-bold text-foreground">{compositeScore}%</p>
                <p className="text-[10px] text-muted-foreground">Composite Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Criteria breakdown */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Self-Reported Criteria</p>
              {wellnessCriteria.map((criterion) => (
                <div key={criterion.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{criterion.label}</p>
                      <p className="text-[10px] text-muted-foreground">{criterion.description}</p>
                    </div>
                    <span className="text-xs font-mono-accent text-muted-foreground">{criterion.score}/{criterion.max}</span>
                  </div>
                  <Progress value={criterion.score * 10} className="h-1.5" />
                </div>
              ))}
            </div>

            {/* Weekly trend */}
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Trend</p>
              {initialPulse.map((pulse, idx) => (
                <div key={pulse.week} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">{pulse.week}</span>
                    {pulseAlerts.has(idx) && <AlertCircle className="w-3.5 h-3.5 text-warning animate-fade-in" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm transition-colors duration-300 ${
                          i < pulse.score ? (pulseAlerts.has(idx) ? "bg-warning/40" : "bg-foreground/20") : "bg-secondary"
                        }`} />
                      ))}
                    </div>
                    <span className="text-xs font-mono-accent text-muted-foreground w-8 text-right">{pulse.score}/10</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground italic pt-1">
              All scores are self-reported. This is not a clinical assessment or diagnosis. If you need professional support, please reach out to Counseling Services.
            </p>

            {pulseInsight ? (
              <p className="text-xs text-warning flex items-center gap-1.5"><AlertCircle className="w-3 h-3" />{pulseInsight}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Atlas monitors trends and proactively reaches out if scores decline for 2+ consecutive weeks.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── BOOKING MODALS ─── */}

      {/* Counseling Booking */}
      <Dialog open={activeModal === "counseling"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Book Counseling Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Agent steps */}
            <div className="space-y-1.5">
              {bookingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
                  <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
              {bookingPhase === "scanning" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" /> <span>Working...</span>
                </div>
              )}
            </div>

            {(bookingPhase === "found" || bookingPhase === "confirming") && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Select a counselor:</p>
                {counselors.map((c, i) => (
                  <div
                    key={c.name}
                    onClick={() => setSelectedCounselor(i)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedCounselor === i ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">{c.nextSlot}</p>
                        <p className="text-[10px] text-muted-foreground">★ {c.rating}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full" onClick={() => confirmBooking("counseling")} disabled={bookingPhase === "confirming"}>
                  {bookingPhase === "confirming" ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Booking...</> : <>Approve & Book</>}
                </Button>
              </div>
            )}

            {bookingPhase === "booked" && (
              <div className="text-center space-y-3 py-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Appointment Confirmed</p>
                  <p className="text-xs text-muted-foreground">{counselors[selectedCounselor].name} · {counselors[selectedCounselor].nextSlot}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Crisis Call / Video */}
      <Dialog open={activeModal === "crisis-call" || activeModal === "crisis-video"} onOpenChange={(open) => { if (!open) { setCallActive(false); setActiveModal(null); } }}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              {activeModal === "crisis-video" ? <Video className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
              {activeModal === "crisis-video" ? "Video Call — Crisis Support" : "Call — Crisis Support"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!callActive ? (
              <>
                <div className="space-y-1.5">
                  {bookingSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
                      <CheckCircle2 className="w-3 h-3 text-success shrink-0" /> <span>{step}</span>
                    </div>
                  ))}
                  {bookingPhase === "scanning" && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Connecting...</div>
                  )}
                </div>
                {bookingPhase === "found" && (
                  <div className="text-center space-y-3 py-4">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Dr. Sarah Lin</p>
                      <p className="text-xs text-muted-foreground">On-call Crisis Counselor</p>
                    </div>
                    <Button className="w-full gap-2" onClick={startCall}>
                      {activeModal === "crisis-video" ? <Video className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
                      Start {activeModal === "crisis-video" ? "Video" : ""} Call
                    </Button>
                    <p className="text-[10px] text-muted-foreground">This is a confidential conversation.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4 py-6">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto animate-pulse">
                  {activeModal === "crisis-video" ? <Video className="w-10 h-10 text-success" /> : <PhoneCall className="w-10 h-10 text-success" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Connected with Dr. Sarah Lin</p>
                  <p className="text-lg font-mono-accent text-foreground mt-1">{formatCallTime(callTimer)}</p>
                </div>
                <p className="text-xs text-muted-foreground">A human is here with you now.</p>
                <Button variant="destructive" size="sm" className="gap-1.5" onClick={endCall}>
                  <X className="w-3.5 h-3.5" /> End Call
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Peer Group Booking */}
      <Dialog open={activeModal === "peer-group"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><Users className="w-4 h-4" /> Join a Peer Support Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              {bookingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
                  <CheckCircle2 className="w-3 h-3 text-success shrink-0" /> <span>{step}</span>
                </div>
              ))}
              {bookingPhase === "scanning" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Working...</div>
              )}
            </div>

            {(bookingPhase === "found" || bookingPhase === "confirming") && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Available groups:</p>
                {peerGroups.map((g, i) => (
                  <div
                    key={g.name}
                    onClick={() => setSelectedGroup(i)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedGroup === i ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}
                  >
                    <p className="text-sm font-medium text-foreground">{g.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{g.day} {g.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{g.location}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      <span>{g.spots} spots left</span><span>·</span><span>{g.facilitator}</span>
                    </div>
                  </div>
                ))}
                <Button className="w-full" onClick={() => confirmBooking("peer-group")} disabled={bookingPhase === "confirming"}>
                  {bookingPhase === "confirming" ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Joining...</> : <>Approve & Join</>}
                </Button>
              </div>
            )}

            {bookingPhase === "booked" && (
              <div className="text-center space-y-3 py-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto"><Check className="w-6 h-6 text-success" /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">You're In!</p>
                  <p className="text-xs text-muted-foreground">{peerGroups[selectedGroup].name} · {peerGroups[selectedGroup].day} {peerGroups[selectedGroup].time}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Workshop Registration */}
      <Dialog open={activeModal === "workshop"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><BookOpen className="w-4 h-4" /> Register for a Workshop</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              {bookingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
                  <CheckCircle2 className="w-3 h-3 text-success shrink-0" /> <span>{step}</span>
                </div>
              ))}
              {bookingPhase === "scanning" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Working...</div>
              )}
            </div>

            {(bookingPhase === "found" || bookingPhase === "confirming") && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Available workshops:</p>
                {workshops.map((w, i) => (
                  <div
                    key={w.name}
                    onClick={() => setSelectedWorkshop(i)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedWorkshop === i ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}
                  >
                    <p className="text-sm font-medium text-foreground">{w.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{w.date} · {w.time}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{w.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.location}</span>
                      <span>{w.capacity}</span>
                    </div>
                  </div>
                ))}
                <Button className="w-full" onClick={() => confirmBooking("workshop")} disabled={bookingPhase === "confirming"}>
                  {bookingPhase === "confirming" ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Registering...</> : <>Approve & Register</>}
                </Button>
              </div>
            )}

            {bookingPhase === "booked" && (
              <div className="text-center space-y-3 py-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto"><Check className="w-6 h-6 text-success" /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Registration Confirmed</p>
                  <p className="text-xs text-muted-foreground">{workshops[selectedWorkshop].name} · {workshops[selectedWorkshop].date}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wellness;