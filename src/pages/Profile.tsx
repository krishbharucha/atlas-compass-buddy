import { GraduationCap, Mail, MapPin } from "lucide-react";

const Profile = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
    <div className="glass-card overflow-hidden animate-fade-in-up">
      <div className="gradient-header px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-xl font-bold">
            JM
          </div>
          <div className="text-primary-foreground">
            <h1 className="text-xl font-heading font-bold">Jordan M.</h1>
            <p className="text-sm opacity-80">Computer Science · Junior</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-secondary rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-heading text-foreground">3.41</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">GPA</p>
          </div>
          <div className="bg-secondary rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-heading text-foreground">87</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">Credits</p>
          </div>
          <div className="bg-secondary rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-heading text-foreground">W8</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">Week</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4" /> Fall Quarter 2026
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" /> jordan.m@university.edu
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" /> Student ID: 20241847
          </div>
        </div>
      </div>
    </div>

    <div className="text-center mt-6">
      <p className="text-[10px] text-muted-foreground">Powered by Salesforce Agentforce</p>
    </div>
  </div>
);

export default Profile;
