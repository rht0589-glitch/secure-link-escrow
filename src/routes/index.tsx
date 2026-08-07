import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Banknote,
  Brain,
  Check,
  CheckCircle2,
  FileSearch,
  Gavel,
  Link2,
  Lock,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/layout/DashboardLayout";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { StatusBadge } from "@/components/trust/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustOS — AI-Powered Trust & Escrow Platform" },
      {
        name: "description",
        content:
          "TrustOS secures online transactions with AI Trust Scores, Gravv Escrow protection, delivery tracking and fair dispute resolution.",
      },
      { property: "og:title", content: "TrustOS — AI-Powered Trust & Escrow Platform" },
      {
        property: "og:description",
        content:
          "Secure online transactions with AI Trust Scores and Escrow Protection. Money is released only after confirmed delivery.",
      },
    ],
  }),
  component: Landing,
});

const flow = [
  { label: "Buyer", icon: User },
  { label: "TrustOS", icon: ShieldCheck },
  { label: "Gravv Escrow", icon: Lock },
  { label: "Seller", icon: Store },
  { label: "Delivery", icon: Truck },
  { label: "Confirmation", icon: PackageCheck },
  { label: "Release Payment", icon: Banknote },
];

const features = [
  {
    icon: Link2,
    title: "Trust Links",
    text: "A seller creates a transaction and shares one secure link. No catalog, no storefront — just a protected deal.",
  },
  {
    icon: Brain,
    title: "AI Trust Score",
    text: "Every buyer and seller carries a live 0–100 score built from history, delivery speed, refunds and disputes.",
  },
  {
    icon: Lock,
    title: "Gravv Escrow",
    text: "Payment is locked the moment the buyer pays and only leaves escrow after delivery is confirmed.",
  },
  {
    icon: Truck,
    title: "Delivery Tracking",
    text: "Carriers update pickup, transit and delivery states directly on the transaction timeline.",
  },
  {
    icon: FileSearch,
    title: "AI Risk Analysis",
    text: "Before payment, TrustOS scores fraud probability and recommends whether to proceed.",
  },
  {
    icon: Gavel,
    title: "Dispute Resolution",
    text: "Evidence upload, AI evidence review and an admin decision: refund, partial refund or release.",
  },
];

const steps = [
  { n: "01", t: "Seller creates a transaction", d: "Product, price, carrier and buyer email in under a minute." },
  { n: "02", t: "Buyer opens the Trust Link", d: "Seller identity, trust score and AI risk analysis shown upfront." },
  { n: "03", t: "Money locks in Gravv Escrow", d: "Funds are held by TrustOS, never by the seller." },
  { n: "04", t: "Delivery is tracked", d: "Pickup, transit, out for delivery, delivered." },
  { n: "05", t: "Buyer confirms", d: "Or opens a dispute within the protection window." },
  { n: "06", t: "Payment released", d: "Seller is paid, both trust scores are updated." },
];

const pricing = [
  {
    name: "Starter",
    price: "0",
    note: "per month",
    bullets: ["Up to 10 transactions / month", "2.9% escrow fee", "Basic trust score", "Email support"],
  },
  {
    name: "Business",
    price: "89",
    note: "TND per month",
    featured: true,
    bullets: [
      "Unlimited transactions",
      "1.9% escrow fee",
      "Full AI risk analysis",
      "Priority dispute handling",
      "Carrier integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "annual contract",
    bullets: ["Custom escrow terms", "Dedicated trust analyst", "API & webhooks", "SLA 99.9%"],
  },
];

const faqs = [
  {
    q: "Is TrustOS a marketplace?",
    a: "No. There is no catalog and no storefront. TrustOS sits between a buyer and a seller who already agreed on a deal, and protects the money and the delivery.",
  },
  {
    q: "When does the seller get paid?",
    a: "Only after the buyer confirms delivery, or automatically after the protection window closes with no dispute opened.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "The AI engine weighs completed orders, shipping speed, refund rate, late deliveries, dispute outcomes and identity verification into a live 0–100 score.",
  },
  {
    q: "What happens if the product never arrives?",
    a: "The buyer opens a dispute with evidence. The AI reviews it and recommends refund, partial refund or rejection, then an admin makes the final call.",
  },
  {
    q: "Which carriers are supported?",
    a: "FastExpress, Aramex TN and Colissimo TN in the demo, with a generic carrier API for anything else.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#trust" className="transition-colors hover:text-foreground">Trust Score</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 md:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-accent-foreground">
                <Sparkles className="size-3.5" /> The Operating System for Commerce Trust
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
                AI-Powered Trust &amp; Escrow Platform
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Secure online transactions with AI Trust Scores and Escrow Protection.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/seller/new">
                    Create Transaction <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/txn/$txnId" params={{ txnId: "8A93DK" }}>
                    Explore Demo
                  </Link>
                </Button>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {[
                  ["128 400 TND", "Protected today"],
                  ["98.4%", "Success rate"],
                  ["1.2%", "Dispute rate"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-xl font-semibold">{v}</dt>
                    <dd className="text-xs text-muted-foreground">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="surface relative p-6 shadow-lift">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Transaction lifecycle
                </p>
                <StatusBadge status="Delivered" />
              </div>
              <ol className="mt-5 space-y-2">
                {flow.map((s, i) => (
                  <li key={s.label} className="relative">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-3 py-2.5">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <s.icon className="size-4" />
                      </span>
                      <span className="text-sm font-medium">{s.label}</span>
                      {i === flow.length - 1 ? (
                        <CheckCircle2 className="ml-auto size-4 text-success" />
                      ) : null}
                    </div>
                    {i < flow.length - 1 ? (
                      <div className="ml-7 h-3 w-px bg-primary/30" />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Everything a deal needs to be safe
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            TrustOS replaces blind bank transfers and cash on delivery with a verifiable,
            AI-supervised process.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="surface p-6 transition-shadow hover:shadow-lift">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border p-6">
                <span className="font-display text-sm font-semibold text-primary">{s.n}</span>
                <h3 className="mt-2 font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="border-y border-border bg-muted/40 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              A trust score you can actually read
            </h2>
            <p className="mt-3 text-muted-foreground">
              Each score is explainable. Buyers see exactly why a seller is rated 96/100 before
              sending a single dinar.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { l: "Completed Orders", d: "+15" },
                { l: "Fast Shipping", d: "+8" },
                { l: "Late Delivery", d: "−5" },
                { l: "Disputes", d: "−10" },
                { l: "Many Refunds", d: "−12" },
              ].map(({ l, d }) => (
                <li
                  key={l}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <span>{l}</span>
                  <span
                    className={
                      d.startsWith("+")
                        ? "font-semibold text-success"
                        : "font-semibold text-destructive"
                    }
                  >
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-around">
            <div className="text-center">
              <TrustScoreRing score={96} label="Seller" />
              <p className="mt-3 text-sm font-medium">Tech Store Tunisia</p>
            </div>
            <div className="text-center">
              <TrustScoreRing score={91} label="Buyer" />
              <p className="mt-3 text-sm font-medium">Ahmed Ben Ali</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3">
          {[
            {
              icon: Lock,
              t: "Escrow",
              d: "Funds sit in Gravv Escrow, visible to both parties, released only on confirmation.",
              to: "/escrow" as const,
              cta: "See escrow lifecycle",
            },
            {
              icon: Gavel,
              t: "Dispute Resolution",
              d: "Structured evidence, AI recommendation, human decision — usually within 48 hours.",
              to: "/dispute" as const,
              cta: "Open a case view",
            },
            {
              icon: Brain,
              t: "AI Protection",
              d: "Fraud probability, risk category breakdown and live monitoring on every deal.",
              to: "/trust-engine" as const,
              cta: "Explore the engine",
            },
          ].map((c) => (
            <div key={c.t} className="surface flex flex-col p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{c.t}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.d}</p>
              <Button variant="link" className="mt-3 self-start px-0" asChild>
                <Link to={c.to}>
                  {c.cta} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Pricing</h2>
          <p className="mt-3 text-muted-foreground">Escrow fees only when a deal completes.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.name}
                className={
                  p.featured
                    ? "relative rounded-2xl border-2 border-primary bg-card p-7 shadow-lift"
                    : "surface p-7"
                }
              >
                {p.featured ? (
                  <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                    Most popular
                  </span>
                ) : null}
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-3 font-display text-3xl font-semibold">{p.price}</p>
                <p className="text-xs text-muted-foreground">{p.note}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={p.featured ? "default" : "outline"}
                  asChild
                >
                  <Link to="/register">Choose {p.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">FAQ</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/40 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              TrustOS — the operating system for commerce trust. Escrow, AI trust scoring and
              dispute resolution for online deals.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <Link to="/seller" className="hover:text-foreground">Seller</Link>
            <Link to="/buyer" className="hover:text-foreground">Buyer</Link>
            <Link to="/delivery" className="hover:text-foreground">Delivery</Link>
            <Link to="/admin" className="hover:text-foreground">Admin</Link>
            <Link to="/trust-engine" className="hover:text-foreground">Trust Engine</Link>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl px-4 text-xs text-muted-foreground">
          © 2026 TrustOS. Demo product with mock data.
        </p>
      </footer>
    </div>
  );
}
