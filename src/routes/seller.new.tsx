import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Copy, ImagePlus, Link2, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RoleShell } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currency, scoreRisk, useTrust } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller/new")({
  head: () => ({
    meta: [
      { title: "New transaction — TrustOS" },
      { name: "description", content: "Create an escrow-protected transaction and share a Trust Link." },
      { property: "og:title", content: "New transaction — TrustOS" },
      { property: "og:description", content: "Create an escrow-protected transaction and share a Trust Link." },
    ],
  }),
  component: NewTransaction,
});

function NewTransaction() {
  const { state, createTransaction } = useTrust();
  const navigate = useNavigate();
  const buyers = state.accounts.filter((a) => a.role === "buyer");
  const carriers = state.accounts.filter((a) => a.role === "delivery");
  const seller = state.accounts.find((a) => a.role === "seller")!;

  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [buyerId, setBuyerId] = useState(buyers[0]?.id ?? "");
  const [deliveryId, setDeliveryId] = useState(carriers[0]?.id ?? "");
  const [eta, setEta] = useState("");
  const [address, setAddress] = useState("");
  const [created, setCreated] = useState<string | null>(null);

  const buyer = state.accounts.find((a) => a.id === buyerId);
  const preview = useMemo(
    () => scoreRisk(Number(price) || 0, buyer?.trustScore ?? 80, seller.trustScore),
    [price, buyer, seller.trustScore],
  );

  const link = created ? `https://trustos.app/txn/${created}` : "";

  return (
    <RoleShell
      role="seller"
      title="Create transaction"
      subtitle="Generate a Trust Link and let the buyer pay into escrow"
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <form
          className="surface space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const txn = createTransaction({
              product,
              description,
              price: Number(price),
              buyerId,
              deliveryId,
              eta: eta ? new Date(eta).toISOString() : new Date(Date.now() + 5 * 86400000).toISOString(),
              address: address || buyer?.city || "Tunisia",
            });
            setCreated(txn.id);
            toast.success(`Trust Link ${txn.id} created`, {
              description: "Shared with the buyer — funds will be held by Gravv Escrow.",
            });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="product">Product name</Label>
            <Input
              id="product"
              required
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Apple Watch Series 9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Condition, warranty, what is included…"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (TND)</Label>
              <Input
                id="price"
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1299"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="eta">Estimated delivery</Label>
              <Input id="eta" type="date" value={eta} onChange={(e) => setEta(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Buyer</Label>
              <Select value={buyerId} onValueChange={setBuyerId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {buyers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} — {b.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Delivery company</Label>
              <Select value={deliveryId} onValueChange={setDeliveryId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {carriers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr">Delivery address</Label>
            <Input
              id="addr"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="14 Rue Habib Bourguiba, Sfax"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            <ImagePlus className="size-5 shrink-0" />
            Product images — drag & drop (demo placeholder)
          </div>

          <Button type="submit" size="lg" className="w-full gap-2">
            <Link2 className="size-4" /> Generate Trust Link
          </Button>
        </form>

        <div className="space-y-6">
          <div className="surface p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-role" /> AI pre-check
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Risk level</p>
            <p
              className={cn(
                "font-display text-2xl font-semibold",
                preview.risk === "High"
                  ? "text-destructive"
                  : preview.risk === "Medium"
                    ? "text-warning-foreground"
                    : "text-success",
              )}
            >
              {preview.risk}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-role" style={{ width: `${preview.riskScore}%` }} />
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Buyer trust score · {buyer?.trustScore ?? "—"}</li>
              <li>Seller trust score · {seller.trustScore}</li>
              <li>Amount exposure · {currency(Number(price) || 0)}</li>
            </ul>
          </div>

          <div className="surface p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="size-4 text-role" /> Trust Link
            </div>
            {created ? (
              <>
                <p className="mt-3 break-all rounded-xl bg-muted px-3 py-2 font-mono text-xs">{link}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      navigator.clipboard?.writeText(link);
                      toast.success("Copied");
                    }}
                  >
                    <Copy className="size-3.5" /> Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate({ to: "/txn/$txnId", params: { txnId: created } })}
                  >
                    Open buyer view
                  </Button>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                The secure link appears here once the transaction is created. Only the invited buyer
                can pay it.
              </p>
            )}
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
