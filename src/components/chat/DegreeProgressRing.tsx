import { useMemo } from "react";

interface DegreeProgressRingProps {
  completed: number;
  total: number;
  gpa: number;
  remaining: number;
  studentName?: string;
  major?: string;
  gradNote?: string;
}

export const DegreeProgressRing = ({
  completed,
  total,
  gpa,
  remaining,
  studentName,
  major,
  gradNote,
}: DegreeProgressRingProps) => {
  const percentage = useMemo(() => Math.round((completed / total) * 100), [completed, total]);

  // SVG ring parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // GPA color
  const gpaColor = gpa >= 3.5 ? "text-green-500" : gpa >= 3.0 ? "text-blue-500" : gpa >= 2.0 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="bg-card border border-border rounded-xl p-4 my-2 animate-fade-in-up w-full max-w-md">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Degree Audit
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-secondary"
            />
            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{percentage}%</span>
            <span className="text-[10px] text-muted-foreground">complete</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-2">
          {studentName && (
            <p className="text-xs text-muted-foreground">
              {studentName} · {major || "Undeclared"}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-lg font-bold text-foreground">{completed}</p>
              <p className="text-[10px] text-muted-foreground">Credits done</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{remaining}</p>
              <p className="text-[10px] text-muted-foreground">Remaining</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${gpaColor}`}>{gpa.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground">GPA</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{total}</p>
              <p className="text-[10px] text-muted-foreground">Total req'd</p>
            </div>
          </div>
          {gradNote && (
            <p className="text-xs text-muted-foreground pt-1 border-t border-border">{gradNote}</p>
          )}
        </div>
      </div>
    </div>
  );
};
