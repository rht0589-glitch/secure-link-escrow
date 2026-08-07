import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Store, Truck, User, Wrench } from "lucide-react";
import { Logo, roleMeta } from "@/components/layout/DashboardLayout";
import { useTrust, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — TrustOS" },
      { name: "description", content: "Choose a demo workspace: buyer, seller, delivery or admin." },
      { property: "og:title", content: "Sign in — TrustOS" },
      { property: "og:description", content: "Choose a demo workspace: buyer, seller, delivery or admin." },
    ],
  }),
  component: LoginPage,
});

const roleIcon: Record<Role, typeof User> = {
  seller: Store,
  buyer: User,
  delivery: Truck,
  admin: Wrench,
};

const blurb: Record<Role, string> = {
  seller: "Create transactions, share Trust Links, ship and get paid from escrow.",
  buyer: "Pay into escrow, track delivery, confirm or open a dispute.",
  delivery: "Accept pickups, move parcels and report delivery outcomes.",
  admin: "Arbitrate disputes, release or refund escrow, monitor the platform.",
};

function LoginPage() {
  const { state, signIn } = useTrust();
  const navigate = useNavigate();

  const enter = (accountId: string, role: Role) => {
    signIn(accountId);
    navigate({ to: roleMeta[role].home });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <Logo />
        <div className="mt-8 max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Pick the account you want to sign in as
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every role has its own workspace, colour and permissions. The demo shares one live
            transaction ledger — an action taken by the seller shows up instantly for the buyer,
            the carrier and the admin.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {(["seller", "buyer", "delivery", "admin"] as Role[]).map((role) => {
            const Icon = roleIcon[role];
            const list = state.accounts.filter((a) => a.role === role);
            return (
              <section key={role} data-role={role} className="surface overflow-hidden">
                <div className="flex items-start gap-3 border-b border-border bg-role-soft p-5">
                  <span className="rounded-xl bg-role p-2 text-white">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-role">
                      {roleMeta[role].label}
                    </p>
                    <p className="text-xs text-muted-foreground">{blurb[role]}</p>
                  </div>
                </div>
                <ul className="divide-y divide-border">
                  {list.map((a) => (
                    <li key={a.id}>
                      <button
                        onClick={() => enter(a.id, role)}
                        className={cn(
                          "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-role-soft/60",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{a.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{a.email}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">
                          {a.trustScore}
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-role" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4" /> Demo environment — no real money moves, all data lives
          in your browser.
        </p>
      </div>
    </div>
  );
}
