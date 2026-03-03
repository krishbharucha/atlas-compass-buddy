import { DollarSign, CreditCard, TrendingDown, Award, FileText, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const transactions = [
  { date: "Feb 28, 2026", description: "Spring 2026 Tuition", amount: -18450, type: "charge" },
  { date: "Feb 15, 2026", description: "Merit Scholarship", amount: 7500, type: "aid" },
  { date: "Feb 10, 2026", description: "Federal Pell Grant", amount: 3250, type: "aid" },
  { date: "Jan 20, 2026", description: "Housing Fee", amount: -4200, type: "charge" },
  { date: "Jan 15, 2026", description: "Payment - Family Contribution", amount: 5000, type: "payment" },
  { date: "Jan 10, 2026", description: "Student Activity Fee", amount: -350, type: "charge" },
];

const Financial = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Financial Overview</h1>
      <p className="text-sm text-muted-foreground">Tuition, financial aid, scholarships, and payment history.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { icon: DollarSign, label: "Current Balance", value: "$7,250.00", sub: "Due Apr 15, 2026", alert: true },
        { icon: Award, label: "Total Aid", value: "$10,750.00", sub: "This semester" },
        { icon: CreditCard, label: "Payments Made", value: "$5,000.00", sub: "Year to date" },
        { icon: TrendingDown, label: "Total Charges", value: "$23,000.00", sub: "Spring 2026" },
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
              <p className={`text-xs mt-0.5 ${stat.alert ? "text-destructive font-medium" : "text-muted-foreground"}`}>{stat.sub}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Aid breakdown */}
    <div className="grid lg:grid-cols-3 gap-4 mb-8">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Financial Aid Package</CardTitle>
          <Button variant="outline" size="sm">View Award Letter</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Merit Scholarship", amount: "$7,500", type: "Renewable" },
            { label: "Federal Pell Grant", amount: "$3,250", type: "Need-based" },
            { label: "Work-Study Allocation", amount: "$2,000", type: "Earned" },
            { label: "Department Award", amount: "$1,500", type: "One-time" },
          ].map((aid) => (
            <div key={aid.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{aid.label}</p>
                <p className="text-xs text-muted-foreground">{aid.type}</p>
              </div>
              <span className="font-heading font-semibold text-foreground">{aid.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-foreground">Paid</span>
              <span className="text-xs font-mono-accent text-muted-foreground">$5,000 / $7,250</span>
            </div>
            <Progress value={69} className="h-2" />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next payment</span>
              <span className="text-foreground font-medium">$1,125.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due date</span>
              <span className="text-foreground">Apr 15, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remaining</span>
              <span className="text-foreground font-medium">$2,250.00</span>
            </div>
          </div>
          <Button className="w-full mt-5" size="sm">Make Payment</Button>
        </CardContent>
      </Card>
    </div>

    {/* Transactions */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Transaction History</CardTitle>
        <Button variant="outline" size="sm" className="gap-1">
          <FileText className="w-3.5 h-3.5" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {transactions.map((tx, i) => (
            <div key={i} className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.amount > 0 ? "bg-secondary" : "bg-secondary"}`}>
                  {tx.amount > 0 ? (
                    <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-heading font-semibold ${tx.amount > 0 ? "text-foreground" : "text-foreground"}`}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Financial;
