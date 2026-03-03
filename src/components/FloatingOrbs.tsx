const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(263 83% 58%), transparent 70%)" }} />
    <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.02]" style={{ background: "radial-gradient(circle, hsl(38 92% 50%), transparent 70%)" }} />
  </div>
);

export default FloatingOrbs;
