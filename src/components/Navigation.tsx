import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Bell, GraduationCap, LayoutDashboard, MessageSquare, ClipboardList, User, BookOpen, DollarSign, Briefcase, Heart, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/academic", label: "Academic", icon: BookOpen },
  { to: "/financial", label: "Financial", icon: DollarSign },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/wellness", label: "Wellness", icon: Heart },
  { to: "/admin", label: "Admin", icon: Settings },
  { to: "/chat", label: "Atlas Chat", icon: MessageSquare },
  { to: "/plan", label: "My Plan", icon: ClipboardList },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md gradient-header flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">Atlas</span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-mono-accent ml-1 bg-secondary px-2 py-0.5 rounded">Student Portal</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-border">
              <div className="w-7 h-7 rounded-md gradient-header flex items-center justify-center text-primary-foreground text-xs font-semibold">
                JM
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground leading-none">Jordan M.</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">CS · Junior</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-0.5 -mb-px overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </RouterNavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
