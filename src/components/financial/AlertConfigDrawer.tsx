import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AlertConfigDrawerProps {
  open: boolean;
  onClose: () => void;
  alertId: string;
}

const AlertConfigDrawer = ({ open, onClose, alertId }: AlertConfigDrawerProps) => {
  const [channels, setChannels] = useState({ email: true, sms: true, push: true, slack: false });
  const [timing, setTiming] = useState({ d14: true, d7: true, d1: true, d0: true, after1: false });
  const [action, setAction] = useState("auto-protect");

  const handleSave = () => {
    toast({ title: "Alert settings saved", description: "Changes apply immediately. Atlas will confirm via email." });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[420px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle className="font-heading">Configure Alert</SheetTitle>
          <SheetDescription>Customize notification channels and behavior.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Channels */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Notify via</p>
            <div className="space-y-3">
              {Object.entries(channels).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="capitalize text-sm">{key}</Label>
                  <Switch checked={val} onCheckedChange={(v) => setChannels(prev => ({ ...prev, [key]: v }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Reminder timing</p>
            <div className="space-y-2">
              {[
                { key: "d14", label: "14 days before" },
                { key: "d7", label: "7 days before" },
                { key: "d1", label: "1 day before" },
                { key: "d0", label: "Day of" },
                { key: "after1", label: "1 day after" },
              ].map((t) => (
                <div key={t.key} className="flex items-center gap-2">
                  <Checkbox
                    checked={timing[t.key as keyof typeof timing]}
                    onCheckedChange={(v) => setTiming(prev => ({ ...prev, [t.key]: !!v }))}
                  />
                  <Label className="text-sm text-muted-foreground">{t.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">If unpaid, Atlas should:</p>
            <div className="space-y-2">
              {[
                { value: "auto-protect", label: "Auto-place enrollment protection" },
                { value: "alert", label: "Alert me and wait" },
                { value: "nothing", label: "Do nothing" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="action"
                    checked={action === opt.value}
                    onChange={() => setAction(opt.value)}
                    className="accent-primary"
                  />
                  <span className={`text-sm ${action === opt.value ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleSave}>Save Alert Settings</Button>
          <p className="text-xs text-muted-foreground text-center">Changes apply immediately. Atlas will confirm via email.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlertConfigDrawer;
