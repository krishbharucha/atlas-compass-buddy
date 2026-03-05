import { useState, useRef, useEffect } from "react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, GraduationCap, LayoutDashboard, MessageSquare, User, BookOpen, DollarSign, Briefcase, Heart, ClipboardList, ChevronDown, X, Check, Clock, AlertTriangle, Calendar, FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/academic", label: "Academic", icon: BookOpen },
  { to: "/financial", label: "Financial", icon: DollarSign },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/wellness", label: "Wellness", icon: Heart },
  { to: "/chat", label: "Atlas Chat", icon: MessageSquare },
];

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  type: "urgent" | "info" | "success";
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
    title: "Microsoft PM — deadline in 2 days",
    description: "Application deadline is Friday. Resume draft ready for review.",
    time: "1h ago",
    read: false,
    link: "/jobs",
    type: "urgent",
  },
  {
    id: "2",
    icon: <Calendar className="w-3.5 h-3.5 text-primary" />,
    title: "Counseling appointment tomorrow",
    description: "Dr. Maya Chen · 3:00 PM · Wellness Center",
    time: "3h ago",
    read: false,
    link: "/wellness",
    type: "info",
  },
  {
    id: "3",
    icon: <FileText className="w-3.5 h-3.5 text-foreground" />,
    title: "Financial aid document verified",
    description: "Residency verification has been processed.",
    time: "1d ago",
    read: false,
    link: "/financial",
    type: "success",
  },
  {
    id: "4",
    icon: <BookOpen className="w-3.5 h-3.5 text-destructive" />,
    title: "MATH 208 — at risk alert",
    description: "Current grade is below passing. Tutoring recommended.",
    time: "2d ago",
    read: true,
    link: "/academic",
    type: "urgent",
  },
  {
    id: "5",
    icon: <Heart className="w-3.5 h-3.5 text-primary" />,
    title: "Peer Support Group — spot confirmed",
    description: "Anxiety Support Circle · Tuesdays 5:00 PM",
    time: "2d ago",
    read: true,
    link: "/wellness",
    type: "info",
  },
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotifClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      setNotifOpen(false);
    }
  };

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

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-primary hover:underline font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto divide-y divide-border">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer group ${
                            !notif.read ? "bg-primary/[0.03]" : ""
                          }`}
                          onClick={() => handleNotifClick(notif)}
                        >
                          <div className="mt-0.5 shrink-0">{notif.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm leading-snug ${!notif.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                                {notif.title}
                              </p>
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.description}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {notif.time}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-secondary rounded shrink-0 mt-0.5"
                          >
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-border px-4 py-2">
                    <button
                      onClick={() => { navigate("/dashboard"); setNotifOpen(false); }}
                      className="text-xs text-primary hover:underline font-medium w-full text-center"
                    >
                      View all activity
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
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