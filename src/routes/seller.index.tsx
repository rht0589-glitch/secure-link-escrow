import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Copy,
  Package,
  Plus,
  ShieldCheck,
  Truck,
  Wallet as WalletIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/trust/StatCard";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, fmtDate, sellerWallet, useTrust } from "@/lib/store";

export const Route = createFileRoute("/seller/")({
  head: () => ({
    meta: [
      { title: "Seller dashboard — TrustOS" },
      { name: "description", content: "Track escrow balance, Trust Links, shipments and payouts." },
      { property: "og:title", content: "Seller dashboard — TrustOS" },
      { property: "og:description", content: "Track escrow balance, Trust Links, shipments and payouts." },
    ],
  }),
  component: SellerDashboard,
});

function SellerDashboard() {
  const { state, session, accountById, shipTransaction } = useTrust();
  const seller = session?.role === "seller" ? session : state.accounts.find((a) => a.role === "seller")!;
  const txns = state.transactions.filter((t) => t.sellerId === seller.id);
  const wallet = sellerWallet(state);

  const pendingPayment = txns.filter((t) => t.status === "Waiting Payment");
  const completed = txns.filter((t) => t.status === "Completed");
  const successRate = txns.length ? Math.round((completed.length / txns.length) * 100) : 0;

  const revenueByMonth = (() => {
    const buckets = new Map<string, number>();
    state.ledger
      .filter((l) => l.type === "release")
      .forEach((l) => {
        const k = new Date(l.at).toLocaleDateString("en-GB", { month: "short" });
        buckets.set(k, (buckets.get(k) ?? 0) + l.amount);
      });
    const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const base = [11200, 15400, 17800, 21100, 25600, 0];
    return months.map((m, i) => ({
      month: m,
      revenue: Math.round((base[i] ?? 0) + (buckets.get(m) ?? 0)),
    }));
  })();

  return (
    <RoleShell
      role="seller"
      title="Seller overview"
      subtitle={`${seller.name} · Trust Score ${seller.trustScore}/100`}
      actions={
        <Button asChild size="sm" className="gap-1.5">
          <Link to="/seller/new">
            <Plus className="size-4" /> Create transaction
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total transactions" value={String(txns.length)} icon={Package} sub={`${completed.length} completed`} />
        <StatCard
          label="Pending payments"
          value={String(pendingPayment.length)}
          icon={ShieldCheck}
          tone="warning"
          sub={`${currency(pendingPayment.reduce((s, t) => s + t.price, 0))} awaiting buyers`}
        />
        <StatCard
          label="Escrow balance"
          value={currency(wallet.pending)}
          icon={WalletIcon}
          tone="success"
          sub="Released after buyer confirmation"
        />
        <StatCard label="Success rate" value={`${successRate}%`} icon={ArrowUpRight} sub="Completed vs total" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="surface p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-base font-semibold">Released revenue</h2>
            <span className="text-xs text-muted-foreground">Net of 2.5% protection fee</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-role)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-role)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} width={54} className="text-xs" />
                <Tooltip formatter={(v: number) => currency(v)} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-role)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface flex flex-col items-center justify-center p-6">
          <TrustScoreRing score={seller.trustScore} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Verified seller since {seller.since}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/trust-engine">See score breakdown</Link>
          </Button>
        </div>
      </div>

      <div className="surface mt-6 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-display text-base font-semibold">Recent transactions</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/seller/wallet">Wallet</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txns.map((t) => {
                const buyer = accountById(t.buyerId);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="max-w-52 truncate font-medium">{t.product}</TableCell>
                    <TableCell className="text-muted-foreground">{buyer?.name}</TableCell>
                    <TableCell>{currency(t.price)}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {t.status === "Waiting Payment" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => {
                              navigator.clipboard?.writeText(`https://trustos.app/txn/${t.id}`);
                              toast.success("Trust Link copied", { description: `trustos.app/txn/${t.id}` });
                            }}
                          >
                            <Copy className="size-3.5" /> Link
                          </Button>
                        )}
                        {t.status === "Paid" && (
                          <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={() => {
                              shipTransaction(t.id);
                              toast.success(`${t.id} handed to carrier`);
                            }}
                          >
                            <Truck className="size-3.5" /> Ship
                          </Button>
                        )}
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/txn/$txnId" params={{ txnId: t.id }}>
                            Open
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Last update {fmtDate(new Date().toISOString())} · actions here are visible instantly in the
          buyer, delivery and admin workspaces.
        </p>
      </div>
    </RoleShell>
  );
}
