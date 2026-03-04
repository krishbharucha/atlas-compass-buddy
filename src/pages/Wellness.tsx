import { Heart, Phone, Calendar, Users, BookOpen, MessageSquare, Clock, ChevronRight, ExternalLink, Shield, Zap, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const resources = [
  { title: "Counseling Services", description: "Schedule one-on-one sessions with licensed therapists. Confidential and free for all enrolled students.", icon: MessageSquare, availability: "Mon–Fri, 8AM–6PM", action: "Book Appointment" },
  { title: "Crisis Support", description: "24/7 crisis hotline and immediate support. Trained counselors available around the clock.", icon: Phone, availability: "24/7", action: "Call Now", urgent: true },
  { title: "Peer Support Groups", description: "Join student-led support circles for anxiety, stress management, identity, and more.", icon: Users, availability: "Weekly sessions", action: "View Schedule" },
  { title: "Wellness Workshops", description: "Mindfulness, time management, sleep hygiene, and resilience-building workshops.", icon: BookOpen, availability: "Bi-weekly", action: "Browse Workshops" },
];

const upcomingEvents = [
  { title: "Stress Management Workshop", date: "Mar 8, 2026", time: "2:00 PM", location: "Wellness Center 204" },
  { title: "Meditation Circle", date: "Mar 10, 2026", time: "12:00 PM", location: "Student Union 101" },
  { title: "Sleep Hygiene Seminar", date: "Mar 14, 2026", time: "4:00 PM", location: "Health Sciences 310" },
  { title: "Peer Support: Anxiety", date: "Mar 15, 2026", time: "3:00 PM", location: "Wellness Center 102" },
];

const atlasCapabilities = [
  {
    trigger: "Proactive wellness monitoring",
    example: "Weekly pulse checks + trend tracking",
    actions: ["Sends weekly wellness pulse checks & tracks scores over time", "Surfaces patterns before they become crises", "Alerts advisor with confidential welfare flag after 2+ weeks of decline", "Personalizes resources based on specific stress patterns"],
  },
  {
    trigger: "Acute distress detection",
    example: "\"I haven't slept in 4 days and I have 3 finals\"",
    actions: ["Triages urgency with 3 warm follow-up questions", "Routes to appropriate care level (self-guided → peer → counselor → crisis)", "Books same-day counselor slot with pre-filled intake form", "Sends personalized \"tonight's toolkit\" via SMS"],
  },
  {
    trigger: "Crisis intervention",
    example: "Student expresses hopelessness during any conversation",
    actions: ["Immediately and warmly pivots conversation tone", "Pages on-call crisis counselor for direct callback", "Sends 24/7 crisis support number to student's phone", "Stays active until student confirms human connection"],
    isCrisis: true,
  },
];

const Wellness = () => {
  const navigate = useNavigate();

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
          <Button variant="outline" size="sm">Get Help Now</Button>
        </CardContent>
      </Card>

      {/* Atlas AI — Wellness */}
      <Card className="mb-8 border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-foreground" />
            <CardTitle className="text-lg">Atlas AI — Mental Health Support</CardTitle>
          </div>
          <Button size="sm" onClick={() => navigate("/chat")} className="gap-1">
            Try Demo <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Atlas operates in two modes — proactive monitoring with weekly wellness checks, and reactive detection that identifies distress signals mid-conversation about any topic and pivots immediately to support.
          </p>
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
            <Card key={resource.title} className="hover:border-foreground/10 transition-colors cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {resource.availability}
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{resource.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{resource.description}</p>
                <Button variant="outline" size="sm" className="gap-1">
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
              {upcomingEvents.map((event) => (
                <div key={event.title} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
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
              ))}
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
              {[
                { week: "Week 8", score: 6, trend: "stable" },
                { week: "Week 7", score: 5, trend: "down" },
                { week: "Week 6", score: 7, trend: "up" },
                { week: "Week 5", score: 7, trend: "stable" },
              ].map((pulse) => (
                <div key={pulse.week} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{pulse.week}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-sm ${i < pulse.score ? "bg-foreground/20" : "bg-secondary"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono-accent text-muted-foreground w-8 text-right">{pulse.score}/10</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                Atlas monitors trends and proactively reaches out if scores decline for 2+ consecutive weeks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wellness;
