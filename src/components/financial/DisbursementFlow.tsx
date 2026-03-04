import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Mail, ChevronRight, ExternalLink, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useTypewriter, useStaggeredReveal } from "./useTypewriter";
import FlowPanel from "./FlowPanel";

interface DisbursementFlowProps {
  open: boolean;
  onClose: () => void;
}

type Step = "working" | "draft" | "sending" | "done";

const investigationSteps = [
  "Pulled disbursement schedule — expected Mar 28",
  "Status: Processing delay — no denial flag",
  "Cause: High-volume manual review backlog",
];

const DisbursementFlow = ({ open, onClose }: DisbursementFlowProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("working");
  const stagger = useStaggeredReveal(investigationSteps, 300);
  const tw = useTypewriter(
    "Delayed, not denied. Expected posting: Apr 4. I can send an inquiry to expedite.",
    60,
    false
  );

  useEffect(() => {
    if (open) {
      setStep("working");
      stagger.start();
    }
  }, [open]);

  useEffect(() => {
    if (stagger.allDone) tw.start();
  }, [stagger.allDone]);

  useEffect(() => {
    if (tw.done && step === "working") setStep("draft");
  }, [tw.done]);

  const handleSend = () => {
    setStep("sending");
    setTimeout(() => {
      setStep("done");
      toast({
        title: "Disbursement inquiry sent",
        description: "Ref #INQ-2026-0847 — Atlas will monitor for replies.",
      });
    }, 1500);
  };

  return (
    <FlowPanel open={open} borderColor="border-primary">
      <div className="space-y-4">
        {/* Investigation steps */}
        <div className="space-y-2">
          {investigationSteps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 transition-all duration-300 ${stagger.revealed.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              {stagger.revealed.includes(i) ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />
              )}
              <span className="text-sm text-foreground">{s}</span>
            </div>
          ))}
        </div>

        {/* Typewriter analysis */}
        {stagger.allDone && (
          <p className="text-sm text-foreground animate-fade-in">
            {tw.displayed}{!tw.done && <span className="animate-pulse">|</span>}
          </p>
        )}

        {/* Draft email */}
        {step === "draft" && (
          <div className="animate-fade-in glass-card p-4 border-l-2 border-primary space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span>To: financial.aid@university.edu</span>
              <span className="mx-1">|</span>
              <span>Subject: Disbursement Inquiry — Jordan M.</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dear Financial Aid, writing on behalf of Jordan M. (ID: 20241847) regarding Merit Scholarship expected Mar 28 not yet posted. Please provide updated timeline.
            </p>
            <div className="flex gap-3 pt-2">
              <Button size="sm" onClick={handleSend} className="gap-1">
                Send Inquiry <ChevronRight className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/chat?flow=disbursement")}>
                Edit in Atlas Chat
              </Button>
            </div>
          </div>
        )}

        {/* Sending state */}
        {step === "sending" && (
          <div className="animate-fade-in">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-[loading_1.5s_ease-in-out]" style={{ width: "100%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Sending inquiry...
            </p>
          </div>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Sent — Ref #INQ-2026-0847
            </div>
            <p className="text-sm text-foreground">I'll monitor for a reply. Want daily status texts?</p>
            <div className="flex gap-3">
              <Button size="sm" className="gap-1">Yes, text me updates</Button>
              <Button variant="outline" size="sm">Notify me in Atlas</Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
              <Search className="w-3.5 h-3.5 text-primary" />
              <span>Inquiry sent #INQ-2026-0847</span>
              <span className="mx-1">|</span>
              <span>Monitoring active</span>
              <span className="mx-1">|</span>
              <button onClick={() => navigate("/chat?flow=disbursement")} className="text-primary hover:underline flex items-center gap-0.5">
                View in Atlas Chat <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </FlowPanel>
  );
};

export default DisbursementFlow;
