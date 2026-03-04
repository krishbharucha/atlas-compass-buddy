import { useState } from "react";
import { FileText, Shield, Building, ChevronRight, ArrowLeft, Check, Search, Clock, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

type FlowState = "landing" | "hold-overview" | "hold-cause" | "hold-escalate" | "hold-done" | "service-query" | "service-results" | "service-booked";

const Administration = () => {
  const [flow, setFlow] = useState<FlowState>("landing");
  const [serviceQuery, setServiceQuery] = useState("");
  const [autoEscalate, setAutoEscalate] = useState(false);
  const { toast } = useToast();

  const BackButton = ({ to }: { to: FlowState }) => (
    <button onClick={() => setFlow(to)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );

  // ── Landing ──
  if (flow === "landing") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Campus Navigation</h1>
          <p className="text-sm text-muted-foreground">Skip the runaround. Get things resolved.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:border-primary/30 transition-colors group" onClick={() => setFlow("hold-overview")}>
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-foreground transition-colors" />
              <h3 className="font-heading font-semibold text-foreground mb-1">Account Holds & Registration</h3>
              <p className="text-sm text-muted-foreground mb-4">Stuck on a hold? We'll find the real blocker.</p>
              <Button size="sm" className="gap-1">Resolve a hold <ChevronRight className="w-3.5 h-3.5" /></Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/30 transition-colors group" onClick={() => setFlow("service-query")}>
            <CardContent className="p-6">
              <Building className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-foreground transition-colors" />
              <h3 className="font-heading font-semibold text-foreground mb-1">Campus Services</h3>
              <p className="text-sm text-muted-foreground mb-4">Need something on campus right now?</p>
              <Button size="sm" variant="outline" className="gap-1">Find a service <ChevronRight className="w-3.5 h-3.5" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Flow 3: Hold Resolution ──
  if (flow === "hold-overview") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="landing" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Hold Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Hold Type</p>
                <p className="font-medium text-foreground">Registrar Hold</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Duration</p>
                <p className="font-medium text-foreground">3 weeks</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Impact</p>
                <span className="pill-danger text-[11px]">Blocks registration</span>
              </div>
            </div>
            <Button onClick={() => setFlow("hold-cause")} className="w-full">Fix this</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (flow === "hold-cause") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="hold-overview" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-6">Root Cause Breakdown</h2>
        <Accordion type="multiple" defaultValue={["doc", "office", "history"]} className="space-y-2">
          <AccordionItem value="doc" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /> Missing document: Residency verification</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              The Registrar requires a residency verification form (Form RV-22) to clear this hold. You can upload a copy of your utility bill or lease as proof.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="office" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2"><Building className="w-4 h-4 text-muted-foreground" /> Responsible office: Registrar</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Office of the Registrar, Schmitz Hall Room 225. Hours: Mon–Fri 9am–4pm.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="history" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> Contacted 3 times (no response)</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>Feb 10 — Email sent to registrar@uw.edu</li>
                <li>Feb 17 — Follow-up email sent</li>
                <li>Feb 24 — Called main office (no answer)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button onClick={() => setFlow("hold-escalate")} className="w-full mt-6">Route directly to office</Button>
      </div>
    );
  }

  if (flow === "hold-escalate") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="hold-cause" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Escalation Awareness</h3>
            <p className="text-sm text-muted-foreground">
              Registration deadline is in <span className="text-foreground font-medium">6 days</span>. Want Atlas to escalate if no response?
            </p>
            <div className="flex items-start gap-2 pt-2">
              <Checkbox id="escalate" checked={autoEscalate} onCheckedChange={(v) => setAutoEscalate(v === true)} />
              <label htmlFor="escalate" className="text-sm text-foreground cursor-pointer">
                Auto-escalate to Dean of Students if unresolved
              </label>
            </div>
            <Button onClick={() => {
              toast({ title: "🎉 Request routed directly to Registrar", description: "Escalation scheduled if needed." });
              setFlow("hold-done");
            }} className="w-full">
              Send resolution request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (flow === "hold-done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">Request Sent</h3>
              <p className="text-sm text-muted-foreground">Routed directly to Registrar. Escalation armed.</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Request sent", status: "done" },
                { label: "Awaiting response", status: "pending" },
                { label: "Registration protected", status: "locked" },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${step.status === "done" ? "bg-success" : step.status === "pending" ? "bg-warning" : "bg-muted-foreground"}`} />
                  <span className="text-sm text-foreground">{step.label}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => { setFlow("landing"); setAutoEscalate(false); }} className="w-full">
              Back to Campus Navigation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Flow 4: Campus Service Finder ──
  if (flow === "service-query") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="landing" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">What do you need on campus?</h2>
        <p className="text-sm text-muted-foreground mb-6">Atlas will find the closest, fastest option.</p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            placeholder="e.g. Notary, printing, ID replacement…"
            className="w-full bg-secondary rounded-md pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <Button disabled={!serviceQuery.trim()} onClick={() => setFlow("service-results")} className="w-full">
          Find options
        </Button>
      </div>
    );
  }

  if (flow === "service-results") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <BackButton to="service-query" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-6">Results for "{serviceQuery}"</h2>
        <div className="space-y-4">
          {[
            { name: "HUB Notary Office", hours: "Open today: 1–4pm", free: true, distance: "5 min walk" },
            { name: "Student Legal Services", hours: "Open today: 10am–3pm", free: true, distance: "8 min walk" },
          ].map((svc) => (
            <Card key={svc.name} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{svc.name}</h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{svc.hours}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{svc.distance}</div>
                      {svc.free && <span className="pill-success text-[10px]">Free for students</span>}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => {
                    toast({ title: "🎉 Appointment booked", description: `${svc.name} — today at 2:30pm` });
                    setFlow("service-booked");
                  }}>
                    Book appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (flow === "service-booked") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-foreground">Appointment Booked</h3>
            <p className="text-sm text-muted-foreground">HUB Notary Office — today at 2:30pm</p>
            <Button variant="outline" onClick={() => { setFlow("landing"); setServiceQuery(""); }} className="w-full">
              Back to Campus Navigation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Administration;
