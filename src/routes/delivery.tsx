import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, PackageCheck, PackageX, Truck } from "lucide-react";
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
import { currency, fmtDate, useTrust, type DeliveryStage } from "@/lib/store";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery dashboard — TrustOS" },
      { name: "description", content: "Accept pickups, move parcels and report delivery outcomes." },
      { property: "og:title", content: "Delivery dashboard — TrustOS" },
      { property: "og:description", content: "Accept pickups, move parcels and report delivery outcomes." },
    ],
  }),
  component: DeliveryDashboard,
});

const nextStage: Partial<Record<DeliveryStage, DeliveryStage>> = {
  "Waiting Pickup": "Picked Up",
  "Picked Up": "In Transit",
  "In Transit": "Out for Delivery",
  "Out for Delivery": "Delivered",
};

function DeliveryDashboard() {
  const { state, session, accountById, setDeliveryStage } = useTrust();
  const carrier =
    session?.role === "delivery" ? session : state.accounts.find((a) => a.role === "delivery")!;
  const jobs = state.transactions.filter(
    (t) => t.deliveryId === carrier.id && t.escrow !== "none",
  );

  const delivered = jobs.filter((t) => t.deliveryStage === "Delivered");
  const active = jobs.filter(
    (t) => !["Delivered", "Failed", "Not Started"].includes(t.deliveryStage),
  );
  const failed = jobs.filter((t) => t.deliveryStage === "Failed");

  return (
    <RoleShell
      role="delivery"
      title="Dispatch board"
      subtitle={`${carrier.name} · only parcels paid into escrow appear here`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active jobs" value={String(active.length)} icon={Truck} />
        <StatCard label="Delivered" value={String(delivered.length)} icon={PackageCheck} tone="success" />
        <StatCard label="Waiting pickup" value={String(jobs.filter((t) => t.deliveryStage === "Waiting Pickup").length)} icon={PackageCheck} tone="warning" />
        <StatCard label="Failed" value={String(failed.length)} icon={PackageX} tone="destructive" />
      </div>

      <div className="surface mt-6 overflow-hidden">
        <h2 className="px-5 py-4 font-display text-base font-semibold">Assigned parcels</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No parcels assigned to {carrier.name} yet.
                  </TableCell>
                </TableRow>
              )}
              {jobs.map((t) => {
                const next = nextStage[t.deliveryStage];
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="font-mono text-xs">{t.id}</p>
                      <p className="max-w-40 truncate text-xs text-muted-foreground">{t.product}</p>
                    </TableCell>
                    <TableCell className="text-sm">{accountById(t.sellerId)?.name}</TableCell>
                    <TableCell className="text-sm">{accountById(t.buyerId)?.name}</TableCell>
                    <TableCell className="max-w-52 truncate text-sm text-muted-foreground">
                      {t.address}
                    </TableCell>
                    <TableCell className="text-sm">{currency(t.price)}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.deliveryStage} />
                      <p className="mt-1 text-[11px] text-muted-foreground">ETA {fmtDate(t.eta)}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {next && (
                          <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={() => {
                              setDeliveryStage(t.id, next);
                              toast.success(`${t.id} → ${next}`);
                            }}
                          >
                            <CheckCircle2 className="size-3.5" /> {next}
                          </Button>
                        )}
                        {t.deliveryStage !== "Delivered" && t.deliveryStage !== "Failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setDeliveryStage(t.id, "Failed");
                              toast.error(`${t.id} marked failed`);
                            }}
                          >
                            Failed
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="surface mt-6 p-6">
        <h2 className="font-display text-base font-semibold">Carrier activity</h2>
        <ol className="mt-4 space-y-3">
          {state.transactions
            .filter((t) => t.deliveryId === carrier.id)
            .flatMap((t) => t.events.filter((e) => e.actor === "delivery").map((e) => ({ ...e, txn: t.id })))
            .sort((a, b) => b.at.localeCompare(a.at))
            .slice(0, 8)
            .map((e) => (
              <li key={e.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-role" />
                <div>
                  <p className="font-medium">
                    {e.title} <span className="font-mono text-xs text-muted-foreground">{e.txn}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{e.detail}</p>
                </div>
              </li>
            ))}
        </ol>
      </div>
    </RoleShell>
  );
}
