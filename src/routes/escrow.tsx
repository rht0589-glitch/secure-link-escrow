import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Banknote, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/trust/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, escrowTotals, fmtTime, useTrust, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/escrow")({
  head: () => ({
    meta: [
      { title: "Gravv Escrow — TrustOS" },
      { name: "description", content: "See every dinar locked, released or refunded by Gravv Escrow." },
      { property: "og:title", content: "Gravv Escrow — TrustOS" },
      { property: "og:description", content: "See every dinar locked, released or refunded by Gravv Escrow." },
    ],
  }),
  component: EscrowPage,
});

const lifecycle = ["Buyer paid", "Money locked", "Waiting decision", "Release or refund"];

const typeLabel: Record<string, string> = {
  lock: "Locked",
  release: "Released",
  refund: "Refunded",
  "partial-refund": "Partial refund",
  fee: "Protection fee",
  withdraw: "Withdrawal",
};

function EscrowPage() {
  const { state, session } = useTrust();
  const role: Role = session?.role ?? "seller";
  const totals = escrowTotals(state);

  return (
    <RoleShell role={role} title="Gravv Escrow" subtitle="Payment lifecycle and live ledger">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Protected amount" value={currency(totals.protectedTotal)} icon={ShieldCheck} />
        <StatCard label="Currently locked" value={currency(totals.locked)} icon={Lock} tone="warning" />
        <StatCard label="Released" value={currency(totals.released)} icon={Banknote} tone="success" />
        <StatCard label="Refunded" value={currency(totals.refunded)} icon={RotateCcw} tone="destructive" />
      </div>

      <div className="surface mt-6 p-6">
        <h2 className="font-display text-base font-semibold">Payment lifecycle</h2>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {lifecycle.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="rounded-2xl border border-role/25 bg-role-soft px-4 py-3 text-sm font-medium text-role">
                {step}
              </div>
              {i < lifecycle.length - 1 && (
                <ArrowRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          TrustOS charges 2.5% at release only. Disputed transactions freeze the funds until an
          admin decision.
        </p>
      </div>

      <div className="surface mt-6 overflow-hidden">
        <h2 className="px-5 py-4 font-display text-base font-semibold">Live ledger</h2>
        <div className="max-h-[460px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movement</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>When</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.ledger.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{typeLabel[l.type]}</p>
                    <p className="text-xs text-muted-foreground">{l.note}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.txnId}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fmtTime(l.at)}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      l.type === "release" && "text-success",
                      (l.type === "refund" || l.type === "partial-refund") && "text-destructive",
                    )}
                  >
                    {currency(l.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </RoleShell>
  );
}
