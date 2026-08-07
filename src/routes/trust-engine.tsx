import { createFileRoute } from "@tanstack/react-router";
import { Brain, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/trust/StatCard";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { useTrust, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trust-engine")({
  head: () => ({
    meta: [
      { title: "AI Trust Engine — TrustOS" },
      { name: "description", content: "Trust scores, risk categories and fraud probability explained." },
      { property: "og:title", content: "AI Trust Engine — TrustOS" },
      { property: "og:description", content: "Trust scores, risk categories and fraud probability explained." },
    ],
  }),
  component: TrustEngine,
});

const trustHistory = [
  { month: "Mar", buyer: 84, seller: 90 },
  { month: "Apr", buyer: 86, seller: 91 },
  { month: "May", buyer: 88, seller: 93 },
  { month: "Jun", buyer: 89, seller: 94 },
  { month: "Jul", buyer: 90, seller: 95 },
  { month: "Aug", buyer: 91, seller: 96 },
];

const riskCategories = [
  { name: "Identity", value: 96 },
  { name: "Payment", value: 92 },
  { name: "Delivery", value: 88 },
  { name: "Disputes", value: 79 },
  { name: "Behaviour", value: 94 },
];

const scoreReasons = [
  { label: "Completed Orders", delta: 15 },
  { label: "Fast Shipping", delta: 8 },
  { label: "Verified Identity", delta: 6 },
  { label: "Late Delivery", delta: -5 },
  { label: "Disputes", delta: -10 },
  { label: "Many Refunds", delta: -12 },
];

function TrustEngine() {
  const { state, session } = useTrust();
  const role: Role = session?.role ?? "seller";
  const seller = state.accounts.find((a) => a.role === "seller")!;
  const buyer = session?.role === "buyer" ? session : state.accounts.find((a) => a.role === "buyer")!;

  const disputed = state.transactions.filter((t) => t.status === "Disputed").length;
  const fraudProbability = Math.min(18, 2 + disputed * 4);
  const avgRisk = Math.round(
    state.transactions.reduce((s, t) => s + t.riskScore, 0) / (state.transactions.length || 1),
  );
  const riskLabel = avgRisk < 10 ? "Very Low" : avgRisk < 25 ? "Low" : avgRisk < 55 ? "Medium" : "High";

  return (
    <RoleShell role={role} title="AI Trust Engine" subtitle="Scores computed from live platform behaviour">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Buyer trust score" value={`${buyer.trustScore}/100`} icon={ShieldCheck} />
        <StatCard label="Seller trust score" value={`${seller.trustScore}/100`} icon={ShieldCheck} tone="success" />
        <StatCard label="Portfolio risk" value={riskLabel} icon={Brain} sub={`Index ${avgRisk}/100`} tone="warning" />
        <StatCard label="Fraud probability" value={`${fraudProbability}%`} icon={TrendingDown} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="surface p-6 lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Trust evolution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trustHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis domain={[70, 100]} tickLine={false} axisLine={false} width={40} className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="buyer" stroke="var(--color-success)" strokeWidth={2} />
                <Line type="monotone" dataKey="seller" stroke="var(--color-role)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface flex flex-col items-center justify-center p-6">
          <TrustScoreRing score={role === "buyer" ? buyer.trustScore : seller.trustScore} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Recommendation: <strong className="text-success">proceed with escrow</strong>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <h2 className="font-display text-base font-semibold">Risk categories</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskCategories} outerRadius="75%">
                <PolarGrid className="stroke-border" />
                <PolarAngleAxis dataKey="name" className="text-xs" />
                <Radar dataKey="value" stroke="var(--color-role)" fill="var(--color-role)" fillOpacity={0.25} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="font-display text-base font-semibold">Reasons affecting the score</h2>
          <ul className="mt-4 space-y-3">
            {scoreReasons.map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-4">
                <span className="text-sm">{r.label}</span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm font-semibold",
                    r.delta > 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {r.delta > 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                  {r.delta > 0 ? "+" : ""}
                  {r.delta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RoleShell>
  );
}
