import { useEffect, useState } from "react";

type RobotState = "idle" | "talking" | "pointing";

interface RobotMascotProps {
    state?: RobotState;
    className?: string;
    size?: number;
}

export default function RobotMascot({ state = "idle", className = "", size = 80 }: RobotMascotProps) {
    const [blink, setBlink] = useState(false);

    // Blink every 3-5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    const scale = size / 80;

    return (
        <div
            className={`relative select-none ${className}`}
            style={{
                width: size,
                height: size + 10,
                perspective: "400px",
            }}
        >
            {/* Float + rotate animation wrapper */}
            <div
                className="absolute inset-0"
                style={{
                    animation: state === "talking"
                        ? "robotFloat 2s ease-in-out infinite, robotTalk 0.3s ease-in-out infinite"
                        : state === "pointing"
                            ? "robotFloat 2.5s ease-in-out infinite, robotPoint 1s ease-in-out infinite"
                            : "robotFloat 3s ease-in-out infinite",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Shadow */}
                <div
                    className="absolute rounded-full bg-black/20 blur-sm"
                    style={{
                        width: size * 0.5,
                        height: size * 0.12,
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        animation: "robotShadow 3s ease-in-out infinite",
                    }}
                />

                {/* Body */}
                <div
                    className="absolute"
                    style={{
                        width: size * 0.55,
                        height: size * 0.4,
                        bottom: size * 0.15,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, #4c367a 0%, #5d4494 40%, #39275b 100%)",
                        borderRadius: `${4 * scale}px`,
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                >
                    {/* Chest light */}
                    <div
                        className="absolute"
                        style={{
                            width: 6 * scale,
                            height: 6 * scale,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            borderRadius: "50%",
                            background: state === "talking" ? "#E3BF42" : "#666",
                            boxShadow: state === "talking" ? "0 0 8px #E3BF42, 0 0 16px rgba(227,191,66,0.4)" : "none",
                            transition: "all 0.3s ease",
                        }}
                    />

                    {/* Left arm */}
                    <div
                        className="absolute"
                        style={{
                            width: 6 * scale,
                            height: size * 0.22,
                            left: -8 * scale,
                            background: "linear-gradient(180deg, #4c367a 0%, #39275b 100%)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            transformOrigin: "top center",
                            animation: state === "pointing" ? "armWave 1s ease-in-out infinite" : "none",
                        }}
                    />

                    {/* Right arm */}
                    <div
                        className="absolute"
                        style={{
                            width: 6 * scale,
                            height: size * 0.22,
                            right: -8 * scale,
                            background: "linear-gradient(180deg, #4c367a 0%, #39275b 100%)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            transformOrigin: "top center",
                            animation: state === "pointing" ? "armPoint 1s ease-in-out infinite" : "none",
                        }}
                    />
                </div>

                {/* Head */}
                <div
                    className="absolute"
                    style={{
                        width: size * 0.5,
                        height: size * 0.38,
                        top: size * 0.12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(160deg, #5d4494 0%, #4c367a 50%, #39275b 100%)",
                        borderRadius: `${6 * scale}px`,
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                >
                    {/* Face visor */}
                    <div
                        className="absolute"
                        style={{
                            width: "80%",
                            height: "50%",
                            top: "25%",
                            left: "10%",
                            background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
                            borderRadius: `${4 * scale}px`,
                            border: "1px solid rgba(255,255,255,0.05)",
                        }}
                    >
                        {/* Left eye */}
                        <div
                            style={{
                                position: "absolute",
                                width: blink ? 8 * scale : 8 * scale,
                                height: blink ? 1 * scale : 8 * scale,
                                left: "20%",
                                top: "50%",
                                transform: "translateY(-50%)",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, #E3BF42 20%, #d7c896 60%, transparent 100%)",
                                boxShadow: "0 0 6px #E3BF42, 0 0 12px rgba(227,191,66,0.5)",
                                transition: "height 0.1s ease",
                            }}
                        />
                        {/* Right eye */}
                        <div
                            style={{
                                position: "absolute",
                                width: blink ? 8 * scale : 8 * scale,
                                height: blink ? 1 * scale : 8 * scale,
                                right: "20%",
                                top: "50%",
                                transform: "translateY(-50%)",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, #E3BF42 20%, #d7c896 60%, transparent 100%)",
                                boxShadow: "0 0 6px #E3BF42, 0 0 12px rgba(227,191,66,0.5)",
                                transition: "height 0.1s ease",
                            }}
                        />
                    </div>
                </div>

                {/* Antenna */}
                <div
                    className="absolute"
                    style={{
                        width: 2 * scale,
                        height: size * 0.12,
                        top: size * 0.02,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#39275b",
                    }}
                >
                    {/* Antenna tip */}
                    <div
                        style={{
                            position: "absolute",
                            width: 6 * scale,
                            height: 6 * scale,
                            top: -3 * scale,
                            left: "50%",
                            transform: "translateX(-50%)",
                            borderRadius: "50%",
                            background: "#E3BF42",
                            boxShadow: "0 0 8px #E3BF42, 0 0 16px rgba(227,191,66,0.6)",
                            animation: "antennaPulse 2s ease-in-out infinite",
                        }}
                    />
                </div>

                {/* Legs */}
                <div className="absolute" style={{ bottom: size * 0.02, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 * scale }}>
                    <div style={{ width: 8 * scale, height: size * 0.14, background: "linear-gradient(180deg, #4c367a, #39275b)", borderRadius: `${2 * scale}px` }} />
                    <div style={{ width: 8 * scale, height: size * 0.14, background: "linear-gradient(180deg, #4c367a, #39275b)", borderRadius: `${2 * scale}px` }} />
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes robotFloat {
          0%, 100% { transform: translateY(0) rotateY(-5deg); }
          50% { transform: translateY(-8px) rotateY(5deg); }
        }
        @keyframes robotTalk {
          0%, 100% { transform: translateY(0) rotateY(-3deg) scale(1); }
          50% { transform: translateY(-2px) rotateY(3deg) scale(1.02); }
        }
        @keyframes robotPoint {
          0%, 100% { transform: translateY(-2px) rotateY(-8deg); }
          50% { transform: translateY(-6px) rotateY(2deg); }
        }
        @keyframes robotShadow {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.15; transform: translateX(-50%) scaleX(0.8); }
        }
        @keyframes antennaPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #E3BF42, 0 0 16px rgba(227,191,66,0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 4px #E3BF42, 0 0 8px rgba(227,191,66,0.4); }
        }
        @keyframes armWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
        @keyframes armPoint {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-30deg); }
          75% { transform: rotate(-25deg); }
        }
      `}</style>
        </div>
    );
}
