import { useState, useRef, useEffect } from "react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, GraduationCap, LayoutDashboard, MessageSquare, User, BookOpen, DollarSign, Briefcase, Heart, ClipboardList, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/academic", label: "Academic", icon: BookOpen },
  { to: "/financial", label: "Financial", icon: DollarSign },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/wellness", label: "Wellness", icon: Heart },
  { to: "/chat", label: "Atlas Chat", icon: MessageSquare },
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-md gradient-header flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">Atlas</span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-mono-accent ml-1 bg-secondary px-2 py-0.5 rounded">Student Portal</span>
          </button>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="relative hidden sm:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 ml-2 pl-3 border-l border-border hover:bg-secondary/50 rounded-r-lg pr-2 py-1 transition-colors"
              >
                <div className="w-7 h-7 rounded-md gradient-header flex items-center justify-center text-primary-foreground text-xs font-semibold">
                  JM
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground leading-none">Jordan M.</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">CS · Junior</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in z-50">
                  {/* Profile info */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md gradient-header flex items-center justify-center text-primary-foreground text-sm font-bold">
                        JM
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Jordan M.</p>
                        <p className="text-xs text-muted-foreground">Computer Science · Junior</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-secondary rounded p-1.5 text-center">
                        <p className="text-sm font-bold font-heading text-foreground">3.41</p>
                        <p className="text-[9px] text-muted-foreground uppercase">GPA</p>
                      </div>
                      <div className="bg-secondary rounded p-1.5 text-center">
                        <p className="text-sm font-bold font-heading text-foreground">87</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Credits</p>
                      </div>
                      <div className="bg-secondary rounded p-1.5 text-center">
                        <p className="text-sm font-bold font-heading text-foreground">W8</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Week</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Profile & Settings
                    </button>
                    <button
                      onClick={() => { navigate("/plan"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
                      My Atlas Plan
                    </button>
                  </div>

                  <div className="border-t border-border px-4 py-2">
                    <p className="text-[10px] text-muted-foreground">jordan.m@university.edu · ID: 20241847</p>
                  </div>
                </div>
              )}
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
