import { useState } from "react";
import { Bell, DollarSign, CheckCircle2, GraduationCap, FileText, ChevronDown, ChevronRight, Zap, Shield, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useTypewriter } from "./useTypewriter";
import AlertConfigDrawer from "./AlertConfigDrawer";

interface Alert {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  pill: { text: string; className: string };
  pulseColor: string;
  expandable?: boolean;
  calm?: boolean;
}

const alerts: Alert[] = [
  { id: "payment", icon: Bell, title: "Payment Due Reminder", description: "3 reminders queued: Apr 8, 13, 14. Enrollment protection armed.", pill: { text: "Next: Apr 8", className: "pill-danger" }, pulseColor: "bg-destructive" },
  { id: "disbursement", icon: DollarSign, title: "Aid Disbursement Monitor", description: "Monitoring since Mar 31. No denial flag detected.", pill: { text: "Monitoring", className: "pill-blue" }, pulseColor: "bg-primary" },
  { id: "receipt", icon: CheckCircle2, title: "Payment Confirmation Receipt", description: "Will auto-fire when payment posts — no action needed.", pill: { text: "Standby", className: "pill-neutral" }, pulseColor: "bg-muted-foreground", calm: true },
  { id: "gpa", icon: GraduationCap, title: "Scholarship GPA Watch", description: "Merit Scholarship requires 3.50 GPA. Currently 3.41.", pill: { text: "At Risk", className: "pill-warning" }, pulseColor: "bg-warning", expandable: true },
  { id: "charge", icon: FileText, title: "New Charge Notification", description: "Any off-cycle charge triggers instant push notification.", pill: { text: "Active", className: "pill-success" }, pulseColor: "bg-success", calm: true },
];

const AlertsSection = () => {
  const navigate = useNavigate();
  const [allOn, setAllOn] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [configAlert, setConfigAlert] = useState<string>("");

  return (
    <>
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-foreground" />
            <h2 className="font-heading text-lg font-semibold text-foreground">Atlas Automated Alerts</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">All alerts on</span>
            <Switch checked={allOn} onCheckedChange={setAllOn} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Atlas monitors your account 24/7 and acts before problems escalate.</p>

        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const Icon = alert.icon;
            const isExpanded = expanded === alert.id;
            return (
              <div
                key={alert.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className={`glass-card p-4 transition-all duration-300 cursor-pointer hover:border-primary/20 ${isExpanded ? "border-primary/30" : ""}`}
                  onClick={() => {
                    if (alert.expandable) setExpanded(isExpanded ? null : alert.id);
                    else if (alert.calm) { setConfigAlert(alert.id); setConfigOpen(true); }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                          <Icon className="w-4 h-4 text-foreground" />
                        </div>
                        {!alert.calm && (
                          <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${alert.pulseColor} animate-pulse`} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={alert.pill.className}>{alert.pill.text}</span>
                      {alert.expandable && (isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />)}
                      {alert.calm && <Settings className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {/* GPA Watch expanded */}
                {alert.id === "gpa" && isExpanded && <GPAExpanded navigate={navigate} />}
              </div>
            );
          })}
        </div>

      </div>

      <AlertConfigDrawer open={configOpen} onClose={() => setConfigOpen(false)} alertId={configAlert} />
    </>
  );
};

function GPAExpanded({ navigate }: { navigate: (path: string) => void }) {
  const tw = useTypewriter(
    "You're 0.09 points from losing your $7,500 Merit Scholarship. Enable real-time grade monitoring to catch risk before semester ends.",
    60
  );
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="mt-2 glass-card p-4 border-l-2 border-warning animate-fade-in space-y-4">
      {/* GPA bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-foreground font-medium">Current GPA: 3.41</span>
          <span className="text-muted-foreground">Required: 3.50</span>
        </div>
        <div className="relative">
          <Progress value={97.4} className="h-3" />
          <div className="absolute top-0 right-[2.6%] w-px h-3 bg-warning" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">0.09 gap to threshold</p>
      </div>

      {/* Typewriter */}
      <p className="text-sm text-foreground">
        {tw.displayed}{!tw.done && <span className="animate-pulse">|</span>}
      </p>

      {tw.done && (
        <div className="flex gap-3 animate-fade-in">
          <Button
            size="sm"
            onClick={() => {
              setEnabled(true);
              toast({ title: "Grade monitoring enabled", description: "Atlas will alert you if your GPA drops below 3.45." });
            }}
            disabled={enabled}
          >
            {enabled ? "Monitoring Enabled" : "Enable Grade Monitoring"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/chat?flow=gpa-advisor")}
          >
            Talk to Academic Advisor
          </Button>
        </div>
      )}
    </div>
  );
}

export default AlertsSection;
