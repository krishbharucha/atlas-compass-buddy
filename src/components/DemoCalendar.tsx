import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CalendarEvent {
    date: string; // YYYY-MM-DD
    title: string;
    color: string; // tailwind color class e.g. "bg-foreground"
    type: string;  // "interview" | "wellness" | "deadline" etc.
}

interface DemoCalendarProps {
    events: CalendarEvent[];
    onDateClick?: (date: string, dayEvents: CalendarEvent[]) => void;
    className?: string;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DemoCalendar({ events, onDateClick, className = "" }: DemoCalendarProps) {
    // Default to March 2026 (the demo timeline)
    const [month, setMonth] = useState(2); // 0-indexed
    const [year, setYear] = useState(2026);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const todayDate = today.getDate();

    const prev = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const next = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const getEventsForDay = (day: number): CalendarEvent[] => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return events.filter(e => e.date === dateStr);
    };

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={prev}>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold text-foreground font-heading">
                    {MONTH_NAMES[month]} {year}
                </span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={next}>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map(d => (
                    <div key={d} className="text-center text-[10px] font-mono-accent text-muted-foreground uppercase tracking-wider py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px">
                {days.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} className="h-10" />;
                    const dayEvents = getEventsForDay(day);
                    const isToday = isCurrentMonth && day === todayDate;
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    return (
                        <button
                            key={day}
                            className={`h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors text-sm
                ${isToday ? "bg-foreground text-background font-bold" : "text-foreground hover:bg-secondary"}
                ${dayEvents.length > 0 && !isToday ? "font-medium" : ""}
              `}
                            onClick={() => onDateClick?.(dateStr, dayEvents)}
                        >
                            <span className="text-xs">{day}</span>
                            {dayEvents.length > 0 && (
                                <div className="flex gap-0.5">
                                    {dayEvents.slice(0, 3).map((ev, j) => (
                                        <span key={j} className={`w-1 h-1 rounded-full ${isToday ? "bg-background" : ev.color}`} />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend — show events for the month */}
            {events.filter(e => e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length > 0 && (
                <div className="mt-4 border-t border-border pt-3 space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono-accent mb-2">This Month</p>
                    {events
                        .filter(e => e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((ev, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <span className={`w-2 h-2 rounded-full ${ev.color} shrink-0`} />
                                <span className="text-muted-foreground font-mono-accent w-12">
                                    {new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                                <span className="text-foreground truncate">{ev.title}</span>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
