import type { Step } from "react-joyride";

export interface TutorialStep extends Step {
    route?: string; // navigate to this route before showing the step
}

const tutorialSteps: TutorialStep[] = [
    // ── Dashboard ──
    {
        target: "[data-tutorial='nav-bar']",
        content: "Welcome to Atlas! I'm your guide. Let me show you around the entire platform. This is the navigation bar — you can access all features from here.",
        placement: "bottom",
        disableBeacon: true,
        route: "/dashboard",
    },
    {
        target: "[data-tutorial='stat-cards']",
        content: "These are your real-time KPIs — GPA, credits, deadlines, wellness score, and pending actions. They update live as Atlas works behind the scenes.",
        placement: "bottom",
        route: "/dashboard",
    },
    {
        target: "[data-tutorial='deadlines']",
        content: "Your upcoming deadlines are prioritized here. Atlas monitors these and can automatically remind you or take action before they pass.",
        placement: "top",
        route: "/dashboard",
    },

    // ── Atlas Chat ──
    {
        target: "[data-tutorial='chat-input']",
        content: "This is Atlas Chat — your AI agent. Type any question about financial aid, academics, career, wellness, or admin. Atlas doesn't just answer — it takes action.",
        placement: "top",
        route: "/chat",
    },
    {
        target: "[data-tutorial='scenario-tabs']",
        content: "Switch between Live Mode (type freely) and Demo Mode (pre-built scenarios). Demo Mode has 10 scenarios showcasing all 5 support pillars.",
        placement: "bottom",
        route: "/chat",
    },
    {
        target: "[data-tutorial='action-log']",
        content: "The Action Log shows every backend action Atlas performs in real-time — with the Salesforce Agentforce capability powering each one.",
        placement: "left",
        route: "/chat",
    },

    // ── Academic ──
    {
        target: "[data-tutorial='academic-header']",
        content: "The Academic tab shows your courses, GPA, degree progress, and lets Atlas help with tutoring, advisor scheduling, and course planning.",
        placement: "bottom",
        route: "/academic",
    },

    // ── Financial ──
    {
        target: "[data-tutorial='financial-summary']",
        content: "Your complete financial picture — balance, aid package, scholarships, and transaction history. Atlas can detect discrepancies and file appeals automatically.",
        placement: "bottom",
        route: "/financial",
    },
    {
        target: "[data-tutorial='financial-alerts']",
        content: "Atlas Automated Alerts monitor your account 24/7 — payment reminders, aid disbursements, GPA scholarship risk, and more. Each can be configured.",
        placement: "top",
        route: "/financial",
    },

    // ── Jobs ──
    {
        target: "[data-tutorial='career-check']",
        content: "Run a Career Check to let Atlas analyze your profile, generate tailored resumes, identify skill gaps, draft alumni outreach messages, and build an 8-week career plan.",
        placement: "bottom",
        route: "/jobs",
    },
    {
        target: "[data-tutorial='my-tasks']",
        content: "Tasks from career checks and saved opportunities appear here as a checklist. Click to mark them done and stay on track.",
        placement: "top",
        route: "/jobs",
    },
    {
        target: "[data-tutorial='my-applications']",
        content: "Track all your applications — status, company, interview dates. Click Schedule to add interviews to your Google Calendar.",
        placement: "top",
        route: "/jobs",
    },
    {
        target: "[data-tutorial='recommended-opportunities']",
        content: "Recommended opportunities matched to your profile. Save with the bookmark icon, add to tasks, and filter by type, industry, salary, or saved status.",
        placement: "top",
        route: "/jobs",
    },

    // ── Wellness ──
    {
        target: "[data-tutorial='wellness-header']",
        content: "The Wellness tab provides mental health resources, crisis support, counseling booking, peer groups, and workshops — all confidential.",
        placement: "bottom",
        route: "/wellness",
    },
    {
        target: "[data-tutorial='wellness-pulse']",
        content: "Your wellness pulse score tracks sleep, stress, and mood. Atlas detects concerning trends and can proactively reach out or alert your advisor.",
        placement: "top",
        route: "/wellness",
    },
    {
        target: "[data-tutorial='crisis-banner']",
        content: "In a crisis, Atlas immediately pages an on-call counselor, provides hotline numbers, and stays present until you're connected with a human. Safety first.",
        placement: "bottom",
        route: "/wellness",
    },

    // ── Profile ──
    {
        target: "[data-tutorial='profile-header']",
        content: "Your complete student profile — personal info, financial summary, wellness overview, achievements, and career snapshot all in one place.",
        placement: "bottom",
        route: "/profile",
    },
    {
        target: "[data-tutorial='profile-tabs']",
        content: "Navigate between Overview, Academic timeline, Atlas Activity history (with Agentforce badges), and Settings. Everything Atlas has done for you is logged here.",
        placement: "top",
        route: "/profile",
    },

    // ── Atlas Drawer ──
    {
        target: "[data-tutorial='atlas-fab']",
        content: "Finally, the Ask Atlas button is available on every page. Click it anytime to open the AI agent drawer and get instant help. That's the full tour! 🎉",
        placement: "left",
    },
];

export default tutorialSteps;
