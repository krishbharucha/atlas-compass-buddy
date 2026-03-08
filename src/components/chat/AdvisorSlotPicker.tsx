import { useState } from "react";
import { CalendarClock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slot {
  slotId: number;
  advisorName: string;
  department: string;
  office: string;
  datetime: string;
  displayTime: string;
}

interface AdvisorSlotPickerProps {
  department: string;
  slots: Slot[];
  onBook?: (slotId: number) => void;
}

export const AdvisorSlotPicker = ({ department, slots, onBook }: AdvisorSlotPickerProps) => {
  const [booking, setBooking] = useState<number | null>(null);
  const [booked, setBooked] = useState<number | null>(null);

  const handleBook = (slotId: number) => {
    setBooking(slotId);
    onBook?.(slotId);
    setTimeout(() => {
      setBooking(null);
      setBooked(slotId);
    }, 1200);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 my-2 animate-fade-in-up w-full max-w-md">
      <div className="flex items-center gap-1.5 mb-3">
        <CalendarClock className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Advisor Availability — {department}
        </span>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No slots available for {department}.
        </p>
      ) : (
        <div className="space-y-2">
          {slots.map((s) => {
            const isBooked = booked === s.slotId;
            const isBooking = booking === s.slotId;

            return (
              <div
                key={s.slotId}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                  isBooked
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-border hover:border-primary/30 hover:bg-muted/40"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <User className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{s.advisorName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarClock className="w-2.5 h-2.5" />
                      {s.displayTime}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {s.office}
                    </span>
                  </div>
                </div>

                <Button
                  variant={isBooked ? "outline" : "default"}
                  size="sm"
                  className="h-7 text-[10px] px-3 ml-2 shrink-0"
                  disabled={isBooking || isBooked}
                  onClick={() => handleBook(s.slotId)}
                >
                  {isBooked ? "✓ Booked" : isBooking ? "Booking…" : "Book"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
