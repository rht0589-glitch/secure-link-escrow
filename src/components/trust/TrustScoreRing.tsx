import { cn } from "@/lib/utils";

export function TrustScoreRing({
  score,
  size = 132,
  label = "Trust Score",
  className,
}: {
  score: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const tone = score >= 90 ? "text-success" : score >= 75 ? "text-primary" : "text-warning";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={10}
          className="stroke-border"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn("fill-none transition-all duration-700", tone)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-2xl font-semibold">{score}</p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
