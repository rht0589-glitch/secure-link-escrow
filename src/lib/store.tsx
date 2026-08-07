import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Role = "buyer" | "seller" | "delivery" | "admin";

export type Account = {
  id: string;
  role: Role;
  name: string;
  email: string;
  city: string;
  trustScore: number;
  verified: boolean;
  since: string;
};

export type TxnStatus =
  | "Waiting Payment"
  | "Paid"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Disputed"
  | "Refunded"
  | "Completed";

export type DeliveryStage =
  | "Not Started"
  | "Waiting Pickup"
  | "Picked Up"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Failed";

export type EscrowState = "none" | "locked" | "released" | "refunded";

export type TxnEvent = {
  id: string;
  at: string;
  actor: Role | "system";
  title: string;
  detail?: string | undefined;
};

export type DisputeReason =
  | "Wrong Product"
  | "Damaged"
  | "Not Delivered"
  | "Counterfeit";

export type Dispute = {
  reason: DisputeReason;
  description: string;
  evidence: string[];
  openedAt: string;
  aiRecommendation: "Refund" | "Partial Refund" | "Reject";
  aiConfidence: number;
  status: "Waiting Admin" | "Resolved";
  resolution?: "Refunded" | "Partially Refunded" | "Rejected" | undefined;
  resolvedAt?: string | undefined;
};

export type Transaction = {
  id: string;
  product: string;
  description: string;
  price: number;
  sellerId: string;
  buyerId: string;
  buyerEmail: string;
  deliveryId: string;
  address: string;
  eta: string;
  createdAt: string;
  status: TxnStatus;
  deliveryStage: DeliveryStage;
  escrow: EscrowState;
  risk: "Very Low" | "Low" | "Medium" | "High";
  riskScore: number;
  dispute?: Dispute | undefined;
  events: TxnEvent[];
};

export type LedgerEntry = {
  id: string;
  txnId: string;
  at: string;
  type: "lock" | "release" | "refund" | "fee" | "withdraw" | "partial-refund";
  amount: number;
  note: string;
};

export type Notification = {
  id: string;
  at: string;
  audience: Role[];
  title: string;
  detail: string;
  tone: "info" | "ok" | "warn" | "bad";
  txnId?: string | undefined;
};

export type State = {
  accounts: Account[];
  transactions: Transaction[];
  ledger: LedgerEntry[];
  notifications: Notification[];
  sessionId: string | null;
  withdrawn: number;
};

export const PLATFORM_FEE = 0.025;

export const currency = (n: number) =>
  `${Math.round(n).toLocaleString("en-US")} TND`;

const now = () => new Date().toISOString();
const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;
export const txnCode = () =>
  Array.from({ length: 6 }, () =>
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 32)),
  ).join("");

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ------------------------------------------------------------------ */
/* Seed                                                                */
/* ------------------------------------------------------------------ */

export const accounts: Account[] = [
  {
    id: "seller-1",
    role: "seller",
    name: "Tech Store Tunisia",
    email: "hello@techstore.tn",
    city: "Tunis, Tunisia",
    trustScore: 96,
    verified: true,
    since: "March 2022",
  },
  {
    id: "buyer-1",
    role: "buyer",
    name: "Ahmed Ben Ali",
    email: "ahmed.benali@gmail.com",
    city: "Sfax, Tunisia",
    trustScore: 91,
    verified: true,
    since: "January 2024",
  },
  {
    id: "buyer-2",
    role: "buyer",
    name: "Sarra Trabelsi",
    email: "sarra.t@outlook.com",
    city: "Tunis, Tunisia",
    trustScore: 88,
    verified: true,
    since: "May 2024",
  },
  {
    id: "buyer-3",
    role: "buyer",
    name: "Mariem Kefi",
    email: "mariem.kefi@gmail.com",
    city: "Monastir, Tunisia",
    trustScore: 74,
    verified: false,
    since: "June 2025",
  },
  {
    id: "delivery-1",
    role: "delivery",
    name: "FastExpress",
    email: "ops@fastexpress.tn",
    city: "Tunis, Tunisia",
    trustScore: 93,
    verified: true,
    since: "September 2023",
  },
  {
    id: "delivery-2",
    role: "delivery",
    name: "Aramex TN",
    email: "dispatch@aramex.tn",
    city: "Ariana, Tunisia",
    trustScore: 89,
    verified: true,
    since: "February 2023",
  },
  {
    id: "admin-1",
    role: "admin",
    name: "Leila Ben Youssef",
    email: "leila@trustos.app",
    city: "Tunis, Tunisia",
    trustScore: 100,
    verified: true,
    since: "January 2022",
  },
];

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600000).toISOString();

const ev = (
  at: string,
  actor: TxnEvent["actor"],
  title: string,
  detail?: string,
): TxnEvent => ({ id: uid("ev"), at, actor, title, detail });

function seedTransactions(): Transaction[] {
  return [
    {
      id: "8A93DK",
      product: "Apple Watch Series 9",
      description:
        "Apple Watch Series 9 GPS 45mm, Midnight Aluminium Case with Sport Band. Sealed box, 1 year local warranty, original invoice included.",
      price: 1299,
      sellerId: "seller-1",
      buyerId: "buyer-1",
      buyerEmail: "ahmed.benali@gmail.com",
      deliveryId: "delivery-1",
      address: "14 Rue Habib Bourguiba, Sfax",
      eta: daysAgo(-2),
      createdAt: daysAgo(4),
      status: "Delivered",
      deliveryStage: "Delivered",
      escrow: "locked",
      risk: "Very Low",
      riskScore: 4,
      events: [
        ev(daysAgo(4), "seller", "Transaction created", "Trust Link generated"),
        ev(daysAgo(4), "buyer", "Payment authorised", "1 299 TND via Gravv"),
        ev(daysAgo(4), "system", "Money locked in escrow"),
        ev(daysAgo(3), "seller", "Parcel handed to FastExpress"),
        ev(daysAgo(2), "delivery", "In transit", "Tunis hub → Sfax"),
        ev(hoursAgo(5), "delivery", "Delivered", "Signed by Ahmed Ben Ali"),
      ],
    },
    {
      id: "K23MZ1",
      product: 'MacBook Air M3 13"',
      description: "MacBook Air M3, 16GB / 512GB, Space Grey. Open box, as new.",
      price: 4890,
      sellerId: "seller-1",
      buyerId: "buyer-2",
      buyerEmail: "sarra.t@outlook.com",
      deliveryId: "delivery-2",
      address: "27 Av. de la Liberté, Tunis",
      eta: daysAgo(-4),
      createdAt: daysAgo(3),
      status: "Shipped",
      deliveryStage: "In Transit",
      escrow: "locked",
      risk: "Low",
      riskScore: 11,
      events: [
        ev(daysAgo(3), "seller", "Transaction created"),
        ev(daysAgo(3), "buyer", "Payment authorised", "4 890 TND via Gravv"),
        ev(daysAgo(3), "system", "Money locked in escrow"),
        ev(daysAgo(1), "seller", "Parcel handed to Aramex TN"),
        ev(hoursAgo(9), "delivery", "In transit"),
      ],
    },
    {
      id: "P7QX40",
      product: "Sony WH-1000XM5",
      description: "Noise cancelling headphones, sealed.",
      price: 1150,
      sellerId: "seller-1",
      buyerId: "buyer-1",
      buyerEmail: "ahmed.benali@gmail.com",
      deliveryId: "delivery-1",
      address: "5 Rue Ibn Khaldoun, Sousse",
      eta: daysAgo(-3),
      createdAt: daysAgo(2),
      status: "Paid",
      deliveryStage: "Waiting Pickup",
      escrow: "locked",
      risk: "Low",
      riskScore: 9,
      events: [
        ev(daysAgo(2), "seller", "Transaction created"),
        ev(hoursAgo(20), "buyer", "Payment authorised", "1 150 TND via Gravv"),
        ev(hoursAgo(20), "system", "Money locked in escrow"),
      ],
    },
    {
      id: "T51LWA",
      product: "iPhone 15 Pro 256GB",
      description: "Titanium Blue, battery 100%, with box and accessories.",
      price: 3750,
      sellerId: "seller-1",
      buyerId: "buyer-2",
      buyerEmail: "sarra.t@outlook.com",
      deliveryId: "delivery-2",
      address: "88 Rue de Carthage, Ariana",
      eta: daysAgo(-6),
      createdAt: hoursAgo(6),
      status: "Waiting Payment",
      deliveryStage: "Not Started",
      escrow: "none",
      risk: "Low",
      riskScore: 13,
      events: [ev(hoursAgo(6), "seller", "Transaction created", "Trust Link shared with buyer")],
    },
    {
      id: "R09BVC",
      product: "Samsung Galaxy Tab S9",
      description: "128GB Wi-Fi with S-Pen.",
      price: 2190,
      sellerId: "seller-1",
      buyerId: "buyer-3",
      buyerEmail: "mariem.kefi@gmail.com",
      deliveryId: "delivery-1",
      address: "3 Rue El Manar, Monastir",
      eta: daysAgo(1),
      createdAt: daysAgo(8),
      status: "Disputed",
      deliveryStage: "Delivered",
      escrow: "locked",
      risk: "Medium",
      riskScore: 38,
      dispute: {
        reason: "Damaged",
        description:
          "The tablet screen has a crack in the bottom-left corner and the box was already open on arrival.",
        evidence: ["photo_box.jpg", "photo_screen.jpg"],
        openedAt: hoursAgo(12),
        aiRecommendation: "Partial Refund",
        aiConfidence: 78,
        status: "Waiting Admin",
      },
      events: [
        ev(daysAgo(8), "seller", "Transaction created"),
        ev(daysAgo(8), "buyer", "Payment authorised", "2 190 TND via Gravv"),
        ev(daysAgo(8), "system", "Money locked in escrow"),
        ev(daysAgo(6), "seller", "Parcel handed to FastExpress"),
        ev(daysAgo(2), "delivery", "Delivered"),
        ev(hoursAgo(12), "buyer", "Dispute opened", "Reason: Damaged"),
        ev(hoursAgo(12), "system", "AI evidence analysis", "Recommendation: Partial Refund (78%)"),
      ],
    },
    {
      id: "W44HQ2",
      product: "AirPods Pro 2 (USB-C)",
      description: "Sealed, official Tunisian distribution.",
      price: 899,
      sellerId: "seller-1",
      buyerId: "buyer-1",
      buyerEmail: "ahmed.benali@gmail.com",
      deliveryId: "delivery-2",
      address: "14 Rue Habib Bourguiba, Sfax",
      eta: daysAgo(6),
      createdAt: daysAgo(11),
      status: "Completed",
      deliveryStage: "Delivered",
      escrow: "released",
      risk: "Very Low",
      riskScore: 3,
      events: [
        ev(daysAgo(11), "seller", "Transaction created"),
        ev(daysAgo(11), "buyer", "Payment authorised", "899 TND via Gravv"),
        ev(daysAgo(11), "system", "Money locked in escrow"),
        ev(daysAgo(10), "seller", "Parcel handed to Aramex TN"),
        ev(daysAgo(7), "delivery", "Delivered"),
        ev(daysAgo(6), "buyer", "Delivery confirmed"),
        ev(daysAgo(6), "system", "Escrow released to seller", "876 TND after 2.5% fee"),
      ],
    },
  ];
}

function seedLedger(txns: Transaction[]): LedgerEntry[] {
  const out: LedgerEntry[] = [];
  txns.forEach((t) => {
    if (t.escrow !== "none") {
      out.push({
        id: uid("led"),
        txnId: t.id,
        at: t.events[1]?.at ?? t.createdAt,
        type: "lock",
        amount: t.price,
        note: `Buyer payment locked for ${t.product}`,
      });
    }
    if (t.escrow === "released") {
      out.push({
        id: uid("led"),
        txnId: t.id,
        at: t.events[t.events.length - 1]?.at ?? t.createdAt,
        type: "release",
        amount: t.price * (1 - PLATFORM_FEE),
        note: `Released to seller for ${t.product}`,
      });
      out.push({
        id: uid("led"),
        txnId: t.id,
        at: t.events[t.events.length - 1]?.at ?? t.createdAt,
        type: "fee",
        amount: t.price * PLATFORM_FEE,
        note: "TrustOS protection fee",
      });
    }
  });
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

function seedState(): State {
  const transactions = seedTransactions();
  return {
    accounts,
    transactions,
    ledger: seedLedger(transactions),
    notifications: [
      {
        id: uid("n"),
        at: hoursAgo(12),
        audience: ["admin", "seller"],
        title: "Dispute opened on R09BVC",
        detail: "Mariem Kefi reported a damaged item — awaiting admin decision.",
        tone: "warn",
        txnId: "R09BVC",
      },
      {
        id: uid("n"),
        at: hoursAgo(5),
        audience: ["buyer", "seller", "admin"],
        title: "8A93DK delivered",
        detail: "FastExpress delivered the Apple Watch Series 9.",
        tone: "ok",
        txnId: "8A93DK",
      },
    ],
    sessionId: null,
    withdrawn: 0,
  };
}

/* ------------------------------------------------------------------ */
/* AI risk engine (deterministic mock)                                 */
/* ------------------------------------------------------------------ */

export function scoreRisk(price: number, buyerScore: number, sellerScore: number) {
  const priceRisk = Math.min(30, (price / 6000) * 30);
  const trustRisk = (100 - (buyerScore * 0.4 + sellerScore * 0.6)) * 0.9;
  const raw = Math.round(priceRisk + trustRisk);
  const riskScore = Math.max(2, Math.min(96, raw));
  const risk: Transaction["risk"] =
    riskScore < 10 ? "Very Low" : riskScore < 25 ? "Low" : riskScore < 55 ? "Medium" : "High";
  return { riskScore, risk };
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

const KEY = "trustos.state.v2";

type Ctx = {
  state: State;
  hydrated: boolean;
  session: Account | null;
  accountById: (id: string) => Account | undefined;
  txnById: (id: string) => Transaction | undefined;
  signIn: (accountId: string) => void;
  signOut: () => void;
  createTransaction: (input: {
    product: string;
    description: string;
    price: number;
    buyerId: string;
    deliveryId: string;
    eta: string;
    address: string;
  }) => Transaction;
  payTransaction: (txnId: string) => void;
  shipTransaction: (txnId: string) => void;
  setDeliveryStage: (txnId: string, stage: DeliveryStage) => void;
  confirmDelivery: (txnId: string) => void;
  openDispute: (
    txnId: string,
    input: { reason: DisputeReason; description: string; evidence: string[] },
  ) => void;
  resolveDispute: (
    txnId: string,
    resolution: "Refunded" | "Partially Refunded" | "Rejected",
  ) => void;
  withdraw: (amount: number) => void;
  resetDemo: () => void;
};

const TrustCtx = createContext<Ctx | null>(null);

export function TrustProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => seedState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (parsed?.transactions?.length) setState({ ...seedState(), ...parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const accountById = useCallback(
    (id: string) => state.accounts.find((a) => a.id === id),
    [state.accounts],
  );
  const txnById = useCallback(
    (id: string) => state.transactions.find((t) => t.id === id),
    [state.transactions],
  );

  const patchTxn = useCallback(
    (
      txnId: string,
      patch: Partial<Transaction>,
      event: Omit<TxnEvent, "id" | "at">,
      extras?: { ledger?: Omit<LedgerEntry, "id" | "at">[]; notify?: Omit<Notification, "id" | "at">[] },
    ) => {
      setState((s) => {
        const at = now();
        return {
          ...s,
          transactions: s.transactions.map((t) =>
            t.id === txnId
              ? { ...t, ...patch, events: [...t.events, { id: uid("ev"), at, ...event }] }
              : t,
          ),
          ledger: [
            ...(extras?.ledger ?? []).map((l) => ({ id: uid("led"), at, ...l })),
            ...s.ledger,
          ],
          notifications: [
            ...(extras?.notify ?? []).map((n) => ({ id: uid("n"), at, ...n })),
            ...s.notifications,
          ],
        };
      });
    },
    [],
  );

  const value = useMemo<Ctx>(() => {
    const session = state.accounts.find((a) => a.id === state.sessionId) ?? null;

    return {
      state,
      hydrated,
      session,
      accountById,
      txnById,
      signIn: (accountId) => setState((s) => ({ ...s, sessionId: accountId })),
      signOut: () => setState((s) => ({ ...s, sessionId: null })),

      createTransaction: (input) => {
        const buyer = state.accounts.find((a) => a.id === input.buyerId)!;
        const seller = state.accounts.find((a) => a.role === "seller")!;
        const { risk, riskScore } = scoreRisk(input.price, buyer.trustScore, seller.trustScore);
        const at = now();
        const txn: Transaction = {
          id: txnCode(),
          product: input.product,
          description: input.description,
          price: input.price,
          sellerId: seller.id,
          buyerId: buyer.id,
          buyerEmail: buyer.email,
          deliveryId: input.deliveryId,
          address: input.address,
          eta: input.eta,
          createdAt: at,
          status: "Waiting Payment",
          deliveryStage: "Not Started",
          escrow: "none",
          risk,
          riskScore,
          events: [
            {
              id: uid("ev"),
              at,
              actor: "seller",
              title: "Transaction created",
              detail: "Trust Link generated and shared with buyer",
            },
          ],
        };
        setState((s) => ({
          ...s,
          transactions: [txn, ...s.transactions],
          notifications: [
            {
              id: uid("n"),
              at,
              audience: ["buyer", "admin"],
              title: `New Trust Link ${txn.id}`,
              detail: `${seller.name} requests ${currency(txn.price)} for ${txn.product}.`,
              tone: "info",
              txnId: txn.id,
            },
            ...s.notifications,
          ],
        }));
        return txn;
      },

      payTransaction: (txnId) => {
        const t = state.transactions.find((x) => x.id === txnId);
        if (!t) return;
        patchTxn(
          txnId,
          { status: "Paid", escrow: "locked", deliveryStage: "Waiting Pickup" },
          {
            actor: "buyer",
            title: "Payment locked in escrow",
            detail: `${currency(t.price)} paid with Gravv`,
          },
          {
            ledger: [
              {
                txnId,
                type: "lock",
                amount: t.price,
                note: `Buyer payment locked for ${t.product}`,
              },
            ],
            notify: [
              {
                audience: ["seller", "delivery", "admin"],
                title: `${txnId} paid — ready for pickup`,
                detail: `${currency(t.price)} is now protected by Gravv Escrow.`,
                tone: "ok",
                txnId,
              },
            ],
          },
        );
      },

      shipTransaction: (txnId) => {
        const t = state.transactions.find((x) => x.id === txnId);
        if (!t) return;
        const carrier = state.accounts.find((a) => a.id === t.deliveryId)?.name ?? "Carrier";
        patchTxn(
          txnId,
          { status: "Shipped", deliveryStage: "Waiting Pickup" },
          { actor: "seller", title: "Parcel ready", detail: `Handover requested to ${carrier}` },
          {
            notify: [
              {
                audience: ["delivery", "buyer"],
                title: `${txnId} ready for pickup`,
                detail: `${t.product} — ${t.address}`,
                tone: "info",
                txnId,
              },
            ],
          },
        );
      },

      setDeliveryStage: (txnId, stage) => {
        const t = state.transactions.find((x) => x.id === txnId);
        if (!t) return;
        const status: TxnStatus =
          stage === "Delivered"
            ? "Delivered"
            : stage === "Out for Delivery"
              ? "Out for Delivery"
              : stage === "Failed"
                ? t.status
                : "Shipped";
        patchTxn(
          txnId,
          { deliveryStage: stage, status },
          { actor: "delivery", title: stage, detail: t.address },
          {
            notify:
              stage === "Delivered" || stage === "Failed"
                ? [
                    {
                      audience: ["buyer", "seller", "admin"],
                      title: `${txnId} ${stage.toLowerCase()}`,
                      detail:
                        stage === "Delivered"
                          ? "Buyer can now confirm to release the escrow."
                          : "Delivery attempt failed — carrier will retry.",
                      tone: stage === "Delivered" ? "ok" : "bad",
                      txnId,
                    },
                  ]
                : [],
          },
        );
      },

      confirmDelivery: (txnId) => {
        const t = state.transactions.find((x) => x.id === txnId);
        if (!t) return;
        const net = t.price * (1 - PLATFORM_FEE);
        patchTxn(
          txnId,
          { status: "Completed", escrow: "released" },
          {
            actor: "buyer",
            title: "Delivery confirmed — escrow released",
            detail: `${currency(net)} sent to seller (fee ${currency(t.price * PLATFORM_FEE)})`,
          },
          {
            ledger: [
              { txnId, type: "release", amount: net, note: `Released to seller for ${t.product}` },
              { txnId, type: "fee", amount: t.price * PLATFORM_FEE, note: "TrustOS protection fee" },
            ],
            notify: [
              {
                audience: ["seller", "admin"],
                title: `Escrow released for ${txnId}`,
                detail: `${currency(net)} moved to available balance.`,
                tone: "ok",
                txnId,
              },
            ],
          },
        );
      },

      openDispute: (txnId, input) => {
        const t = state.transactions.find((x) => x.id === txnId);
        if (!t) return;
        const aiRecommendation =
          input.reason === "Not Delivered" || input.reason === "Counterfeit"
            ? "Refund"
            : input.reason === "Damaged"
              ? "Partial Refund"
              : "Reject";
        const dispute: Dispute = {
          ...input,
          openedAt: now(),
          aiRecommendation,
          aiConfidence: 64 + Math.min(30, input.evidence.length * 8),
          status: "Waiting Admin",
        };
        patchTxn(
          txnId,
          { status: "Disputed", dispute },
          { actor: "buyer", title: "Dispute opened", detail: `Reason: ${input.reason}` },
          {
            notify: [
              {
                audience: ["admin", "seller"],
                title: `Dispute opened on ${txnId}`,
                detail: `AI recommendation: ${aiRecommendation}. Funds stay locked.`,
                tone: "warn",
                txnId,
              },
            ],
          },
        );
      },

      resolveDispute: (txnId, resolution) => {
        const t = state.transactions.find((x) => x.id === txnId);
        if (!t || !t.dispute) return;
        const refundAmount =
          resolution === "Refunded" ? t.price : resolution === "Partially Refunded" ? t.price / 2 : 0;
        const sellerAmount = (t.price - refundAmount) * (1 - PLATFORM_FEE);
        const ledger: Omit<LedgerEntry, "id" | "at">[] = [];
        if (refundAmount > 0)
          ledger.push({
            txnId,
            type: resolution === "Refunded" ? "refund" : "partial-refund",
            amount: refundAmount,
            note: `Refunded to buyer for ${t.product}`,
          });
        if (sellerAmount > 0)
          ledger.push({
            txnId,
            type: "release",
            amount: sellerAmount,
            note: `Released to seller after dispute on ${t.product}`,
          });

        patchTxn(
          txnId,
          {
            status: resolution === "Refunded" ? "Refunded" : "Completed",
            escrow: resolution === "Refunded" ? "refunded" : "released",
            dispute: { ...t.dispute, status: "Resolved", resolution, resolvedAt: now() },
          },
          {
            actor: "admin",
            title: `Dispute resolved — ${resolution}`,
            detail:
              refundAmount > 0
                ? `${currency(refundAmount)} back to buyer, ${currency(sellerAmount)} to seller`
                : `${currency(sellerAmount)} released to seller`,
          },
          {
            ledger,
            notify: [
              {
                audience: ["buyer", "seller"],
                title: `Dispute on ${txnId} resolved`,
                detail: `Decision: ${resolution}.`,
                tone: resolution === "Rejected" ? "info" : "ok",
                txnId,
              },
            ],
          },
        );
      },

      withdraw: (amount) => {
        setState((s) => ({
          ...s,
          withdrawn: s.withdrawn + amount,
          ledger: [
            {
              id: uid("led"),
              at: now(),
              txnId: "—",
              type: "withdraw",
              amount,
              note: "Payout to bank account ••4417",
            },
            ...s.ledger,
          ],
          notifications: [
            {
              id: uid("n"),
              at: now(),
              audience: ["seller"],
              title: "Withdrawal sent",
              detail: `${currency(amount)} on the way to ••4417.`,
              tone: "ok",
            },
            ...s.notifications,
          ],
        }));
      },

      resetDemo: () => {
        const fresh = seedState();
        setState({ ...fresh, sessionId: state.sessionId });
      },
    };
  }, [state, hydrated, accountById, txnById, patchTxn]);

  return <TrustCtx.Provider value={value}>{children}</TrustCtx.Provider>;
}

export function useTrust() {
  const ctx = useContext(TrustCtx);
  if (!ctx) throw new Error("useTrust must be used inside TrustProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Derived selectors                                                   */
/* ------------------------------------------------------------------ */

export function sellerWallet(state: State) {
  const pending = state.transactions
    .filter((t) => t.escrow === "locked")
    .reduce((s, t) => s + t.price * (1 - PLATFORM_FEE), 0);
  const released = state.ledger
    .filter((l) => l.type === "release")
    .reduce((s, l) => s + l.amount, 0);
  return { pending, available: released - state.withdrawn, released };
}

export function escrowTotals(state: State) {
  const locked = state.transactions
    .filter((t) => t.escrow === "locked")
    .reduce((s, t) => s + t.price, 0);
  const released = state.ledger.filter((l) => l.type === "release").reduce((s, l) => s + l.amount, 0);
  const refunded = state.ledger
    .filter((l) => l.type === "refund" || l.type === "partial-refund")
    .reduce((s, l) => s + l.amount, 0);
  const fees = state.ledger.filter((l) => l.type === "fee").reduce((s, l) => s + l.amount, 0);
  const protectedTotal = state.transactions
    .filter((t) => t.escrow !== "none")
    .reduce((s, t) => s + t.price, 0);
  const waitingDecision = state.transactions
    .filter((t) => t.status === "Disputed")
    .reduce((s, t) => s + t.price, 0);
  return { locked, released, refunded, fees, protectedTotal, waitingDecision };
}

export function timelineFor(t: Transaction) {
  const paid = t.escrow !== "none";
  const shipped = ["Picked Up", "In Transit", "Out for Delivery", "Delivered"].includes(
    t.deliveryStage,
  );
  const delivered = t.deliveryStage === "Delivered";
  const done = t.status === "Completed" || t.status === "Refunded";
  const s = (cond: boolean, current: boolean) =>
    cond ? ("done" as const) : current ? ("current" as const) : ("todo" as const);
  return [
    { title: "Transaction created", state: "done" as const, time: fmtTime(t.createdAt) },
    { title: "Buyer payment", state: s(paid, !paid) },
    { title: "Money locked in escrow", state: s(paid, false) },
    { title: "Seller ships", state: s(shipped, paid && !shipped) },
    { title: "Delivery in progress", state: s(delivered, shipped && !delivered) },
    { title: "Buyer confirms", state: s(done, delivered && !done) },
    {
      title: t.status === "Refunded" ? "Buyer refunded" : "Escrow released to seller",
      state: s(done, false),
    },
  ];
}
