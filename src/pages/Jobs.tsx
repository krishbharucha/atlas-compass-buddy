import { Briefcase, MapPin, Clock, Building2, ExternalLink, Search, Filter, ChevronRight, Bookmark, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const applications = [
  { company: "Google", role: "Software Engineering Intern", status: "Interview", date: "Applied Feb 20", location: "Mountain View, CA" },
  { company: "Microsoft", role: "Product Management Intern", status: "Under Review", date: "Applied Feb 15", location: "Redmond, WA" },
  { company: "Stripe", role: "Backend Engineering Intern", status: "Applied", date: "Applied Mar 1", location: "San Francisco, CA" },
  { company: "JPMorgan", role: "Technology Analyst", status: "Rejected", date: "Applied Jan 30", location: "New York, NY" },
];

const listings = [
  { company: "Amazon", role: "SDE Intern - Summer 2026", type: "Internship", location: "Seattle, WA", posted: "2d ago", saved: true },
  { company: "Meta", role: "Data Science Intern", type: "Internship", location: "Menlo Park, CA", posted: "3d ago", saved: false },
  { company: "Goldman Sachs", role: "Engineering Analyst", type: "Full-time", location: "New York, NY", posted: "5d ago", saved: false },
  { company: "Apple", role: "Machine Learning Intern", type: "Internship", location: "Cupertino, CA", posted: "1w ago", saved: true },
  { company: "Deloitte", role: "Consulting Analyst", type: "Full-time", location: "Chicago, IL", posted: "1w ago", saved: false },
];

const statusStyle = (status: string) => {
  switch (status) {
    case "Interview": return "pill-success";
    case "Under Review": return "pill-warning";
    case "Rejected": return "pill-danger";
    default: return "pill-neutral";
  }
};

const Jobs = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Career & Internships</h1>
        <p className="text-sm text-muted-foreground">Track applications, discover opportunities, and build your career.</p>
      </div>
      <Button size="sm" className="gap-1">
        <ExternalLink className="w-3.5 h-3.5" />
        Career Portal
      </Button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { icon: Briefcase, label: "Applications", value: "12", sub: "This semester" },
        { icon: Star, label: "Interviews", value: "3", sub: "Scheduled" },
        { icon: Building2, label: "Companies", value: "8", sub: "Contacted" },
        { icon: Bookmark, label: "Saved Jobs", value: "15", sub: "Active listings" },
      ].map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-bold font-heading text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Applications tracker */}
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">My Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {applications.map((app) => (
            <div key={app.company + app.role} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{app.role}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{app.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span>
                  <span>{app.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={statusStyle(app.status)}>{app.status}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Job Listings */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recommended Opportunities</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search roles..." className="pl-9 h-8 w-48 text-sm" />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {listings.map((job) => (
            <div key={job.company + job.role} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{job.role}</span>
                  <Badge variant="secondary" className="text-[10px] font-mono-accent">{job.type}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className={`w-4 h-4 ${job.saved ? "text-foreground fill-foreground" : "text-muted-foreground"}`} />
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Jobs;
