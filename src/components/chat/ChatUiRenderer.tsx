import {
  DegreeProgressRing,
  CourseResultsTable,
  FinancialSummaryCard,
  AdvisorSlotPicker,
} from "@/components/chat";

export interface UiTrigger {
  component: string;
  data: Record<string, any>;
}

interface ChatUiRendererProps {
  triggers: UiTrigger[];
  onAction?: (action: string, payload: any) => void;
}

/**
 * Renders rich UI widgets from the backend's ui_triggers array.
 * Falls back to null for unknown component types.
 */
export const ChatUiRenderer = ({ triggers, onAction }: ChatUiRendererProps) => {
  if (!triggers || triggers.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {triggers.map((t, idx) => {
        switch (t.component) {
          case "DegreeProgressRing":
            return <DegreeProgressRing key={idx} {...t.data} />;

          case "CourseResultsTable":
            return (
              <CourseResultsTable
                key={idx}
                {...t.data}
                onEnroll={(code: string) =>
                  onAction?.("enroll", { courseCode: code })
                }
              />
            );

          case "FinancialSummaryCard":
            return <FinancialSummaryCard key={idx} {...t.data} />;

          case "AdvisorSlotPicker":
            return (
              <AdvisorSlotPicker
                key={idx}
                {...t.data}
                onBook={(slotId: number) =>
                  onAction?.("book_slot", { slotId })
                }
              />
            );

          default:
            console.warn(`Unknown ui_trigger component: ${t.component}`);
            return null;
        }
      })}
    </div>
  );
};
