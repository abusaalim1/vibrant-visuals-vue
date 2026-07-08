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

/** Softer, page-wide backdrop for content screens (Home, Memories, etc.) */
export function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="ambient-blob animate-drift"
        style={{
          width: 360,
          height: 360,
          top: -140,
          right: -120,
          background: "radial-gradient(circle, #ffc6d6 0%, transparent 70%)",
          opacity: 0.55,
        }}
      />
      <div
        className="ambient-blob animate-drift"
        style={{
          width: 300,
          height: 300,
          top: "38%",
          left: -140,
          background: "radial-gradient(circle, #ffd8e4 0%, transparent 70%)",
          opacity: 0.5,
          animationDelay: "-4s",
        }}
      />
      <div
        className="ambient-blob animate-drift"
        style={{
          width: 340,
          height: 340,
          bottom: -160,
          right: -120,
          background: "radial-gradient(circle, #ffb9cd 0%, transparent 70%)",
          opacity: 0.45,
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}
