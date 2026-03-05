import { useState, useEffect, useCallback } from "react";
import {
  Phone, Calendar, Users, BookOpen, MessageSquare, Clock,
  ChevronRight, Shield, Zap, CheckCircle2,
  Loader2, Star, Video, ExternalLink,
  PhoneCall, X, Check, MapPin, User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type BookingModal = null | "counseling" | "crisis-call" | "crisis-video" | "peer-group" | "workshop";
type BookingPhase = "scanning" | "found" | "confirming" | "booked";

const atlasHelpCards = [
  {
    trigger: "Feeling overwhelmed?",
    example: "\"I'm stressed about exams and can't sleep\"",
    actions: ["Connect you with the right counselor or support group", "Help find workshops that fit your schedule", "Book appointments automatically"],
  },
  {
    trigger: "Need someone to talk to?",
    example: "\"I feel alone and don't know where to start\"",
    actions: ["Find peer support groups on campus", "Schedule a counseling session", "Connect you with student mentors"],
  },
  {
    trigger: "Crisis or urgent help",
    example: "Available 24/7 for immediate support",
    actions: ["Connect directly with on-call crisis counselor", "Provide 24/7 crisis hotline numbers", "Stay with you until human support arrives"],
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

const upcomingEvents = [
  { title: "Stress Management Workshop", date: "Mar 8, 2026", time: "2:00 PM", location: "Wellness Center 204" },
  { title: "Meditation Circle", date: "Mar 10, 2026", time: "12:00 PM", location: "Student Union 101" },
  { title: "Sleep Hygiene Seminar", date: "Mar 14, 2026", time: "4:00 PM", location: "Health Sciences 310" },
  { title: "Peer Support: Anxiety", date: "Mar 15, 2026", time: "3:00 PM", location: "Wellness Center 102" },
];

const Wellness = () => {
  const navigate = useNavigate();

  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [recommendedGroup, setRecommendedGroup] = useState<string | null>(null);
  const [recommendedWorkshop, setRecommendedWorkshop] = useState<string | null>(null);

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
    if (!callActive) return;
    const interval = setInterval(() => setCallTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  const formatCallTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

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
      addStep("Matching based on your needs");
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

  const startCall = () => { setCallActive(true); setCallTimer(0); };
  const endCall = () => {
    setCallActive(false);
    setActiveModal(null);
    toast({ title: "Call ended", description: "Thank you for reaching out. Follow-up resources have been sent." });
  };

  const resources = [
    {
      title: "Counseling Services",
      description: appointmentBooked
        ? "Your next appointment has been reserved."
        : "Schedule one-on-one sessions with licensed therapists. Confidential and free for all enrolled students.",
      icon: MessageSquare,
      availability: "Mon–Fri, 8AM–6PM",
      action: appointmentBooked ? "View Appointment" : "Book Appointment",
      appointmentInfo: appointmentBooked ? { time: "Tomorrow — 3:00 PM", counselor: "Dr. Maya Chen" } : undefined,
      modalType: "counseling" as BookingModal,
    },
    {
      title: "Crisis Support",
      description: "24/7 crisis hotline and immediate support. Trained counselors available around the clock.",
      icon: Phone,
      availability: "24/7",
      action: "Call Now",
      urgent: true,
      modalType: "crisis-call" as BookingModal,
    },
    {
      title: "Peer Support Groups",
      description: recommendedGroup
        ? `You've joined ${recommendedGroup}.`
        : "Join student-led support circles for anxiety, stress management, identity, and more.",
      icon: Users,
      availability: "Weekly sessions",
      action: recommendedGroup ? "View Details" : "Join a Group",
      recommended: recommendedGroup,
      modalType: "peer-group" as BookingModal,
    },
    {
      title: "Wellness Workshops",
      description: recommendedWorkshop
        ? `Registered for ${recommendedWorkshop}.`
        : "Mindfulness, time management, sleep hygiene, and resilience-building workshops.",
      icon: BookOpen,
      availability: "Bi-weekly",
      action: recommendedWorkshop ? "View Details" : "Register",
      recommended: recommendedWorkshop,
      modalType: "workshop" as BookingModal,
    },
  ];

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
      <Card className="mb-8 border-destructive/20 bg-destructive/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">In crisis? Reach out now.</p>
              <p className="text-xs text-muted-foreground">988 Suicide & Crisis Lifeline · Campus Emergency: (555) 123-4567</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => runBookingFlow("crisis-call")}>
            Get Help Now
          </Button>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card
              key={resource.title}
              className={`hover:border-foreground/10 transition-all duration-300 cursor-pointer group ${resource.recommended ? "border-primary/20" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    {resource.appointmentInfo && (
                      <Badge variant="secondary" className="text-[10px]"><Zap className="w-2.5 h-2.5 mr-0.5" /> Reserved</Badge>
                    )}
                    {resource.recommended && (
                      <Badge variant="secondary" className="text-[10px]"><Star className="w-2.5 h-2.5 mr-0.5" /> Joined</Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {resource.availability}
                    </div>
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{resource.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{resource.description}</p>
                {resource.appointmentInfo && (
                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border mb-3">
                    <p className="text-xs font-medium text-foreground">Next Appointment</p>
                    <p className="text-sm font-semibold text-foreground">{resource.appointmentInfo.time}</p>
                    <p className="text-xs text-muted-foreground">Counselor: {resource.appointmentInfo.counselor}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant={resource.urgent ? "default" : "outline"}
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

      {/* Upcoming Events */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
          <Button variant="outline" size="sm">View Calendar</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-all duration-300 cursor-pointer group">
                <div>
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>{event.date}</span><span>·</span><span>{event.time}</span><span>·</span><span>{event.location}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atlas Help — bottom card like Financial */}
      <Card className="border-primary/10 bg-secondary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Need Help With Your Wellbeing?</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate("/chat")} className="gap-1 text-xs">
              Open Atlas Chat <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Atlas can help you find the right support, book appointments, and connect you with campus resources — just ask.</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid sm:grid-cols-3 gap-3">
            {atlasHelpCards.map((cap) => (
              <div
                key={cap.trigger}
                className={`border rounded-lg p-3 hover:bg-secondary/50 transition-colors cursor-pointer ${cap.isCrisis ? "border-destructive/20" : "border-border"}`}
                onClick={() => navigate("/chat")}
              >
                <p className="text-sm font-medium text-foreground mb-1">{cap.trigger}</p>
                <p className="text-xs text-muted-foreground italic mb-2">{cap.example}</p>
                <p className="text-[11px] text-muted-foreground">{cap.actions[0]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ─── BOOKING MODALS ─── */}

      {/* Counseling Booking */}
      <Dialog open={activeModal === "counseling"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Book Counseling Appointment</DialogTitle>
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
                <p className="text-xs font-medium text-foreground">Select a counselor:</p>
                {counselors.map((c, i) => (
                  <div key={c.name} onClick={() => setSelectedCounselor(i)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedCounselor === i ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
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
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto"><Check className="w-6 h-6 text-success" /></div>
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
                      Start {activeModal === "crisis-video" ? "Video " : ""}Call
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
                  <div key={g.name} onClick={() => setSelectedGroup(i)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedGroup === i ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
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
                  <div key={w.name} onClick={() => setSelectedWorkshop(i)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedWorkshop === i ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
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