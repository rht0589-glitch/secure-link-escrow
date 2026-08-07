import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  "Waiting Payment": "bg-muted text-muted-foreground border-border",
  Paid: "bg-primary-soft text-accent-foreground border-primary/20",
  Shipped: "bg-primary-soft text-accent-foreground border-primary/20",
  "In Transit": "bg-primary-soft text-accent-foreground border-primary/20",
  "Waiting Pickup": "bg-muted text-muted-foreground border-border",
  "Out for Delivery": "bg-warning/15 text-warning-foreground border-warning/30",
  Delivered: "bg-success/10 text-success border-success/25",
  Completed: "bg-success/10 text-success border-success/25",
  Released: "bg-success/10 text-success border-success/25",
  Verified: "bg-success/10 text-success border-success/25",
  Disputed: "bg-destructive/10 text-destructive border-destructive/25",
  Failed: "bg-destructive/10 text-destructive border-destructive/25",
  "Under review": "bg-warning/15 text-warning-foreground border-warning/30",
  "Waiting Admin": "bg-warning/15 text-warning-foreground border-warning/30",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        map[status] ?? "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
