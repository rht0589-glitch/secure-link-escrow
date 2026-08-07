import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Gavel, ShieldCheck, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/trust/StatCard";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currency, escrowTotals, fmtTime, useTrust } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin control room — TrustOS" },
      { name: "description", content: "Arbitrate disputes, release or refund escrow and monitor platform health." },
      { property: "og:title", content: "Admin control room — TrustOS" },
      { property: "og:description", content: "Arbitrate disputes, release or refund escrow and monitor platform health." },
    ],
  }),
  component: AdminDashboard,
});

const trustHistory = [
  { month: "Mar", buyers: 84, sellers: 90 },
  { month: "Apr", buyers: 86, sellers: 91 },
  { month: "May", buyers: 88, sellers: 93 },
  { month: "Jun", buyers: 89, sellers: 94 },
  { month: "Jul", buyers: 90, sellers: 95 },
  { month: "Aug", buyers: 91, sellers: 96 },
];

function AdminDashboard() {
  const { state, accountById, resolveDispute } = useTrust();
  const totals = escrowTotals(state);
  const disputes = state.transactions.filter((t) => t.dispute);
  const openDisputes = disputes.filter((t) => t.dispute?.status === "Waiting Admin");

  const volume = (() => {
    const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const base = [
      { locked: 42000, released: 33800 },
      { locked: 51500, released: 44100 },
      { locked: 47800, released: 46200 },
      { locked: 63400, released: 51900 },
      { locked: 78100, released: 66700 },
      { locked: 0, released: 0 },
    ];
    return months.map((m, i) => {
      const b = base[i]!;
      const isLast = i === months.length - 1;
      return {
        month: m,
        locked: isLast ? totals.locked : b.locked,
        released: isLast ? totals.released : b.released,
      };
    });
  })();

  const activity = state.transactions
    .flatMap((t) => t.events.map((e) => ({ ...e, txn: t.id })))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 12);

  return (
    <RoleShell
      role="admin"
      title="Control room"
      subtitle="Full visibility on users, escrow and disputes"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={String(state.accounts.length)} icon={Users} />
        <StatCard label="Transactions" value={String(state.transactions.length)} icon={ShieldCheck} />
        <StatCard
          label="Value protected"
          value={currency(totals.protectedTotal)}
          icon={Banknote}
          tone="success"
        />
        <StatCard
          label="Open disputes"
          value={String(openDisputes.length)}
          icon={Gavel}
          tone={openDisputes.length ? "destructive" : "default"}
          sub={`${currency(totals.waitingDecision)} awaiting decision`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <h2 className="font-display text-base font-semibold">Escrow volume</h2>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volume}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} width={54} className="text-xs" />
                <Tooltip formatter={(v: number) => currency(v)} />
                <Legend />
                <Bar dataKey="locked" fill="var(--color-role)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="released" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface p-6">
          <h2 className="font-display text-base font-semibold">Average trust scores</h2>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trustHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis domain={[70, 100]} tickLine={false} axisLine={false} width={40} className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="buyers" stroke="var(--color-success)" strokeWidth={2} />
                <Line type="monotone" dataKey="sellers" stroke="var(--color-role)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Tabs defaultValue="disputes" className="mt-6">
        <TabsList>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="disputes" className="mt-4 space-y-4">
          {disputes.length === 0 && (
            <div className="surface p-8 text-center text-sm text-muted-foreground">
              No disputes on the platform.
            </div>
          )}
          {disputes.map((t) => (
            <div key={t.id} className="surface p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold">
                    {t.product} · <span className="font-mono text-sm">{t.id}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {accountById(t.buyerId)?.name} vs {accountById(t.sellerId)?.name} ·{" "}
                    {currency(t.price)} held
                  </p>
                </div>
                <StatusBadge status={t.dispute?.status ?? "Waiting Admin"} />
              </div>
              <p className="mt-3 rounded-xl bg-muted p-3 text-sm">{t.dispute?.description}</p>
              <p className="mt-3 text-sm">
                <span className="font-medium">AI recommendation:</span>{" "}
                <span className="text-role">{t.dispute?.aiRecommendation}</span>{" "}
                <span className="text-muted-foreground">({t.dispute?.aiConfidence}% confidence)</span>
              </p>
              {t.dispute?.status === "Waiting Admin" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      resolveDispute(t.id, "Refunded");
                      toast.success(`${t.id} fully refunded to buyer`);
                    }}
                  >
                    Refund buyer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      resolveDispute(t.id, "Partially Refunded");
                      toast.success(`${t.id} partially refunded`);
                    }}
                  >
                    Partial refund (50%)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      resolveDispute(t.id, "Rejected");
                      toast.success(`${t.id} released to seller`);
                    }}
                  >
                    Reject & release to seller
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/dispute" search={{ txn: t.id }}>
                      Open case file
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-success">
                  Resolved — {t.dispute?.resolution} on {fmtTime(t.dispute?.resolvedAt ?? t.createdAt)}
                </p>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <div className="surface overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Parties</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Escrow</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="max-w-44 truncate">{t.product}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {accountById(t.buyerId)?.name} ← {accountById(t.sellerId)?.name}
                    </TableCell>
                    <TableCell>{currency(t.price)}</TableCell>
                    <TableCell className="capitalize">{t.escrow}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="surface overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Trust score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Member since</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.accounts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </TableCell>
                    <TableCell className="capitalize">{a.role}</TableCell>
                    <TableCell>{a.trustScore}</TableCell>
                    <TableCell>
                      <StatusBadge status={a.verified ? "Verified" : "Under review"} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{a.since}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="surface p-6">
            <ol className="space-y-3">
              {activity.map((e) => (
                <li key={e.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-role" />
                  <div className="min-w-0">
                    <p className="font-medium">
                      {e.title}{" "}
                      <span className="font-mono text-xs text-muted-foreground">{e.txn}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.detail ? `${e.detail} · ` : ""}
                      {e.actor} · {fmtTime(e.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </RoleShell>
  );
}
