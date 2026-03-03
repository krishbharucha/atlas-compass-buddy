import { Settings, FileText, User, Mail, Building, Clock, ChevronRight, Download, Upload, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const personalInfo = [
  { label: "Full Name", value: "Jordan Mitchell" },
  { label: "Student ID", value: "JM-2024-0847" },
  { label: "Email", value: "j.mitchell@university.edu" },
  { label: "Program", value: "B.S. Computer Science" },
  { label: "Year", value: "Junior (Year 3)" },
  { label: "Enrollment Status", value: "Full-time" },
];

const requests = [
  { title: "Transcript Request", status: "Completed", date: "Feb 25, 2026", type: "Document" },
  { title: "Enrollment Verification", status: "Processing", date: "Mar 1, 2026", type: "Document" },
  { title: "Parking Permit Renewal", status: "Pending", date: "Mar 2, 2026", type: "Campus" },
  { title: "Name Change Request", status: "Completed", date: "Jan 15, 2026", type: "Personal" },
];

const documents = [
  { name: "Official Transcript", updated: "Feb 25, 2026", size: "124 KB" },
  { name: "Enrollment Verification Letter", updated: "Jan 20, 2026", size: "89 KB" },
  { name: "Financial Aid Award Letter", updated: "Dec 10, 2025", size: "156 KB" },
  { name: "Immunization Records", updated: "Aug 15, 2024", size: "234 KB" },
  { name: "Housing Agreement", updated: "Jul 30, 2024", size: "312 KB" },
];

const statusStyle = (status: string) => {
  switch (status) {
    case "Completed": return "pill-success";
    case "Processing": return "pill-warning";
    case "Pending": return "pill-neutral";
    default: return "pill-neutral";
  }
};

const Administration = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Administration</h1>
        <p className="text-sm text-muted-foreground">Manage records, documents, and administrative requests.</p>
      </div>
      <Button variant="outline" size="sm" className="gap-1">
        <Mail className="w-3.5 h-3.5" />
        Contact Registrar
      </Button>
    </div>

    {/* Student Info Card */}
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Student Information</CardTitle>
          <Badge variant="secondary" className="gap-1 text-xs">
            <CheckCircle className="w-3 h-3" />
            Verified
          </Badge>
        </div>
        <Button variant="outline" size="sm">Edit Profile</Button>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalInfo.map((info) => (
            <div key={info.label}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{info.label}</p>
              <p className="text-sm font-medium text-foreground">{info.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <div className="grid lg:grid-cols-2 gap-4 mb-8">
      {/* Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Requests</CardTitle>
          <Button variant="outline" size="sm">New Request</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {requests.map((req) => (
              <div key={req.title} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{req.title}</p>
                    <Badge variant="secondary" className="text-[10px] font-mono-accent">{req.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{req.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={statusStyle(req.status)}>{req.status}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Documents</CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Upload className="w-3.5 h-3.5" />
            Upload
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div key={doc.name} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.updated} · {doc.size}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Quick Actions */}
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: FileText, label: "Request Transcript" },
            { icon: Shield, label: "Update Emergency Contact" },
            { icon: Building, label: "Change Housing" },
            { icon: User, label: "Update Personal Info" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Administration;
