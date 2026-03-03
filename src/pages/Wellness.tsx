import { Heart, Phone, Calendar, Users, BookOpen, MessageSquare, Clock, ChevronRight, ExternalLink, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Counseling Services",
    description: "Schedule one-on-one sessions with licensed therapists. Confidential and free for all enrolled students.",
    icon: MessageSquare,
    availability: "Mon–Fri, 8AM–6PM",
    action: "Book Appointment",
  },
  {
    title: "Crisis Support",
    description: "24/7 crisis hotline and immediate support. Trained counselors available around the clock.",
    icon: Phone,
    availability: "24/7",
    action: "Call Now",
    urgent: true,
  },
  {
    title: "Peer Support Groups",
    description: "Join student-led support circles for anxiety, stress management, identity, and more.",
    icon: Users,
    availability: "Weekly sessions",
    action: "View Schedule",
  },
  {
    title: "Wellness Workshops",
    description: "Mindfulness, time management, sleep hygiene, and resilience-building workshops.",
    icon: BookOpen,
    availability: "Bi-weekly",
    action: "Browse Workshops",
  },
];

const upcomingEvents = [
  { title: "Stress Management Workshop", date: "Mar 8, 2026", time: "2:00 PM", location: "Wellness Center 204" },
  { title: "Meditation Circle", date: "Mar 10, 2026", time: "12:00 PM", location: "Student Union 101" },
  { title: "Sleep Hygiene Seminar", date: "Mar 14, 2026", time: "4:00 PM", location: "Health Sciences 310" },
  { title: "Peer Support: Anxiety", date: "Mar 15, 2026", time: "3:00 PM", location: "Wellness Center 102" },
];

const selfCareTools = [
  { title: "Mood Tracker", description: "Log daily moods and identify patterns over time." },
  { title: "Guided Meditation", description: "5–20 minute guided sessions for focus and calm." },
  { title: "Sleep Journal", description: "Track sleep patterns and get personalized tips." },
  { title: "Breathing Exercises", description: "Quick breathing techniques for stress relief." },
];

const Wellness = () => (
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

      {/* Self-Care Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Self-Care Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {selfCareTools.map((tool) => (
              <div key={tool.title} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
                <div>
                  <p className="text-sm font-medium text-foreground">{tool.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Wellness;
