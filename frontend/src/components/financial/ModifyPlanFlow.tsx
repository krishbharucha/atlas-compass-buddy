import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Zap, CheckCircle2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useTypewriter } from "./useTypewriter";

type Step = "options" | "calculating" | "confirm" | "done";

const options = [
  { id: "extend", icon: Calendar, title: "Extend Timeline", desc: "6 months, lower payments" },
  { id: "reduce", icon: CreditCard, title: "Reduce Next Payment", desc: "Smaller next, larger later" },
  { id: "autopay", icon: Zap, title: "Switch to Autopay", desc: "0.5% discount applied" },
];

const calculations: Record<string, string> = {
  extend: "Extend Timeline: $750/month × 10 months. No interest. Next due: May 15.",
  reduce: "Reduce Next Payment: $562 next month, then $1,344/month × 5. No interest. Next due: Apr 15.",
  autopay: "Autopay enabled: $1,125/month with 0.5% discount ($5.63 off). Next auto-debit: Apr 15.",
};

const ModifyPlanFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const tw = useTypewriter(selected ? calculations[selected] : "", 60, false);

  const handleSelect = (id: string) => {
    setSelected(id);
    setStep("calculating");
    // Start typewriter after brief delay
    setTimeout(() => {
      tw.start();
      setStep("confirm");
    }, 200);
  };

  const handleApply = () => {
    setStep("done");
    toast({
      title: "Payment plan modified",
      description: "New schedule sent to email. View confirmation in Atlas Chat →",
    });
  };

  if (step === null) {
    return (
      <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setStep("options")}>
        Modify Plan
      </Button>
    );
  }

  return (
    <div className="mt-3 space-y-3 animate-fade-in">
      {/* Step 1: Options */}
      {step === "options" && (
        <div className="grid grid-cols-3 gap-2">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className="glass-card p-3 text-left hover:border-primary/30 transition-all duration-200"
              >
                <Icon className="w-4 h-4 text-foreground mb-1.5" />
                <p className="text-xs font-medium text-foreground">{opt.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Calculation */}
      {(step === "calculating" || step === "confirm") && selected && (
        <div className="glass-card p-3 border-l-2 border-primary animate-fade-in">
          <p className="text-sm text-foreground">
            {tw.displayed}{!tw.done && <span className="animate-pulse">|</span>}
          </p>
          {tw.done && (
            <div className="flex gap-2 mt-3 animate-fade-in">
              <Button size="sm" onClick={handleApply}>Apply This Plan</Button>
              <button
                onClick={() => navigate("/chat?flow=payment-plan")}
                className="text-xs text-primary hover:underline flex items-center gap-0.5"
              >
                Discuss Options in Atlas Chat <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Done */}
      {step === "done" && (
        <div className="flex items-center gap-2 text-sm text-foreground animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-success" />
          Plan updated. New schedule sent to email.
        </div>
      )}
    </div>
  );
};

export default ModifyPlanFlow;
