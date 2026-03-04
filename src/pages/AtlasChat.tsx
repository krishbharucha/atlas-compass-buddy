import { useState } from "react";
import { Send, Zap, CheckCircle2, Clock, Loader2, AlertTriangle, ChevronRight } from "lucide-react";
import { scenarios, pillarConfig, type Scenario, type ActionItem, type ChatMessage } from "@/data/atlasScenarios";

const statusConfig = {
  "Complete": { class: "pill-success", icon: <CheckCircle2 className="w-3 h-3" /> },
  "In Progress": { class: "pill-warning", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  "Awaiting": { class: "pill-neutral", icon: <Clock className="w-3 h-3" /> },
  "Ready": { class: "pill-success", icon: <CheckCircle2 className="w-3 h-3" /> },
  "Human Taking Over": { class: "pill-danger", icon: <AlertTriangle className="w-3 h-3" /> },
};

const MessageBubble = ({ msg, delay }: { msg: ChatMessage; delay: number }) => {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="max-w-[80%] bg-primary text-primary-foreground rounded-xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  if (msg.role === "confirmation" && msg.confirmationOptions) {
    return (
      <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="max-w-[80%] border border-primary/30 rounded-xl p-4 bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-1">{msg.content}</h3>
          <p className="text-xs text-muted-foreground mb-3">{msg.confirmationOptions.detail}</p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
              {msg.confirmationOptions.primary}
            </button>
            <button className="px-4 py-1.5 border border-border text-foreground rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
              {msg.confirmationOptions.secondary}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCrisis = msg.role === "atlas-crisis";
  const isSuccess = msg.role === "atlas-success";

  return (
    <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div
        className={`max-w-[80%] rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed ${
          isCrisis
            ? "bg-destructive/5 border border-destructive/15 text-foreground"
            : isSuccess
            ? "bg-secondary border border-border text-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isCrisis && (
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive">Support mode</span>
          </div>
        )}
        {isSuccess && (
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
            <span className="text-xs font-semibold text-foreground">All actions complete</span>
          </div>
        )}
        <span style={{ whiteSpace: "pre-line" }}>{msg.content}</span>
      </div>
    </div>
  );
};

const ActionRow = ({ action, index }: { action: ActionItem; index: number }) => {
  const cfg = statusConfig[action.status];
  return (
    <div
      className={`flex gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors animate-fade-in-up ${action.isCrisis ? "bg-destructive/5" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="w-1 rounded-full shrink-0 bg-foreground/20" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono-accent text-[10px] text-muted-foreground">
            {action.isCrisis ? "ALERT" : `#${action.id}`}
          </span>
          <h3 className="text-sm font-medium text-foreground truncate">{action.title}</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
      </div>
      <span className={`${cfg.class} shrink-0 text-[10px] flex items-center gap-1 self-start mt-0.5`}>
        {cfg.icon}
        {action.status}
      </span>
    </div>
  );
};

const pillarKeys = Object.keys(pillarConfig) as Array<keyof typeof pillarConfig>;

const AtlasChat = () => {
  const [selectedPillar, setSelectedPillar] = useState<keyof typeof pillarConfig>("financial");
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);

  const pillarScenarios = scenarios.filter((s) => s.pillar === selectedPillar);

  const handlePillarChange = (pillar: keyof typeof pillarConfig) => {
    setSelectedPillar(pillar);
    const first = scenarios.find((s) => s.pillar === pillar);
    if (first) setSelectedScenario(first);
  };

  const completedCount = selectedScenario.actions.filter((a) => a.status === "Complete" || a.status === "Ready").length;
  const inProgressCount = selectedScenario.actions.filter((a) => a.status === "In Progress" || a.status === "Awaiting" || a.status === "Human Taking Over").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
      {/* Scenario Selector */}
      <div className="mb-4 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {pillarKeys.map((key) => (
            <button
              key={key}
              onClick={() => handlePillarChange(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedPillar === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {pillarConfig[key].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {pillarScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedScenario.id === s.id
                  ? "border-foreground/20 bg-card text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/10"
              }`}
            >
              <ChevronRight className="w-3 h-3" />
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat + Actions layout */}
      <div className="flex flex-col lg:flex-row gap-4" style={{ height: "calc(100vh - 14rem)" }}>
        {/* LEFT: Chat */}
        <div className="lg:w-[45%] flex flex-col glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-header flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">Atlas Assistant</h2>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 inline-block" />
                {selectedScenario.pillarLabel} · {selectedScenario.title}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" key={selectedScenario.id}>
            {selectedScenario.messages.map((msg, i) => (
              <MessageBubble key={`${selectedScenario.id}-${i}`} msg={msg} delay={i * 150} />
            ))}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Atlas anything..."
                className="flex-1 px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
              />
              <button className="px-3 py-2.5 gradient-header rounded-lg text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              Demo Mode — Pre-scripted scenarios showcasing Atlas capabilities
            </p>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="lg:w-[55%] flex flex-col glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Action Log</h2>
            <div className="flex items-center gap-2">
              <span className="pill-success text-[10px]">{completedCount} complete</span>
              {inProgressCount > 0 && (
                <span className="pill-warning text-[10px]">{inProgressCount} in progress</span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border" key={selectedScenario.id}>
            {selectedScenario.actions.map((a, i) => (
              <ActionRow key={`${selectedScenario.id}-${a.id}`} action={a} index={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <p className="text-[10px] text-muted-foreground">Powered by Salesforce Agentforce</p>
      </div>
    </div>
  );
};

export default AtlasChat;
