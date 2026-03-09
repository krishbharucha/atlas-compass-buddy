import { useState, useCallback, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, ACTIONS, EVENTS, Step } from "react-joyride";
import { useNavigate, useLocation } from "react-router-dom";
import RobotMascot from "./RobotMascot";
import tutorialSteps, { TutorialStep } from "@/data/tutorialSteps";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";

// ── Custom Tooltip with Robot ──
interface TooltipProps {
    continuous: boolean;
    index: number;
    step: Step;
    backProps: any;
    closeProps: any;
    primaryProps: any;
    skipProps: any;
    tooltipProps: any;
    isLastStep: boolean;
    size: number;
}

const RobotTooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    tooltipProps,
    isLastStep,
    size,
}: TooltipProps) => {
    const progress = ((index + 1) / size) * 100;

    return (
        <div
            {...tooltipProps}
            className="relative z-[10001]"
            style={{ maxWidth: 380, minWidth: 280 }}
        >
            {/* Glass card tooltip */}
            <div
                className="rounded-2xl border border-white/20 bg-[#2d1f4b]/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden"
                style={{ boxShadow: "0 0 40px rgba(227,191,66,0.15), 0 20px 60px rgba(0,0,0,0.5)" }}
            >
                {/* Progress bar */}
                <div className="h-1 bg-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-[#E3BF42] to-[#d7c896] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-5">
                    {/* Robot + Step Counter */}
                    <div className="flex items-start gap-3 mb-3">
                        <RobotMascot state="talking" size={50} />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E3BF42]">
                                    Atlas Tour · Step {index + 1}/{size}
                                </span>
                                <button
                                    {...closeProps}
                                    className="text-white/40 hover:text-white/80 transition-colors p-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {step.title && (
                                <p className="text-sm font-semibold text-white mb-1">{step.title as string}</p>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-white/80 leading-relaxed">
                        {step.content as string}
                    </p>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                        <button
                            {...skipProps}
                            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
                        >
                            <SkipForward className="w-3 h-3" />
                            Skip Tour
                        </button>
                        <div className="flex items-center gap-2">
                            {index > 0 && (
                                <button
                                    {...backProps}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <ChevronLeft className="w-3 h-3" />
                                    Back
                                </button>
                            )}
                            <button
                                {...primaryProps}
                                className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#E3BF42] text-[#39275b] hover:bg-[#d7c896] transition-all shadow-md shadow-[#E3BF42]/20"
                            >
                                {isLastStep ? "Finish! 🎉" : "Next"}
                                {!isLastStep && <ChevronRight className="w-3 h-3" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Tutorial Overlay Component ──
interface TutorialOverlayProps {
    run: boolean;
    onClose: () => void;
}

export default function TutorialOverlay({ run, onClose }: TutorialOverlayProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [stepIndex, setStepIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Start running once we're on the correct route
    useEffect(() => {
        if (!run) {
            setIsRunning(false);
            setStepIndex(0);
            return;
        }

        const currentStep = tutorialSteps[stepIndex] as TutorialStep;
        const targetRoute = currentStep?.route || location.pathname;

        if (location.pathname !== targetRoute) {
            setIsRunning(false);
            navigate(targetRoute);
            // Wait for page to render then start
            const timer = setTimeout(() => setIsRunning(true), 600);
            return () => clearTimeout(timer);
        } else {
            // Small delay to let elements render
            const timer = setTimeout(() => setIsRunning(true), 300);
            return () => clearTimeout(timer);
        }
    }, [run, stepIndex, location.pathname, navigate]);

    const handleCallback = useCallback(
        (data: CallBackProps) => {
            const { action, index, status, type } = data;

            if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
                setIsRunning(false);
                setStepIndex(0);
                onClose();
                return;
            }

            if (type === EVENTS.STEP_AFTER) {
                const nextIndex = action === ACTIONS.PREV ? index - 1 : index + 1;

                if (nextIndex >= 0 && nextIndex < tutorialSteps.length) {
                    const nextStep = tutorialSteps[nextIndex] as TutorialStep;
                    const needsNavigation = nextStep.route && nextStep.route !== location.pathname;

                    setIsRunning(false);
                    setStepIndex(nextIndex);

                    if (needsNavigation) {
                        navigate(nextStep.route!);
                        setTimeout(() => setIsRunning(true), 600);
                    } else {
                        setTimeout(() => setIsRunning(true), 200);
                    }
                }
            }
        },
        [location.pathname, navigate, onClose]
    );

    if (!run) return null;

    return (
        <Joyride
            steps={tutorialSteps}
            stepIndex={stepIndex}
            run={isRunning}
            continuous
            showSkipButton
            showProgress
            scrollToFirstStep
            scrollOffset={100}
            disableOverlayClose
            spotlightClicks={false}
            callback={handleCallback}
            tooltipComponent={RobotTooltip as any}
            floaterProps={{
                disableAnimation: false,
                styles: {
                    floater: {
                        filter: "none",
                    },
                },
            }}
            styles={{
                options: {
                    zIndex: 10000,
                    arrowColor: "transparent",
                    overlayColor: "rgba(0, 0, 0, 0.85)",
                },
                buttonBack: {
                    color: "#E3BF42",
                    backgroundColor: "transparent",
                    padding: "4px 8px",
                    fontWeight: 600,
                    fontSize: "12px",
                },
                buttonNext: {
                    backgroundColor: "#E3BF42",
                    color: "#39275b",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "12px",
                },
                buttonSkip: {
                    color: "#E3BF42",
                    backgroundColor: "transparent",
                    padding: "4px 8px",
                    fontWeight: 600,
                    fontSize: "12px",
                },
                overlay: {},
                spotlight: {
                    borderRadius: 12,
                    boxShadow: "0 0 0 4px rgba(227,191,66,0.3), 0 0 30px rgba(227,191,66,0.15)",
                },
            }}
        />
    );
}
