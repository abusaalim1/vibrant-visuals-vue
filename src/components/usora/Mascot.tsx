type Props = {
  variant?: "left" | "right";
  size?: number;
  className?: string;
};

/** Soft rounded blob mascot: dot eyes, small smile, one waving arm. */
export function Mascot({ variant = "left", size = 96, className = "" }: Props) {
  const isLeft = variant === "left";
  const bodyGradient = isLeft
    ? ["#ffd0dc", "#ff9ab6"]
    : ["#ffe3ea", "#ffb0c6"];
  const id = `blob-${variant}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`animate-float-bob ${className}`}
      style={{ animationDelay: isLeft ? "0s" : "-1.6s" }}
    >
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={bodyGradient[0]} />
          <stop offset="100%" stopColor={bodyGradient[1]} />
        </radialGradient>
      </defs>
      {/* body */}
      <path
        d="M60 12c26 0 44 20 44 46 0 30-20 50-44 50S16 88 16 58 34 12 60 12z"
        fill={`url(#${id})`}
      />
      {/* cheeks */}
      <circle cx="42" cy="66" r="5" fill="#ff8aab" opacity="0.55" />
      <circle cx="78" cy="66" r="5" fill="#ff8aab" opacity="0.55" />
      {/* eyes */}
      <circle cx="48" cy="55" r="3.2" fill="#241B24" />
      <circle cx="72" cy="55" r="3.2" fill="#241B24" />
      {/* smile */}
      <path
        d="M52 72 Q60 79 68 72"
        stroke="#241B24"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* waving arm */}
      <g
        style={{
          transformOrigin: isLeft ? "22px 78px" : "98px 78px",
          animation: "float-bob 2.4s ease-in-out infinite",
        }}
      >
        {isLeft ? (
          <path
            d="M22 82 Q10 62 18 46"
            stroke={bodyGradient[1]}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M98 82 Q110 62 102 46"
            stroke={bodyGradient[1]}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>
    </svg>
  );
}
