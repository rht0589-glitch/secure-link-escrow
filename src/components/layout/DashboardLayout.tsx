import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Banknote,
  Bell,
  Brain,
  Check,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  Menu,
  Package,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { fmtTime, useTrust, type Role } from "@/lib/store";

export type NavItem = { label: string; to: string; icon: LucideIcon };

export const roleMeta: Record<
  Role,
  { label: string; workspace: string; home: string; nav: NavItem[] }
> = {
  seller: {
    label: "Seller",
    workspace: "Seller workspace",
    home: "/seller",
    nav: [
      { label: "Overview", to: "/seller", icon: LayoutDashboard },
      { label: "New Transaction", to: "/seller/new", icon: Receipt },
      { label: "Wallet", to: "/seller/wallet", icon: Wallet },
      { label: "AI Trust Engine", to: "/trust-engine", icon: Brain },
      { label: "Gravv Escrow", to: "/escrow", icon: ShieldCheck },
      { label: "Dispute Center", to: "/dispute", icon: LifeBuoy },
    ],
  },
  buyer: {
    label: "Buyer",
    workspace: "Buyer workspace",
    home: "/buyer",
    nav: [
      { label: "My Orders", to: "/buyer", icon: Package },
      { label: "AI Trust Engine", to: "/trust-engine", icon: Brain },
      { label: "Gravv Escrow", to: "/escrow", icon: ShieldCheck },
      { label: "Dispute Center", to: "/dispute", icon: LifeBuoy },
    ],
  },
  delivery: {
    label: "Delivery",
    workspace: "Carrier workspace",
    home: "/delivery",
    nav: [
      { label: "Dispatch board", to: "/delivery", icon: Truck },
      { label: "Gravv Escrow", to: "/escrow", icon: ShieldCheck },
      { label: "AI Trust Engine", to: "/trust-engine", icon: Brain },
    ],
  },
  admin: {
    label: "Admin",
    workspace: "Control room",
    home: "/admin",
    nav: [
      { label: "Overview", to: "/admin", icon: Banknote },
      { label: "Disputes", to: "/dispute", icon: LifeBuoy },
      { label: "Escrow ledger", to: "/escrow", icon: ShieldCheck },
      { label: "Trust Engine", to: "/trust-engine", icon: Brain },
      { label: "Users", to: "/admin", icon: Users },
    ],
  },
};

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <ShieldCheck className="size-4.5" />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">TrustOS</span>
    </Link>
  );
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.label + item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-role-soft text-role"
                : "text-muted-foreground hover:bg-role-soft/60 hover:text-role",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountSwitcher() {
  const { state, session, signIn } = useTrust();
  const navigate = useNavigate();
  if (!session) return null;
  const initials = session.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-left outline-none transition-shadow hover:shadow-soft">
          <Avatar className="size-7">
            <AvatarFallback className="bg-role-soft text-[11px] font-semibold text-role">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden leading-tight sm:block">
            <span className="block max-w-36 truncate text-xs font-semibold">{session.name}</span>
            <span className="block text-[10px] uppercase tracking-widest text-role">
              {roleMeta[session.role].label}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">
          Switch account
        </DropdownMenuLabel>
        {(["seller", "buyer", "delivery", "admin"] as Role[]).map((role) => (
          <div key={role} data-role={role}>
            <DropdownMenuLabel className="pt-2 text-[10px] font-semibold uppercase tracking-widest text-role">
              {roleMeta[role].label}
            </DropdownMenuLabel>
            {state.accounts
              .filter((a) => a.role === role)
              .map((a) => (
                <DropdownMenuItem
                  key={a.id}
                  onSelect={() => {
                    signIn(a.id);
                    navigate({ to: roleMeta[a.role].home });
                  }}
                  className="gap-2"
                >
                  <span className="size-1.5 rounded-full bg-role" />
                  <span className="flex-1 truncate text-sm">{a.name}</span>
                  {a.id === session.id ? <Check className="size-3.5 text-role" /> : null}
                </DropdownMenuItem>
              ))}
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/login">Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationBell({ role }: { role: Role }) {
  const { state } = useTrust();
  const items = state.notifications.filter((n) => n.audience.includes(role)).slice(0, 8);
  const tone = {
    info: "bg-primary",
    ok: "bg-success",
    warn: "bg-warning",
    bad: "bg-destructive",
  } as const;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4.5" />
          {items.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-role text-[9px] font-bold text-white">
              {items.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <p className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {roleMeta[role].label} inbox
        </p>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Nothing new right now.</p>
          ) : (
            items.map((n) => (
              <div key={n.id} className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", tone[n.tone])} />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.detail}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">{fmtTime(n.at)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function RoleShell({
  role,
  title,
  subtitle,
  actions,
  children,
}: {
  role: Role;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { session, hydrated, signIn, resetDemo, state } = useTrust();
  const navigate = useNavigate();

  // Demo convenience: land on a matching account instead of a dead end.
  useEffect(() => {
    if (!hydrated) return;
    if (!session || session.role !== role) {
      const match = state.accounts.find((a) => a.role === role);
      if (match) signIn(match.id);
    }
  }, [hydrated, session, role, state.accounts, signIn]);

  const meta = roleMeta[role];
  const account = session && session.role === role ? session : state.accounts.find((a) => a.role === role)!;

  return (
    <div data-role={role} className="min-h-screen bg-muted/40">
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-role" />

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Logo className="px-2 py-2" />
        <div className="mt-5 rounded-2xl border border-role/25 bg-role-soft p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-role">
            {meta.workspace}
          </p>
          <p className="mt-1 truncate text-sm font-semibold">{account.name}</p>
          <p className="truncate text-xs text-muted-foreground">{account.email}</p>
        </div>
        <div className="mt-4">
          <NavLinks items={meta.nav} />
        </div>
        <div className="mt-auto space-y-2">
          <button
            onClick={resetDemo}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-3.5" /> Reset demo data
          </button>
          <div className="rounded-2xl border border-sidebar-border bg-card p-4">
            <p className="text-xs font-medium">Escrow protection active</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Funds are held by Gravv Escrow until delivery confirmation.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" data-role={role} className="w-72 bg-sidebar p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo className="px-2 py-2" />
              <p className="mb-4 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-role">
                {meta.workspace}
              </p>
              <NavLinks items={meta.nav} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-role-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-role">
                <span className="size-1.5 rounded-full bg-role" />
                {meta.label}
              </span>
              <h1 className="truncate font-display text-base font-semibold">{title}</h1>
            </div>
            {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <NotificationBell role={role} />
            <AccountSwitcher />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export function TrustLinkPill({ id }: { id: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs">
      <Link2 className="size-3.5 text-role" />
      trustos.app/txn/{id}
    </span>
  );
}
