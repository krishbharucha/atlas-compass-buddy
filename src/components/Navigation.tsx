import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/chat", label: "Atlas Chat" },
  { to: "/plan", label: "My Plan" },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="font-heading font-bold text-xl text-primary">Atlas</span>
        </div>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={() => {
                const isActive = location.pathname === item.to;
                return `relative px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
                  )}
                </>
              )}
            </RouterNavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-accent" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-header flex items-center justify-center text-primary-foreground text-sm font-bold">
              J
            </div>
            <span className="hidden sm:block text-sm font-medium text-foreground">Jordan M.</span>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex items-center justify-center gap-1 pb-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isActive
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
