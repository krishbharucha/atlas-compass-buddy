import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Upload, ChevronRight, ExternalLink, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface TryDemoDrawerProps {
  open: boolean;
  onClose: () => void;
}

type Phase = "messages" | "actions" | "followup";

interface ChatMsg {
  role: "user" | "atlas" | "working";
  text: string;
  steps?: string[];
}

const conversation: ChatMsg[] = [
  { role: "user", text: "I don't understand why my grant went down $3,000." },
  { role: "atlas", text: "Let me pull your aid history and compare year-over-year." },
  { role: "working", text: "", steps: ["Pulling 2024-25 aid package", "Pulling 2025-26 aid package", "Comparing delta"] },
  { role: "atlas", text: "Found it. EFC increased $4,200 due to income change. Missing verification document flagged Feb 12. Provisionally reduced — completely fixable." },
];

const actionCards = [
  { id: "F1", status: "complete" as const, label: "Root Cause: EFC increase + missing IRS Tax Transcript" },
  { id: "F2", status: "pending" as const, label: "Verification form pre-filled — awaiting transcript upload" },
  { id: "F3", status: "progress" as const, label: "Appeal filed with urgency flag — ETA 5 business days" },
  { id: "F4", status: "complete" as const, label: "Enrollment protection placed — Spring registration safe" },
];

const TryDemoDrawer = ({ open, onClose }: TryDemoDrawerProps) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("messages");
  const [visibleMsgs, setVisibleMsgs] = useState(0);
  const [workingSteps, setWorkingSteps] = useState<number[]>([]);
  const [visibleActions, setVisibleActions] = useState(0);
  const [showFollowup, setShowFollowup] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!open) {
      setPhase("messages");
      setVisibleMsgs(0);
      setWorkingSteps([]);
      setVisibleActions(0);
      setShowFollowup(false);
      setApplied(false);
      return;
    }

    // Reveal messages sequentially
    let msgIdx = 0;
    const revealNext = () => {
      if (msgIdx >= conversation.length) {
        // Start actions phase
        setTimeout(() => {
          setPhase("actions");
          let actIdx = 0;
          const actIv = setInterval(() => {
            actIdx++;
            setVisibleActions(actIdx);
            if (actIdx >= actionCards.length) {
              clearInterval(actIv);
              setTimeout(() => {
                setPhase("followup");
                setShowFollowup(true);
              }, 600);
            }
          }, 100);
        }, 400);
        return;
      }

      const msg = conversation[msgIdx];
      msgIdx++;
      setVisibleMsgs(msgIdx);

      if (msg.role === "working" && msg.steps) {
        let si = 0;
        const siv = setInterval(() => {
          si++;
          setWorkingSteps(prev => [...prev, si - 1]);
          if (si >= msg.steps!.length) {
            clearInterval(siv);
            setTimeout(revealNext, 500);
          }
        }, 300);
      } else {
        setTimeout(revealNext, msg.role === "user" ? 800 : 1200);
      }
    };

    setTimeout(revealNext, 500);
  }, [open]);

  const handleApply = () => {
    setApplied(true);
    toast({
      title: "Emergency grant applications prepared",
      description: "$1,500 available — View in Atlas Chat →",
    });
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <SheetTitle className="font-heading">Atlas Chat — Award Letter Confusion</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Messages */}
          {conversation.slice(0, visibleMsgs).map((msg, i) => {
            if (msg.role === "user") {
              return (
                <div key={i} className="flex justify-end animate-fade-in">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              );
            }
            if (msg.role === "working") {
              return (
                <div key={i} className="space-y-2 animate-fade-in pl-2">
                  {msg.steps?.map((s, si) => (
                    <div key={si} className={`flex items-center gap-2 transition-all duration-300 ${workingSteps.includes(si) ? "opacity-100" : "opacity-0"}`}>
                      {workingSteps.includes(si) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin shrink-0" />
                      )}
                      <span className="text-xs text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div key={i} className="flex justify-start animate-fade-in">
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm text-foreground">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {/* Action cards */}
          {phase !== "messages" && (
            <div className="space-y-2">
              {actionCards.slice(0, visibleActions).map((ac) => (
                <div key={ac.id} className="glass-card p-3 flex items-center gap-3 animate-fade-in">
                  <span className="text-xs font-mono-accent text-muted-foreground">#{ac.id}</span>
                  {ac.status === "complete" && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  {ac.status === "progress" && <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />}
                  {ac.status === "pending" && <Upload className="w-4 h-4 text-warning shrink-0" />}
                  <span className="text-xs text-foreground flex-1">{ac.label}</span>
                  {ac.status === "pending" && (
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Upload Transcript
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Follow-up */}
          {showFollowup && (
            <div className="animate-fade-in space-y-3">
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5">
                <p className="text-sm text-foreground">
                  You also qualify for $1,500 emergency bridge funding. Prepare applications?
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="sm" onClick={handleApply} disabled={applied} className="gap-1">
                  {applied ? "Applications Prepared" : "Yes, prepare applications"} <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => { onClose(); navigate("/chat?flow=award-letter"); }}>
                  Show me first
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border">
          <button
            onClick={() => { onClose(); navigate("/chat?flow=award-letter"); }}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Continue in Atlas Chat <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TryDemoDrawer;
