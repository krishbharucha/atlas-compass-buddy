import { useState } from "react";
import { DollarSign, Award, FileText, ChevronRight, ArrowUpRight, ArrowDownRight, Zap, AlertTriangle, CheckCircle2, ExternalLink, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import PaymentFlow from "@/components/financial/PaymentFlow";
import DisbursementFlow from "@/components/financial/DisbursementFlow";
import AlertsSection from "@/components/financial/AlertsSection";
import TryDemoDrawer from "@/components/financial/TryDemoDrawer";
import ModifyPlanFlow from "@/components/financial/ModifyPlanFlow";

const transactions = [
  { date: "Feb 28, 2026", description: "Spring 2026 Tuition", amount: -18450, type: "charge" },
  { date: "Feb 15, 2026", description: "Merit Scholarship", amount: 7500, type: "aid" },
  { date: "Feb 10, 2026", description: "Federal Pell Grant", amount: 3250, type: "aid" },
  { date: "Jan 20, 2026", description: "Housing Fee", amount: -4200, type: "charge" },
  { date: "Jan 15, 2026", description: "Payment - Family Contribution", amount: 5000, type: "payment" },
  { date: "Jan 10, 2026", description: "Student Activity Fee", amount: -350, type: "charge", badge: true },
];

const atlasCapabilities = [
  {
    trigger: "Award letter confusion",
    example: "\"My grant went down $3,000 — why?\"",
    actions: ["Pulls complete aid history & compares year-over-year", "Identifies root cause (EFC change, missing docs, SAP flag)", "Pre-fills verification forms & files appeals with urgency flags", "Places hold prevention flag to protect registration"],
    demoFlow: "award-letter",
  },
  {
    trigger: "Emergency financial need",
    example: "\"I need $400 for textbooks and I have $12\"",
    actions: ["Checks textbook lending program eligibility", "Surfaces open textbook alternatives for every course", "Initiates emergency micro-grant application pre-filled", "Finds work-study positions ranked by immediacy"],
  },
  {
    trigger: "Unexpected tuition balance",
    example: "\"Why do I owe $3,200 more than expected?\"",
    actions: ["Traces exact charge discrepancy across all accounts", "Identifies if aid disbursement is delayed vs. denied", "Files payment plan modification if needed", "Protects enrollment during resolution"],
  },
];

const Financial = () => {
  const navigate = useNavigate();
  const [paymentFlowOpen, setPaymentFlowOpen] = useState(false);
  const [disbursementFlowOpen, setDisbursementFlowOpen] = useState(false);
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Financial Overview</h1>
          <p className="text-sm text-muted-foreground">Tuition, financial aid, scholarships, and payment history.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Card 1 — Balance Due */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Balance</span>
              </div>
              <p className="text-xl font-bold font-heading text-foreground">$7,250.00</p>
              <p className="text-xs mt-0.5 text-destructive font-medium">Due Apr 15, 2026</p>
              <div className="mt-3 p-2 rounded-md bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground leading-relaxed">
                    Payment due in 8 days — reminders drafted, enrollment protection ready.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 text-xs gap-1"
                onClick={() => { setPaymentFlowOpen(!paymentFlowOpen); setDisbursementFlowOpen(false); }}
              >
                Review Plan <ChevronRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 — Aid */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Aid</span>
              </div>
              <p className="text-xl font-bold font-heading text-foreground">$10,750.00</p>
              <p className="text-xs mt-0.5 text-muted-foreground">This semester</p>
              <div className="mt-3 p-2 rounded-md bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground leading-relaxed">
                    Merit Scholarship delayed 3 days. Atlas ready to query Financial Aid.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 text-xs gap-1"
                onClick={() => { setDisbursementFlowOpen(!disbursementFlowOpen); setPaymentFlowOpen(false); }}
              >
                Let Atlas Investigate <ChevronRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Flow Panels */}
        <PaymentFlow open={paymentFlowOpen} onClose={() => setPaymentFlowOpen(false)} />
        <DisbursementFlow open={disbursementFlowOpen} onClose={() => setDisbursementFlowOpen(false)} />

        {/* Alerts */}
        <div className="mt-8">
          <AlertsSection />
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
              <ModifyPlanFlow />
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
                <div
                  key={i}
                  className="py-3 flex items-center justify-between hover:bg-secondary/50 -mx-6 px-6 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-secondary border-l-2 ${tx.amount > 0 ? "border-success" : "border-destructive"}`}>
                      {tx.amount > 0 ? <ArrowDownRight className="w-4 h-4 text-muted-foreground" /> : <ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{tx.description}</p>
                        {(tx as any).badge && (
                          <Tooltip open={tooltipOpen === tx.description} onOpenChange={(v) => setTooltipOpen(v ? tx.description : null)}>
                            <TooltipTrigger asChild>
                              <span className="pill-warning text-[10px] cursor-pointer" onClick={(e) => { e.stopPropagation(); setTooltipOpen(tooltipOpen === tx.description ? null : tx.description); }}>
                                New charge — outside billing cycle
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Expected annual fee — verified ✓</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-foreground">
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atlas Help */}
        <Card className="mt-8 border-primary/10 bg-secondary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Need Help With Your Finances?</CardTitle>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/chat")} className="gap-1 text-xs">
                Open Atlas Chat <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Atlas can help you understand charges, resolve issues, and manage your financial aid — just ask.</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid sm:grid-cols-3 gap-3">
              {atlasCapabilities.map((cap) => (
                <div
                  key={cap.trigger}
                  className="border border-border rounded-lg p-3 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => cap.demoFlow ? setDemoDrawerOpen(true) : navigate("/chat")}
                >
                  <p className="text-sm font-medium text-foreground mb-1">{cap.trigger}</p>
                  <p className="text-xs text-muted-foreground italic mb-2">{cap.example}</p>
                  <p className="text-[11px] text-muted-foreground">{cap.actions[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo drawer */}
        <TryDemoDrawer open={demoDrawerOpen} onClose={() => setDemoDrawerOpen(false)} />
      </div>
    </TooltipProvider>
  );
};

export default Financial;
