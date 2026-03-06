import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Mail, MapPin, Phone, Globe, Calendar, Clock, Shield,
  BookOpen, Briefcase, Heart, DollarSign, TrendingUp, Award, Star,
  CheckCircle2, ChevronRight, ExternalLink, Bell, Eye, Lock, Zap,
  FileText, Users, Target, BarChart3, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ─── Student Data ─── */
const studentProfile = {
  name: "Jordan M.",
  fullName: "Jordan Mitchell",
  initials: "JM",
  major: "Computer Science",
  minor: "Data Science",
  year: "Junior",
  expectedGrad: "May 2027",
  enrollmentStatus: "Full-time",
  quarter: "Fall 2026",
  week: "Week 8",
  studentId: "20241847",
  email: "jordan.m@university.edu",
  phone: "(206) 555-0147",
  address: "1247 University Way NE, Seattle, WA 98105",
  advisor: "Dr. Sarah Patel",
  advisorEmail: "s.patel@university.edu",
};

const academicSnapshot = {
  gpa: "3.41",
  creditsCompleted: 87,
  creditsRequired: 120,
  creditsInProgress: 16,
  deansList: "Fall 2025",
  standing: "Good Standing",
  currentCourses: [
    { code: "CS 301", name: "Algorithms", grade: "B+", credits: 4 },
    { code: "MATH 208", name: "Linear Algebra", grade: "C-", credits: 4 },
    { code: "INFO 340", name: "Client-Side Development", grade: "A-", credits: 4 },
    { code: "PHYS 201", name: "Mechanics", grade: "B", credits: 4 },
  ],
};

const financialSnapshot = {
  balance: "$3,200",
  aidPackage: "$26,500",
  scholarships: "$7,500",
  paymentPlan: "Monthly installments",
  nextPayment: { amount: "$1,600", date: "Mar 15, 2026" },
  fafsa: "Verified",
};

const wellnessSnapshot = {
  compositeScore: 60,
  sleep: "Low",
  stress: "Elevated",
  lastCheckIn: "3 days ago",
  upcomingAppointment: "Dr. Maya Chen — Tomorrow 3:00 PM",
  emergencyContact: "Sarah Mitchell (Mother) — (206) 555-0200",
};

const careerSnapshot = {
  activeApplications: 4,
  interviews: 1,
  savedJobs: 8,
  resumeStatus: "Updated 2 days ago",
  nextDeadline: "Microsoft PM — Friday",
};

const atlasActivity = [
  { action: "Financial aid appeal filed", time: "2 hours ago", pillar: "Financial", icon: DollarSign, agentforce: "Service Cloud" },
  { action: "Counseling appointment booked", time: "1 day ago", pillar: "Wellness", icon: Heart, agentforce: "MuleSoft" },
  { action: "MATH 208 tutoring scheduled", time: "1 day ago", pillar: "Academic", icon: BookOpen, agentforce: "Flow Orchestration" },
  { action: "PM resume draft generated", time: "2 days ago", pillar: "Career", icon: Briefcase, agentforce: "Einstein AI" },
  { action: "Library hold detected & resolved", time: "3 days ago", pillar: "Admin", icon: Shield, agentforce: "Data Cloud" },
  { action: "Emergency grant eligibility matched", time: "3 days ago", pillar: "Financial", icon: DollarSign, agentforce: "Einstein AI" },
  { action: "Sleep trend alert sent to advisor", time: "4 days ago", pillar: "Wellness", icon: Heart, agentforce: "CRM Analytics" },
  { action: "Google interview prep kit created", time: "5 days ago", pillar: "Career", icon: Briefcase, agentforce: "Knowledge Base" },
];

const achievements = [
  { title: "Dean's List", term: "Fall 2025", icon: Award },
  { title: "5 Actions Completed", term: "This Week", icon: CheckCircle2 },
  { title: "Career Plan Started", term: "Week 7", icon: Target },
  { title: "Wellness Check-in Streak", term: "3 weeks", icon: Heart },
];

const notificationPreferences = [
  { label: "Deadline reminders", enabled: true, description: "Get notified 48h before deadlines" },
  { label: "Financial aid updates", enabled: true, description: "Award changes, disbursement alerts" },
  { label: "Wellness check-ins", enabled: true, description: "Weekly pulse score prompts" },
  { label: "Career opportunities", enabled: true, description: "New job matches and events" },
  { label: "Atlas activity digest", enabled: false, description: "Daily summary of Atlas actions" },
];

/* ─── Component ─── */
const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "academic" | "activity" | "settings">("overview");

  const progressPercent = Math.round((academicSnapshot.creditsCompleted / academicSnapshot.creditsRequired) * 100);

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "academic" as const, label: "Academic" },
    { key: "activity" as const, label: "Atlas Activity" },
    { key: "settings" as const, label: "Settings" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">

      {/* ─── Profile Header ─── */}
      <div className="glass-card overflow-hidden animate-fade-in-up mb-6">
        <div className="gradient-header px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-2xl font-bold font-heading border-2 border-primary-foreground/10">
              {studentProfile.initials}
            </div>
            <div className="text-primary-foreground flex-1">
              <h1 className="text-2xl font-heading font-bold">{studentProfile.fullName}</h1>
              <p className="text-sm opacity-80 mt-0.5">{studentProfile.major} · {studentProfile.minor} Minor · {studentProfile.year}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs bg-primary-foreground/10 px-2.5 py-1 rounded-full">
                  <GraduationCap className="w-3 h-3" /> {studentProfile.quarter}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs bg-primary-foreground/10 px-2.5 py-1 rounded-full">
                  <Calendar className="w-3 h-3" /> Grad: {studentProfile.expectedGrad}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs bg-primary-foreground/10 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> {studentProfile.week}
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-right text-primary-foreground">
                <p className="text-3xl font-bold font-heading">{academicSnapshot.gpa}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-60">Cumulative GPA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-border border-b border-border">
          {[
            { value: academicSnapshot.gpa, label: "GPA", icon: TrendingUp },
            { value: `${academicSnapshot.creditsCompleted}/${academicSnapshot.creditsRequired}`, label: "Credits", icon: BookOpen },
            { value: careerSnapshot.activeApplications.toString(), label: "Applications", icon: Briefcase },
            { value: `${wellnessSnapshot.compositeScore}%`, label: "Wellness", icon: Heart },
            { value: financialSnapshot.balance, label: "Balance", icon: DollarSign },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3 text-muted-foreground" />
                  <p className="text-lg font-bold font-heading text-foreground">{stat.value}</p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono-accent">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.key
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB: Overview ─── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
          {/* Contact & Personal Info */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Personal Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground">{studentProfile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground">{studentProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground">{studentProfile.address}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground">ID: {studentProfile.studentId}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground">{studentProfile.enrollmentStatus} · {studentProfile.year}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Academic Advisor</p>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">{studentProfile.advisor}</span>
                  <span className="text-xs text-muted-foreground">{studentProfile.advisorEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Financial Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Outstanding Balance</span>
                <span className="text-foreground font-bold font-heading text-lg">{financialSnapshot.balance}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Aid Package</span>
                <span className="text-foreground font-medium">{financialSnapshot.aidPackage}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Scholarships</span>
                <span className="text-foreground font-medium">{financialSnapshot.scholarships}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">FAFSA Status</span>
                <span className="pill-success">{financialSnapshot.fafsa}</span>
              </div>
              <div className="border-t border-border pt-3 mt-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Next Payment</p>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">{financialSnapshot.nextPayment.amount}</span>
                  <span className="text-xs text-muted-foreground">{financialSnapshot.nextPayment.date}</span>
                </div>
              </div>
              <button onClick={() => navigate("/financial")} className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-1">
                View Full Financial Details <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Wellness Overview */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" /> Wellness Overview
            </h3>
            <div className="space-y-3">
              <div className="text-center py-3">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" strokeWidth="6" className="stroke-muted" />
                    <circle cx="40" cy="40" r="35" fill="none" strokeWidth="6" className="stroke-foreground" strokeDasharray={`${wellnessSnapshot.compositeScore * 2.2} 220`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold font-heading text-foreground">{wellnessSnapshot.compositeScore}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Composite Wellness Score</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sleep Quality</span>
                <span className="pill-warning">{wellnessSnapshot.sleep}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stress Level</span>
                <span className="pill-warning">{wellnessSnapshot.stress}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Check-in</span>
                <span className="text-foreground text-xs">{wellnessSnapshot.lastCheckIn}</span>
              </div>
              <div className="border-t border-border pt-3 mt-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Upcoming Appointment</p>
                <p className="text-sm text-foreground">{wellnessSnapshot.upcomingAppointment}</p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Emergency Contact</p>
                <p className="text-xs text-foreground">{wellnessSnapshot.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-4 h-4" /> Achievements & Milestones
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.title} className="bg-secondary rounded-xl p-4 text-center">
                    <Icon className="w-6 h-6 text-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{a.term}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career Snapshot */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Career Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Applications</span>
                <span className="text-foreground font-bold">{careerSnapshot.activeApplications}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Upcoming Interviews</span>
                <span className="text-foreground font-bold">{careerSnapshot.interviews}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saved Positions</span>
                <span className="text-foreground font-bold">{careerSnapshot.savedJobs}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resume</span>
                <span className="pill-success text-[10px]">Updated</span>
              </div>
              <div className="border-t border-border pt-3 mt-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Next Deadline</p>
                <p className="text-sm font-medium text-foreground">{careerSnapshot.nextDeadline}</p>
              </div>
              <button onClick={() => navigate("/jobs")} className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-1">
                View Career Services <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Academic ─── */}
      {activeTab === "academic" && (
        <div className="space-y-4 animate-fade-in">
          {/* Degree Progress */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Degree Progress
            </h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">{academicSnapshot.creditsCompleted} of {academicSnapshot.creditsRequired} credits</span>
                <span className="text-foreground font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-xl font-bold font-heading text-foreground">{academicSnapshot.gpa}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">GPA</p>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-xl font-bold font-heading text-foreground">{academicSnapshot.creditsInProgress}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">In Progress</p>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-xl font-bold font-heading text-foreground">{academicSnapshot.creditsRequired - academicSnapshot.creditsCompleted}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Remaining</p>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-sm font-bold font-heading text-foreground">{academicSnapshot.standing}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Standing</p>
              </div>
            </div>
          </div>

          {/* Current Courses */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Current Courses — {studentProfile.quarter}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {academicSnapshot.currentCourses.map((course) => (
                <div key={course.code} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-accent text-xs text-muted-foreground w-16">{course.code}</span>
                    <span className="text-sm text-foreground font-medium">{course.name}</span>
                    <span className="text-xs text-muted-foreground">{course.credits} cr</span>
                  </div>
                  <Badge variant={course.grade.startsWith("A") ? "default" : course.grade.startsWith("B") ? "secondary" : "destructive"} className="font-mono-accent">
                    {course.grade}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Timeline */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Academic Timeline
            </h3>
            <div className="space-y-3">
              {[
                { period: "Fall 2024", credits: 16, gpa: "3.38", highlight: false },
                { period: "Winter 2025", credits: 15, gpa: "3.42", highlight: false },
                { period: "Spring 2025", credits: 16, gpa: "3.45", highlight: false },
                { period: "Summer 2025", credits: 8, gpa: "3.60", highlight: false },
                { period: "Fall 2025", credits: 16, gpa: "3.52", highlight: true },
                { period: "Fall 2026", credits: 16, gpa: "—", highlight: false },
              ].map((term) => (
                <div key={term.period} className={`flex items-center justify-between py-2 px-3 rounded-lg ${term.highlight ? "bg-secondary" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground font-medium">{term.period}</span>
                    {term.highlight && <span className="pill-success text-[10px]">Dean's List</span>}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{term.credits} credits</span>
                    <span className="font-mono-accent text-foreground font-medium w-10 text-right">{term.gpa}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Atlas Activity ─── */}
      {activeTab === "activity" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" /> Atlas Action History
              </h3>
              <span className="text-[10px] font-mono-accent text-muted-foreground">{atlasActivity.length} actions taken</span>
            </div>
            <p className="text-xs text-muted-foreground">Every action Atlas has taken on your behalf, with the Salesforce Agentforce capability powering it.</p>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-border">
              {atlasActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                        <span className="pill-neutral text-[10px]">{item.pillar}</span>
                      </div>
                      <span className="agentforce-badge mt-2">
                        <Zap className="w-2.5 h-2.5" />
                        {item.agentforce}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Settings ─── */}
      {activeTab === "settings" && (
        <div className="space-y-4 animate-fade-in">
          {/* Notification Preferences */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notification Preferences
            </h3>
            <div className="space-y-1">
              {notificationPreferences.map((pref) => (
                <div key={pref.label} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{pref.description}</p>
                  </div>
                  <div className={`w-9 h-5 rounded-full flex items-center transition-colors cursor-pointer ${pref.enabled ? "bg-foreground justify-end" : "bg-muted justify-start"}`}>
                    <div className={`w-4 h-4 rounded-full mx-0.5 ${pref.enabled ? "bg-background" : "bg-muted-foreground/50"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Privacy & Data
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  Profile visibility
                </div>
                <span className="pill-neutral text-[10px]">University Only</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                  Wellness data sharing
                </div>
                <span className="pill-success text-[10px]">Confidential</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  Atlas data retention
                </div>
                <span className="pill-neutral text-[10px]">Session Only</span>
              </div>
            </div>
          </div>

          {/* Connected Services */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Connected Services
            </h3>
            <div className="space-y-2">
              {[
                { name: "Salesforce Data Cloud", status: "Connected", desc: "Cross-system student data" },
                { name: "University SIS", status: "Connected", desc: "Academic records & enrollment" },
                { name: "Financial Aid Office", status: "Connected", desc: "Aid packages & disbursements" },
                { name: "Career Services", status: "Connected", desc: "Job board & alumni network" },
                { name: "Wellness Center", status: "Connected", desc: "Appointments & pulse scores" },
                { name: "Google Calendar", status: "Linked", desc: "Deadline & event sync" },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{svc.name}</p>
                    <p className="text-xs text-muted-foreground">{svc.desc}</p>
                  </div>
                  <span className="pill-success text-[10px]">{svc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-[10px] text-muted-foreground">Powered by Salesforce Agentforce</p>
      </div>
    </div>
  );
};

export default Profile;
