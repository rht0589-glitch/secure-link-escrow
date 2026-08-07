import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  title: string;
  detail?: string;
  time?: string;
  state: "done" | "current" | "todo";
};

export function Timeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                className={cn(
                  "absolute left-[13px] top-7 h-[calc(100%-1rem)] w-px",
                  step.state === "done" ? "bg-primary/40" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border",
                step.state === "done" && "border-primary bg-primary text-primary-foreground",
                step.state === "current" &&
                  "border-primary bg-primary-soft text-primary animate-pulse",
                step.state === "todo" && "border-border bg-card text-muted-foreground",
              )}
            >
              {step.state === "done" ? (
                <Check className="size-3.5" />
              ) : step.state === "current" ? (
                <Clock className="size-3.5" />
              ) : (
                <Circle className="size-2.5" />
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.state === "todo" && "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
              {step.detail ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
              ) : null}
              {step.time ? <p className="mt-0.5 text-xs text-muted-foreground/70">{step.time}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
