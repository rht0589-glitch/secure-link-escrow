import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Logo, roleMeta } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTrust, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — TrustOS" },
      { name: "description", content: "Join TrustOS as a buyer, seller, delivery company or admin." },
      { property: "og:title", content: "Create account — TrustOS" },
      { property: "og:description", content: "Join TrustOS as a buyer, seller, delivery company or admin." },
    ],
  }),
  component: RegisterPage,
});

const roles: Role[] = ["buyer", "seller", "delivery", "admin"];

function RegisterPage() {
  const [role, setRole] = useState<Role>("buyer");
  const { state, signIn } = useTrust();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/40" data-role={role}>
      <div className="mx-auto max-w-lg px-4 py-12">
        <Logo />
        <div className="surface mt-8 p-6 md:p-8">
          <h1 className="font-display text-2xl font-semibold">Create your TrustOS account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a role — it decides which workspace you land in.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                data-role={r}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors",
                  role === r
                    ? "border-role bg-role-soft text-role"
                    : "border-border hover:bg-muted",
                )}
              >
                {roleMeta[r].label}
                <span className="block text-[11px] font-normal text-muted-foreground">
                  {roleMeta[r].workspace}
                </span>
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const demo = state.accounts.find((a) => a.role === role)!;
              signIn(demo.id);
              navigate({ to: roleMeta[role].home });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name / company</Label>
              <Input id="name" placeholder="Tech Store Tunisia" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full gap-2">
              Create account <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-role">
              Sign in
            </Link>
          </p>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4" /> Demo only — you are signed into a sample account.
        </p>
      </div>
    </div>
  );
}
