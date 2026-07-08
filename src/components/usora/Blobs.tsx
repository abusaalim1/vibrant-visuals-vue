export function AmbientBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="ambient-blob animate-drift"
        style={{
          width: 380,
          height: 380,
          top: -120,
          left: -120,
          background: "radial-gradient(circle, #ffb3c8 0%, transparent 70%)",
        }}
      />
      <div
        className="ambient-blob animate-drift"
        style={{
          width: 320,
          height: 320,
          bottom: -140,
          right: -100,
          background: "radial-gradient(circle, #ff8fb1 0%, transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="ambient-blob animate-drift"
        style={{
          width: 240,
          height: 240,
          top: "40%",
          right: -80,
          background: "radial-gradient(circle, #ffd6e0 0%, transparent 70%)",
          animationDelay: "-3s",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
