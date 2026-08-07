import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Gavel, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currency, fmtTime, useTrust, type DisputeReason, type Role } from "@/lib/store";

export const Route = createFileRoute("/dispute")({
  validateSearch: (s: Record<string, unknown>) => ({ txn: typeof s["txn"] === "string" ? s["txn"] : undefined }),
  head: () => ({
    meta: [
      { title: "Dispute center — TrustOS" },
      { name: "description", content: "File evidence, read the AI analysis and follow the arbitration decision." },
      { property: "og:title", content: "Dispute center — TrustOS" },
      { property: "og:description", content: "File evidence, read the AI analysis and follow the arbitration decision." },
    ],
  }),
  component: DisputePage,
});

const reasons: DisputeReason[] = ["Wrong Product", "Damaged", "Not Delivered", "Counterfeit"];

function DisputePage() {
  const { txn } = Route.useSearch();
  const { state, session, accountById, openDispute, resolveDispute } = useTrust();
  const role: Role = session?.role ?? "buyer";

  const [reason, setReason] = useState<DisputeReason>("Damaged");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [target, setTarget] = useState(txn ?? "");

  const disputable = state.transactions.filter(
    (t) =>
      t.escrow === "locked" &&
      !t.dispute &&
      (role !== "buyer" || t.buyerId === session?.id),
  );
  const cases = state.transactions.filter(
    (t) => t.dispute && (role === "admin" || t.buyerId === session?.id || t.sellerId === session?.id),
  );

  return (
    <RoleShell
      role={role}
      title="Dispute center"
      subtitle={
        role === "admin"
          ? "Arbitrate open cases and move the escrowed money"
          : "Escrowed money stays locked while a case is open"
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {cases.length === 0 && (
            <div className="surface p-8 text-center text-sm text-muted-foreground">
              No dispute cases for this account.
            </div>
          )}
          {cases.map((t) => (
            <article key={t.id} className="surface p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold">{t.product}</p>
                  <p className="text-xs text-muted-foreground">
                    #{t.id} · {currency(t.price)} held · buyer {accountById(t.buyerId)?.name}
                  </p>
                </div>
                <StatusBadge status={t.dispute?.status ?? "Waiting Admin"} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 font-medium text-destructive">
                  {t.dispute?.reason}
                </span>
                <span className="text-muted-foreground">
                  Opened {fmtTime(t.dispute?.openedAt ?? t.createdAt)}
                </span>
              </div>

              <p className="mt-3 rounded-xl bg-muted p-3 text-sm">{t.dispute?.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(t.dispute?.evidence ?? []).map((f) => (
                  <span
                    key={f}
                    className="rounded-lg border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-role/25 bg-role-soft p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-role">
                  <Sparkles className="size-4" /> AI evidence analysis
                </p>
                <p className="mt-1 text-sm">
                  Recommendation: <strong>{t.dispute?.aiRecommendation}</strong> ·{" "}
                  {t.dispute?.aiConfidence}% confidence
                </p>
              </div>

              {role === "admin" && t.dispute?.status === "Waiting Admin" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => { resolveDispute(t.id, "Refunded"); toast.success("Buyer refunded"); }}>
                    <Gavel className="size-4" /> Refund buyer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { resolveDispute(t.id, "Partially Refunded"); toast.success("Partial refund issued"); }}>
                    Partial refund
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { resolveDispute(t.id, "Rejected"); toast.success("Released to seller"); }}>
                    Reject case
                  </Button>
                </div>
              )}
              {t.dispute?.status === "Resolved" && (
                <p className="mt-4 text-sm text-success">Decision: {t.dispute.resolution}</p>
              )}
            </article>
          ))}
        </div>

        {role === "buyer" && (
          <div className="surface h-fit p-6">
            <p className="flex items-center gap-2 font-display text-base font-semibold">
              <AlertTriangle className="size-4 text-role" /> Open a new dispute
            </p>
            <div className="mt-4 space-y-4">
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a transaction" />
                </SelectTrigger>
                <SelectContent>
                  {disputable.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.id} — {t.product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={reason} onValueChange={(v) => setReason(v as DisputeReason)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                rows={4}
                placeholder="Describe what went wrong…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={() => setEvidence((p) => [...p, `evidence_${p.length + 1}.jpg`])}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground hover:bg-muted"
              >
                <Upload className="size-4" /> Add photo evidence
              </button>
              {evidence.length > 0 && (
                <p className="text-xs text-muted-foreground">{evidence.join(", ")}</p>
              )}

              <Button
                className="w-full"
                onClick={() => {
                  if (!target) {
                    toast.error("Select a transaction");
                    return;
                  }
                  openDispute(target, { reason, description, evidence });
                  setDescription("");
                  setEvidence([]);
                  toast.success("Dispute filed — funds stay locked");
                }}
              >
                Submit dispute
              </Button>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
