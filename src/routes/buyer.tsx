import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, LifeBuoy, Package, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/trust/StatCard";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { Timeline } from "@/components/trust/Timeline";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { Button } from "@/components/ui/button";
import { currency, fmtDate, timelineFor, useTrust } from "@/lib/store";

export const Route = createFileRoute("/buyer")({
  head: () => ({
    meta: [
      { title: "Buyer dashboard — TrustOS" },
      { name: "description", content: "Track escrow-protected orders, confirm delivery or open a dispute." },
      { property: "og:title", content: "Buyer dashboard — TrustOS" },
      { property: "og:description", content: "Track escrow-protected orders, confirm delivery or open a dispute." },
    ],
  }),
  component: BuyerDashboard,
});

function BuyerDashboard() {
  const { state, session, accountById, confirmDelivery } = useTrust();
  const buyer = session?.role === "buyer" ? session : state.accounts.find((a) => a.role === "buyer")!;
  const orders = state.transactions.filter((t) => t.buyerId === buyer.id);

  const pending = orders.filter((t) => !["Completed", "Refunded"].includes(t.status));
  const completed = orders.filter((t) => t.status === "Completed");
  const disputes = orders.filter((t) => t.status === "Disputed");
  const protectedAmount = orders
    .filter((t) => t.escrow === "locked")
    .reduce((s, t) => s + t.price, 0);

  return (
    <RoleShell
      role="buyer"
      title="My orders"
      subtitle={`${buyer.name} · Trust Score ${buyer.trustScore}/100`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders" value={String(orders.length)} icon={Package} />
        <StatCard label="In progress" value={String(pending.length)} icon={Truck} tone="warning" />
        <StatCard label="Completed" value={String(completed.length)} icon={CheckCircle2} tone="success" />
        <StatCard
          label="Protected by escrow"
          value={currency(protectedAmount)}
          icon={ShieldCheck}
          sub={`${disputes.length} open dispute(s)`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          {orders.length === 0 && (
            <div className="surface p-8 text-center text-sm text-muted-foreground">
              No orders yet. When a seller shares a Trust Link with you, it appears here.
            </div>
          )}
          {orders.map((t) => {
            const seller = accountById(t.sellerId);
            const carrier = accountById(t.deliveryId);
            return (
              <article key={t.id} className="surface p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold">{t.product}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {seller?.name} · {carrier?.name} · ETA {fmtDate(t.eta)}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="font-display text-lg font-semibold">{currency(t.price)}</span>
                  <span className="font-mono text-xs text-muted-foreground">#{t.id}</span>
                  <span className="text-xs text-muted-foreground">
                    Delivery stage · {t.deliveryStage}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/txn/$txnId" params={{ txnId: t.id }}>
                      Open transaction
                    </Link>
                  </Button>
                  {t.deliveryStage === "Delivered" && t.status === "Delivered" && (
                    <>
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          confirmDelivery(t.id);
                          toast.success("Delivery confirmed", {
                            description: "Escrow released to the seller.",
                          });
                        }}
                      >
                        <CheckCircle2 className="size-4" /> Confirm & release
                      </Button>
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <Link to="/dispute" search={{ txn: t.id }}>
                          <LifeBuoy className="size-4" /> Open dispute
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="surface flex flex-col items-center p-6">
            <TrustScoreRing score={buyer.trustScore} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Confirming deliveries on time raises your buyer score.
            </p>
          </div>

          {pending[0] ? (
            <div className="surface p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Latest order timeline
              </p>
              <p className="mt-1 font-display text-sm font-semibold">{pending[0].product}</p>
              <Timeline className="mt-4" steps={timelineFor(pending[0])} />
            </div>
          ) : null}
        </div>
      </div>
    </RoleShell>
  );
}
