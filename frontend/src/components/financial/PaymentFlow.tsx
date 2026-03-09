import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Mail, Smartphone, Bell, CheckCircle2, ChevronRight, Shield, Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useTypewriter } from "./useTypewriter";
import FlowPanel from "./FlowPanel";

interface PaymentFlowProps {
  open: boolean;
  onClose: () => void;
}

type Step = "review" | "confirming" | "done";

const reminders = [
  { date: "Apr 8", channels: [Mail], message: "Friendly reminder — $1,125 due Apr 15. Payment portal link attached." },
  { date: "Apr 13", channels: [Mail, Smartphone, Bell], message: "Urgent — due in 2 days, $75 late fee after Apr 15. Pay now to avoid charges." },
  { date: "Apr 14", channels: [Mail, Smartphone, Bell], message: "Final notice — enrollment protection armed. Payment required by midnight." },
];

const PaymentFlow = ({ open, onClose }: PaymentFlowProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("review");
  const [autoProtect, setAutoProtect] = useState(true);
  const [confirmed, setConfirmed] = useState<number[]>([]);
  const tw = useTypewriter(
    "I've scheduled a 3-reminder sequence for your $1,125 payment. Review before I send anything.",
    60,
    open
  );
  const tw2 = useTypewriter(
    "All 3 reminders scheduled. Want to set up autopay so this never happens again?",
    60,
    false
  );

  useEffect(() => {
    if (!open) {
      setStep("review");
      setConfirmed([]);
    }
  }, [open]);

  const handleConfirm = () => {
    setStep("confirming");
    reminders.forEach((_, i) => {
      setTimeout(() => {
        setConfirmed(prev => [...prev, i]);
        if (i === reminders.length - 1) {
          setTimeout(() => {
            setStep("done");
            tw2.start();
            toast({
              title: "Payment reminder schedule confirmed",
              description: "3 reminders scheduled: Apr 8, 13, 14. Enrollment protection armed.",
            });
          }, 500);
        }
      }, 400 * (i + 1));
    });
  };

  if (step === "done") {
    return (
      <FlowPanel open={open} borderColor="border-success">
        <div className="space-y-4">
          <p className="text-sm text-foreground">{tw2.displayed}<span className="animate-pulse">|</span></p>
          {tw2.done && (
            <div className="flex gap-3 animate-fade-in">
              <Button size="sm" onClick={() => navigate("/chat?flow=autopay")} className="gap-1">
                Set Up Autopay <ChevronRight className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>No thanks</Button>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>Reminders scheduled Apr 8/13/14</span>
            <span className="mx-1">|</span>
            <Shield className="w-3.5 h-3.5 text-success" />
            <span>Protection armed</span>
            <span className="mx-1">|</span>
            <button onClick={() => navigate("/chat?flow=payment-reminder")} className="text-primary hover:underline flex items-center gap-0.5">
              View in Atlas Chat <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </FlowPanel>
    );
  }

  return (
    <FlowPanel open={open} borderColor="border-warning">
      <div className="space-y-5">
        {/* Typewriter intro */}
        <p className="text-sm text-foreground">
          {tw.displayed}
          {!tw.done && <span className="animate-pulse">|</span>}
        </p>

        {/* Timeline */}
        {tw.done && (
          <div className="space-y-0 animate-fade-in">
            {reminders.map((r, i) => (
              <div key={i} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${confirmed.includes(i) ? "border-success bg-success/10" : "border-border bg-card"}`}>
                    {confirmed.includes(i) ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : step === "confirming" && !confirmed.includes(i) ? (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  {i < reminders.length - 1 && <div className="w-px h-8 bg-border" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{r.date}</span>
                    <div className="flex gap-1">
                      {r.channels.map((Ch, ci) => <Ch key={ci} className="w-3 h-3 text-muted-foreground" />)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.message}</p>
                  <button className="text-xs text-primary hover:underline mt-0.5 flex items-center gap-0.5">
                    Preview <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insight + toggle */}
        {tw.done && step === "review" && (
          <div className="animate-fade-in space-y-4">
            <div className="glass-card p-3 border-l-2 border-primary">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  If unpaid by Apr 15, I'll auto-place enrollment protection.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Auto-protect enrollment if unpaid</span>
              <Switch checked={autoProtect} onCheckedChange={setAutoProtect} />
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" size="sm" onClick={handleConfirm}>
                Confirm & Send Schedule
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/chat?flow=edit-reminders")}>
                Edit Reminder Dates
              </Button>
            </div>
          </div>
        )}
      </div>
    </FlowPanel>
  );
};

export default PaymentFlow;
