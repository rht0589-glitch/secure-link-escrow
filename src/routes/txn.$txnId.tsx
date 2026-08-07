import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, LifeBuoy, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { Timeline } from "@/components/trust/Timeline";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { Button } from "@/components/ui/button";
import { currency, fmtDate, timelineFor, useTrust } from "@/lib/store";

export const Route = createFileRoute("/txn/$txnId")({
  head: ({ params }) => ({
    meta: [
      { title: `Transaction ${params.txnId} — TrustOS` },
      { name: "description", content: "Escrow-protected transaction: seller, product, delivery and AI risk analysis." },
      { property: "og:title", content: `Transaction ${params.txnId} — TrustOS` },
      { property: "og:description", content: "Escrow-protected transaction with AI risk analysis." },
    ],
  }),
  component: TxnPage,
});

function TxnPage() {
  const { txnId } = Route.useParams();
  const { txnById, accountById, payTransaction, confirmDelivery } = useTrust();
  const t = txnById(txnId);

  if (!t) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold">Trust Link not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This transaction does not exist.</p>
          <Button asChild className="mt-4">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const seller = accountById(t.sellerId)!;
  const buyer = accountById(t.buyerId)!;
  const carrier = accountById(t.deliveryId)!;

  return (
    <div className="min-h-screen bg-muted/40" data-role="buyer">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Logo />
          <span className="font-mono text-xs text-muted-foreground">trustos.app/txn/{t.id}</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <section className="surface flex items-center gap-4 p-5">
              <TrustScoreRing score={seller.trustScore} size={96} label="Seller" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-display text-lg font-semibold">
                  {seller.name}
                  {seller.verified && <BadgeCheck className="size-4 text-success" />}
                </p>
                <p className="text-sm text-muted-foreground">{seller.city} · since {seller.since}</p>
                <p className="mt-1 text-xs text-muted-foreground">Buyer: {buyer.name} ({buyer.trustScore}/100)</p>
              </div>
            </section>

            <section className="surface p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <h1 className="truncate font-display text-xl font-semibold">{t.product}</h1>
                <StatusBadge status={t.status} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Price</p>
                  <p className="font-display text-2xl font-semibold">{currency(t.price)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Delivery</p>
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <Truck className="size-4" /> {carrier.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Arrives</p>
                  <p className="text-sm font-medium">{fmtDate(t.eta)}</p>
                </div>
              </div>
            </section>

            <section className="surface p-5">
              <h2 className="font-display text-base font-semibold">Transaction timeline</h2>
              <Timeline className="mt-4" steps={timelineFor(t)} />
            </section>
          </div>

          <div className="space-y-6">
            <section className="surface p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-role" /> AI risk analysis
              </p>
              <p className="mt-3 font-display text-2xl font-semibold text-success">{t.risk}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-role" style={{ width: `${t.riskScore}%` }} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Recommendation: safe to proceed with escrow protection.
              </p>
            </section>

            <section className="surface p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-role" /> Gravv Escrow
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Payment is held, not sent to the seller.</li>
                <li>Money is released only after you confirm delivery.</li>
                <li>Full refund if the item never arrives.</li>
              </ul>

              {t.status === "Waiting Payment" && (
                <Button
                  size="lg"
                  className="mt-4 w-full"
                  onClick={() => {
                    payTransaction(t.id);
                    toast.success("Payment locked in escrow", {
                      description: `${currency(t.price)} protected by Gravv.`,
                    });
                  }}
                >
                  Pay securely with Gravv
                </Button>
              )}
              {t.escrow === "locked" && t.status !== "Waiting Payment" && (
                <p className="mt-4 rounded-xl bg-role-soft px-3 py-2 text-sm font-medium text-role">
                  {currency(t.price)} locked in escrow
                </p>
              )}
              {t.status === "Delivered" && (
                <div className="mt-3 space-y-2">
                  <Button
                    className="w-full gap-1.5"
                    onClick={() => {
                      confirmDelivery(t.id);
                      toast.success("Escrow released to seller");
                    }}
                  >
                    <CheckCircle2 className="size-4" /> Confirm delivery
                  </Button>
                  <Button asChild variant="outline" className="w-full gap-1.5">
                    <Link to="/dispute" search={{ txn: t.id }}>
                      <LifeBuoy className="size-4" /> Open dispute
                    </Link>
                  </Button>
                </div>
              )}
              {t.status === "Completed" && (
                <p className="mt-4 text-sm font-medium text-success">Completed — funds released.</p>
              )}
              {t.status === "Refunded" && (
                <p className="mt-4 text-sm font-medium text-destructive">Refunded to the buyer.</p>
              )}
            </section>

            <Button asChild variant="ghost" className="w-full">
              <Link to="/buyer">Go to buyer dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
