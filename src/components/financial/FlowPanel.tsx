import { ReactNode } from "react";

interface FlowPanelProps {
  open: boolean;
  borderColor?: string;
  children: ReactNode;
}

const FlowPanel = ({ open, borderColor = "border-primary", children }: FlowPanelProps) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className={`glass-card p-6 border-t-2 ${borderColor} mt-2 animate-fade-in`}>
        {children}
      </div>
    </div>
  );
};

export default FlowPanel;
