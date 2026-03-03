import { useState } from "react";
import { ChevronDown, ChevronRight, Zap } from "lucide-react";

interface PlanSection {
  emoji: string;
  name: string;
  summary: string;
  summaryClass: string;
  items: { text: string; status: string; statusClass: string }[];
}

const sections: PlanSection[] = [
  {
    emoji: "💰", name: "Financial Aid", summary: "1 action in progress", summaryClass: "pill-warning",
    items: [
      { text: "Appeal filed and routed to Financial Aid office", status: "In Progress", statusClass: "pill-warning" },
      { text: "Hold prevention flag active on your account", status: "Complete", statusClass: "pill-success" },
    ],
  },
  {
    emoji: "🧠", name: "Mental Health & Wellbeing", summary: "All clear", summaryClass: "pill-success",
    items: [
      { text: "Counseling appointment: Thursday 10:00am", status: "Confirmed", statusClass: "pill-blue" },
      { text: "Wellness toolkit sent to your phone", status: "Delivered", statusClass: "pill-success" },
    ],
  },
  {
    emoji: "📚", name: "Academic Support", summary: "Awaiting your confirmation", summaryClass: "pill-purple",
    items: [
      { text: "Tutoring schedule: Mon/Wed/Fri 4pm — MATH 208", status: "Needs Confirmation", statusClass: "pill-purple" },
      { text: "Emergency advising booked: Wed 2pm", status: "Confirmed", statusClass: "pill-blue" },
      { text: "Withdrawal impact analysis complete — stay recommended", status: "Complete", statusClass: "pill-success" },
    ],
  },
  {
    emoji: "💼", name: "Career & Internships", summary: "2 items ready for review", summaryClass: "pill-warning",
    items: [
      { text: "Amazon SDE application pre-filled", status: "Ready to Review", statusClass: "pill-warning" },
      { text: "Microsoft PM application pre-filled", status: "Ready to Review", statusClass: "pill-warning" },
    ],
  },
  {
    emoji: "🏛️", name: "Campus & Admin", summary: "1 item in progress", summaryClass: "pill-warning",
    items: [
      { text: "Library fine hold resolution sent to Registrar", status: "In Progress", statusClass: "pill-warning" },
    ],
  },
];

const MyPlan = () => {
  const [openIndex, setOpenIndex] = useState(2); // Academic expanded by default

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-heading font-bold text-foreground">My Atlas Plan</h1>
        <p className="text-muted-foreground mt-2">Everything Atlas is tracking and working on for you</p>
      </div>

      <div className="mt-8 space-y-3">
        {sections.map((section, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={section.name}
              className="glass-card overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{section.emoji}</span>
                  <span className="font-heading font-semibold text-foreground">{section.name}</span>
                  <span className={section.summaryClass}>{section.summary}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <p className="text-sm text-foreground">{item.text}</p>
                      <span className={`${item.statusClass} shrink-0 ml-3`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom banner */}
      <div className="mt-8 bg-yellow-light rounded-2xl p-5 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
        <Zap className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm text-foreground">
          Atlas checks your systems every morning and will alert you if anything needs attention.
        </p>
      </div>

      <div className="text-center mt-8">
        <p className="text-[11px] text-muted-foreground">Powered by Salesforce Agentforce</p>
      </div>
    </div>
  );
};

export default MyPlan;
