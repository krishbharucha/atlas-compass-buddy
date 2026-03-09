import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseRow {
  code: string;
  title: string;
  credits: number;
  schedule: string;
  location?: string;
  seatsAvailable: number;
  isFull: boolean;
}

interface CourseResultsTableProps {
  query: string;
  courses: CourseRow[];
  onEnroll?: (courseCode: string) => void;
}

export const CourseResultsTable = ({ query, courses, onEnroll }: CourseResultsTableProps) => {
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const handleEnroll = (code: string) => {
    setEnrolling(code);
    onEnroll?.(code);
    setTimeout(() => setEnrolling(null), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 my-2 animate-fade-in-up w-full overflow-x-auto">
      <div className="flex items-center gap-1.5 mb-3">
        <BookOpen className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Course Results — "{query}"
        </span>
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No courses found.</p>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-3 font-medium">Course</th>
              <th className="text-left py-2 pr-3 font-medium">Title</th>
              <th className="text-center py-2 pr-3 font-medium">Cr</th>
              <th className="text-left py-2 pr-3 font-medium">Schedule</th>
              <th className="text-center py-2 pr-3 font-medium">Seats</th>
              <th className="text-right py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.code} className="border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors">
                <td className="py-2 pr-3 font-mono font-semibold text-foreground whitespace-nowrap">{c.code}</td>
                <td className="py-2 pr-3 text-foreground">{c.title}</td>
                <td className="py-2 pr-3 text-center text-muted-foreground">{c.credits}</td>
                <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">{c.schedule}</td>
                <td className="py-2 pr-3 text-center">
                  <span className={c.isFull ? "text-red-500 font-semibold" : c.seatsAvailable <= 5 ? "text-yellow-500 font-semibold" : "text-green-500"}>
                    {c.isFull ? "Full" : c.seatsAvailable}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <Button
                    variant={c.isFull ? "outline" : "default"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    disabled={c.isFull || enrolling === c.code}
                    onClick={() => handleEnroll(c.code)}
                  >
                    {enrolling === c.code ? "Enrolling…" : c.isFull ? "Wait-list" : "Enroll"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
