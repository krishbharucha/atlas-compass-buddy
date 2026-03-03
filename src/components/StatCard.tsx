import { type ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  subLabel: string;
  pill: { text: string; className: string };
  delay: number;
}

const StatCard = ({ icon, iconBg, label, value, subLabel, pill, delay }: StatCardProps) => (
  <div
    className="glass-card p-4 hover:border-primary/20 transition-all duration-200 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <span className={pill.className}>{pill.text}</span>
    </div>
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold font-heading text-foreground mt-1 leading-none">{value}</p>
    <p className="text-xs text-muted-foreground mt-2">{subLabel}</p>
  </div>
);

export default StatCard;
