interface StatCardProps {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  subLabel: string;
  pill: { text: string; className: string };
  delay: number;
}

const StatCard = ({ icon, iconBg, label, value, subLabel, pill, delay }: StatCardProps) => (
  <div
    className="glass-card p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBg}`}>
        {icon}
      </div>
      <span className={pill.className}>{pill.text}</span>
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-bold font-heading text-foreground mt-0.5">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
    </div>
  </div>
);

export default StatCard;
