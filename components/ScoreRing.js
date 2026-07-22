export default function ScoreRing({
  percent,
  size = 132,
  strokeWidth = 10,
  variant = "dark",
  color,
  label,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const strokeColor = color ?? (percent >= 75 ? "#34d399" : percent >= 50 ? "#fbbf24" : "#f87171");
  const trackColor = variant === "dark" ? "rgba(255,255,255,0.15)" : "#eef2f9";
  const textColor = variant === "dark" ? "text-white" : "text-navy-900";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-display text-3xl font-extrabold ${textColor}`}>
          {label ?? `${percent}%`}
        </span>
      </div>
    </div>
  );
}
