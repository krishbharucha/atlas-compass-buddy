import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AtlasChat from "./pages/AtlasChat";
import MyPlan from "./pages/MyPlan";
import Profile from "./pages/Profile";
import Academic from "./pages/Academic";
import Financial from "./pages/Financial";
import Jobs from "./pages/Jobs";
import Wellness from "./pages/Wellness";
import Administration from "./pages/Administration";
import NotFound from "./pages/NotFound";
import AtlasDrawer from "./components/AtlasDrawer";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const noNavRoutes = ["/", "/login"];
  const showNav = !noNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {showNav && <Navigation />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<AtlasChat />} />
        <Route path="/plan" element={<MyPlan />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/financial" element={<Financial />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/admin" element={<Administration />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && <AtlasDrawer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
