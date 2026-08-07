import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, Clock, Landmark, Percent, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/trust/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, fmtTime, PLATFORM_FEE, sellerWallet, useTrust } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller/wallet")({
  head: () => ({
    meta: [
      { title: "Seller wallet — TrustOS" },
      { name: "description", content: "Escrow balance, released payouts and withdrawal history." },
      { property: "og:title", content: "Seller wallet — TrustOS" },
      { property: "og:description", content: "Escrow balance, released payouts and withdrawal history." },
    ],
  }),
  component: SellerWallet,
});

const typeLabel: Record<string, string> = {
  lock: "Locked in escrow",
  release: "Released to seller",
  refund: "Refunded to buyer",
  "partial-refund": "Partial refund",
  fee: "Protection fee",
  withdraw: "Withdrawal",
};

function SellerWallet() {
  const { state, withdraw } = useTrust();
  const wallet = sellerWallet(state);
  const [amount, setAmount] = useState("");

  return (
    <RoleShell role="seller" title="Wallet" subtitle="Money held, released and withdrawn">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending in escrow"
          value={currency(wallet.pending)}
          icon={Clock}
          tone="warning"
          sub="Unlocks on buyer confirmation"
        />
        <StatCard
          label="Available balance"
          value={currency(Math.max(0, wallet.available))}
          icon={Wallet}
          tone="success"
          sub="Ready to withdraw"
        />
        <StatCard label="Total released" value={currency(wallet.released)} icon={Landmark} />
        <StatCard
          label="Protection fee"
          value={`${(PLATFORM_FEE * 100).toFixed(1)}%`}
          icon={Percent}
          sub="Charged on release only"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.7fr]">
        <div className="surface p-6">
          <h2 className="font-display text-base font-semibold">Withdraw</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Payout to Banque Zitouna ••4417 · arrives in 1 business day.
          </p>
          <div className="mt-4 flex gap-2">
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              className="gap-1.5"
              onClick={() => {
                const n = Number(amount);
                if (!n || n <= 0) {
                  toast.error("Enter an amount");
                  return;
                }
                if (n > wallet.available) {
                  toast.error("Amount exceeds available balance");
                  return;
                }
                withdraw(n);
                setAmount("");
                toast.success(`${currency(n)} withdrawal requested`);
              }}
            >
              <ArrowDownToLine className="size-4" /> Withdraw
            </Button>
          </div>
          <button
            className="mt-3 text-xs font-medium text-role"
            onClick={() => setAmount(String(Math.floor(Math.max(0, wallet.available))))}
          >
            Use full available balance
          </button>
        </div>

        <div className="surface overflow-hidden">
          <h2 className="px-5 py-4 font-display text-base font-semibold">Escrow ledger</h2>
          <div className="max-h-[420px] overflow-auto">
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
                        (l.type === "refund" || l.type === "partial-refund" || l.type === "fee") &&
                          "text-destructive",
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
      </div>
    </RoleShell>
  );
}
