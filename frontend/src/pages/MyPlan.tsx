import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Zap, DollarSign, Heart, BookOpen, Briefcase, Landmark, CheckCircle2, Clock, Loader2 } from "lucide-react";

interface PlanSection {
  icon: ReactNode;
  name: string;
  summary: string;
  summaryClass: string;
  items: { text: string; status: string; statusClass: string; statusIcon: ReactNode }[];
}

const sections: PlanSection[] = [
  {
    icon: <DollarSign className="w-4 h-4 text-accent" />, name: "Financial Aid", summary: "1 action in progress", summaryClass: "pill-warning",
    items: [
      { text: "Appeal filed and routed to Financial Aid office", status: "In Progress", statusClass: "pill-warning", statusIcon: <Loader2 className="w-3 h-3 animate-spin" /> },
      { text: "Hold prevention flag active on your account", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
    ],
  },
  {
    icon: <Heart className="w-4 h-4 text-primary" />, name: "Mental Health & Wellbeing", summary: "All clear", summaryClass: "pill-success",
    items: [
      { text: "Counseling appointment: Thursday 10:00am", status: "Confirmed", statusClass: "pill-blue", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
      { text: "Wellness toolkit sent to your phone", status: "Delivered", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
    ],
  },
  {
    icon: <BookOpen className="w-4 h-4 text-purple-medium" />, name: "Academic Support", summary: "Awaiting confirmation", summaryClass: "pill-purple",
    items: [
      { text: "Tutoring schedule: Mon/Wed/Fri 4pm — MATH 208", status: "Needs Confirmation", statusClass: "pill-purple", statusIcon: <Clock className="w-3 h-3" /> },
      { text: "Emergency advising booked: Wed 2pm", status: "Confirmed", statusClass: "pill-blue", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
      { text: "Withdrawal impact analysis complete — stay recommended", status: "Complete", statusClass: "pill-success", statusIcon: <CheckCircle2 className="w-3 h-3" /> },
    ],
  },
  {
    icon: <Briefcase className="w-4 h-4 text-accent" />, name: "Career & Internships", summary: "2 items ready", summaryClass: "pill-warning",
    items: [
      { text: "Amazon SDE application pre-filled", status: "Ready to Review", statusClass: "pill-warning", statusIcon: <Clock className="w-3 h-3" /> },
      { text: "Microsoft PM application pre-filled", status: "Ready to Review", statusClass: "pill-warning", statusIcon: <Clock className="w-3 h-3" /> },
    ],
  },
  {
    icon: <Landmark className="w-4 h-4 text-muted-foreground" />, name: "Campus & Admin", summary: "1 in progress", summaryClass: "pill-warning",
    items: [
      { text: "Library fine hold resolution sent to Registrar", status: "In Progress", statusClass: "pill-warning", statusIcon: <Loader2 className="w-3 h-3 animate-spin" /> },
    ],
  },
];

const MyPlan = () => {
  const [openIndex, setOpenIndex] = useState(2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-heading font-bold text-foreground">My Atlas Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">Everything Atlas is tracking and working on for you</p>
      </div>

      <div className="space-y-2">
        {sections.map((section, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={section.name}
              className="glass-card overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {section.icon}
                  <span className="text-sm font-semibold text-foreground">{section.name}</span>
                  <span className={`${section.summaryClass} text-[10px]`}>{section.summary}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between px-4 py-3">
                      <p className="text-sm text-foreground">{item.text}</p>
                      <span className={`${item.statusClass} shrink-0 ml-3 text-[10px] flex items-center gap-1`}>
                        {item.statusIcon}
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 glass-card p-4 flex items-center gap-3 animate-fade-in-up bg-yellow-light" style={{ animationDelay: "400ms" }}>
        <Zap className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-foreground">
          Atlas checks your systems every morning and will alert you if anything needs attention.
        </p>
      </div>

      <div className="text-center mt-6">
        <p className="text-[10px] text-muted-foreground">Powered by Salesforce Agentforce</p>
      </div>
    </div>
  );
};

export default MyPlan;
