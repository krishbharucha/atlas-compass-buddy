import { DollarSign, ArrowDown, ArrowUp, Calendar } from "lucide-react";

interface Award {
  name: string;
  amount: number;
  status: string;
}

interface FinancialSummaryCardProps {
  awards: Award[];
  totalAwarded: number;
  tuitionDue: number;
  balance: number;
  disbursementDate?: string;
}

const statusColor = (s: string) => {
  switch (s.toLowerCase()) {
    case "disbursed": return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    case "accepted": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const FinancialSummaryCard = ({
  awards,
  totalAwarded,
  tuitionDue,
  balance,
  disbursementDate,
}: FinancialSummaryCardProps) => {
  const isOwed = balance > 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 my-2 animate-fade-in-up w-full max-w-md">
      <div className="flex items-center gap-1.5 mb-3">
        <DollarSign className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Financial Summary
        </span>
      </div>

      {/* Award rows */}
      <div className="space-y-2 mb-4">
        {awards.map((a, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ArrowDown className="w-3 h-3 text-green-500 shrink-0" />
              <span className="text-foreground">{a.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-foreground">{fmt(a.amount)}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor(a.status)}`}>
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-border pt-3 space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Awarded</span>
          <span className="font-mono font-bold text-green-500">{fmt(totalAwarded)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tuition Due</span>
          <span className="font-mono font-bold text-foreground">{fmt(tuitionDue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Balance</span>
          <div className="flex items-center gap-1">
            {isOwed ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-green-500" />}
            <span className={`font-mono font-bold ${isOwed ? "text-red-500" : "text-green-500"}`}>
              {fmt(Math.abs(balance))}
            </span>
          </div>
        </div>
      </div>

      {/* Disbursement date */}
      {disbursementDate && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border pt-2">
          <Calendar className="w-3 h-3" />
          <span>Next disbursement: {disbursementDate}</span>
        </div>
      )}
    </div>
  );
};
