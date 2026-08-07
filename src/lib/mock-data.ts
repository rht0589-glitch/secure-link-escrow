export type TxnStatus =
  | "Waiting Payment"
  | "Paid"
  | "Shipped"
  | "Delivered"
  | "Disputed"
  | "Completed";

export type Transaction = {
  id: string;
  product: string;
  description: string;
  price: number;
  buyer: string;
  buyerEmail: string;
  seller: string;
  delivery: string;
  eta: string;
  created: string;
  status: TxnStatus;
  trustScore: number;
  risk: "Very Low" | "Low" | "Medium" | "High";
};

export const currency = (n: number) => `${n.toLocaleString("en-US")} TND`;

export const seller = {
  name: "Tech Store Tunisia",
  handle: "@techstore.tn",
  trustScore: 96,
  verified: true,
  since: "March 2022",
  orders: 1284,
  successRate: 98.4,
  city: "Tunis, Tunisia",
};

export const buyer = {
  name: "Ahmed Ben Ali",
  email: "ahmed.benali@gmail.com",
  trustScore: 91,
  orders: 37,
  city: "Sfax, Tunisia",
};

export const transactions: Transaction[] = [
  {
    id: "8A93DK",
    product: "Apple Watch Series 9",
    description:
      "Apple Watch Series 9 GPS 45mm, Midnight Aluminium Case with Sport Band. Sealed box, 1 year local warranty, original invoice included.",
    price: 1299,
    buyer: "Ahmed Ben Ali",
    buyerEmail: "ahmed.benali@gmail.com",
    seller: "Tech Store Tunisia",
    delivery: "FastExpress",
    eta: "12 Aug 2026",
    created: "5 Aug 2026",
    status: "Delivered",
    trustScore: 96,
    risk: "Very Low",
  },
  {
    id: "K23MZ1",
    product: 'MacBook Air M3 13"',
    description: "MacBook Air M3, 16GB / 512GB, Space Grey. Open box, as new.",
    price: 4890,
    buyer: "Sarra Trabelsi",
    buyerEmail: "sarra.t@outlook.com",
    seller: "Tech Store Tunisia",
    delivery: "Aramex TN",
    eta: "14 Aug 2026",
    created: "6 Aug 2026",
    status: "Shipped",
    trustScore: 94,
    risk: "Low",
  },
  {
    id: "P7QX40",
    product: "Sony WH-1000XM5",
    description: "Noise cancelling headphones, sealed.",
    price: 1150,
    buyer: "Youssef Gharbi",
    buyerEmail: "y.gharbi@gmail.com",
    seller: "Tech Store Tunisia",
    delivery: "FastExpress",
    eta: "11 Aug 2026",
    created: "4 Aug 2026",
    status: "Paid",
    trustScore: 89,
    risk: "Low",
  },
  {
    id: "T51LWA",
    product: "iPhone 15 Pro 256GB",
    description: "Titanium Blue, battery 100%, with box and accessories.",
    price: 3750,
    buyer: "Nour Haddad",
    buyerEmail: "nour.haddad@gmail.com",
    seller: "Tech Store Tunisia",
    delivery: "Colissimo TN",
    eta: "16 Aug 2026",
    created: "7 Aug 2026",
    status: "Waiting Payment",
    trustScore: 92,
    risk: "Low",
  },
  {
    id: "R09BVC",
    product: "Samsung Galaxy Tab S9",
    description: "128GB Wi-Fi with S-Pen.",
    price: 2190,
    buyer: "Mariem Kefi",
    buyerEmail: "mariem.kefi@gmail.com",
    seller: "Tech Store Tunisia",
    delivery: "FastExpress",
    eta: "9 Aug 2026",
    created: "1 Aug 2026",
    status: "Disputed",
    trustScore: 74,
    risk: "Medium",
  },
  {
    id: "W44HQ2",
    product: "AirPods Pro 2 (USB-C)",
    description: "Sealed, official Tunisian distribution.",
    price: 899,
    buyer: "Hamza Jelassi",
    buyerEmail: "hamza.j@gmail.com",
    seller: "Tech Store Tunisia",
    delivery: "Aramex TN",
    eta: "3 Aug 2026",
    created: "28 Jul 2026",
    status: "Completed",
    trustScore: 97,
    risk: "Very Low",
  },
];

export const revenueData = [
  { month: "Feb", revenue: 18400, escrow: 12300 },
  { month: "Mar", revenue: 22800, escrow: 15400 },
  { month: "Apr", revenue: 26100, escrow: 17800 },
  { month: "May", revenue: 24300, escrow: 16200 },
  { month: "Jun", revenue: 31700, escrow: 21100 },
  { month: "Jul", revenue: 38200, escrow: 25600 },
  { month: "Aug", revenue: 44950, escrow: 29800 },
];

export const trustHistory = [
  { month: "Feb", buyer: 82, seller: 88 },
  { month: "Mar", buyer: 84, seller: 90 },
  { month: "Apr", buyer: 86, seller: 91 },
  { month: "May", buyer: 88, seller: 93 },
  { month: "Jun", buyer: 89, seller: 94 },
  { month: "Jul", buyer: 90, seller: 95 },
  { month: "Aug", buyer: 91, seller: 96 },
];

export const riskCategories = [
  { name: "Identity", value: 96 },
  { name: "Payment", value: 92 },
  { name: "Delivery", value: 88 },
  { name: "Disputes", value: 79 },
  { name: "Behaviour", value: 94 },
];

export const scoreReasons = [
  { label: "Completed Orders", delta: 15 },
  { label: "Fast Shipping", delta: 8 },
  { label: "Verified Identity", delta: 6 },
  { label: "Late Delivery", delta: -5 },
  { label: "Disputes", delta: -10 },
  { label: "Many Refunds", delta: -12 },
];

export const deliveries = [
  {
    id: "8A93DK",
    seller: "Tech Store Tunisia",
    buyer: "Ahmed Ben Ali",
    address: "14 Rue Habib Bourguiba, Sfax",
    status: "Delivered",
  },
  {
    id: "K23MZ1",
    seller: "Tech Store Tunisia",
    buyer: "Sarra Trabelsi",
    address: "27 Av. de la Liberté, Tunis",
    status: "In Transit",
  },
  {
    id: "P7QX40",
    seller: "Tech Store Tunisia",
    buyer: "Youssef Gharbi",
    address: "5 Rue Ibn Khaldoun, Sousse",
    status: "Waiting Pickup",
  },
  {
    id: "T51LWA",
    seller: "Tech Store Tunisia",
    buyer: "Nour Haddad",
    address: "88 Rue de Carthage, Ariana",
    status: "Waiting Pickup",
  },
  {
    id: "R09BVC",
    seller: "Tech Store Tunisia",
    buyer: "Mariem Kefi",
    address: "3 Rue El Manar, Monastir",
    status: "Failed",
  },
];

export const escrowFlow = [
  { label: "Buyer Paid", amount: 128400 },
  { label: "Money Locked", amount: 86200 },
  { label: "Waiting Decision", amount: 14300 },
  { label: "Released", amount: 41800 },
];

export const adminActivity = [
  { who: "Mariem Kefi", what: "opened a dispute on R09BVC", when: "12 min ago", tone: "warn" },
  { who: "Tech Store Tunisia", what: "shipped K23MZ1 via Aramex TN", when: "48 min ago", tone: "info" },
  { who: "Gravv Escrow", what: "released 899 TND for W44HQ2", when: "2 h ago", tone: "ok" },
  { who: "Youssef Gharbi", what: "locked 1 150 TND in escrow", when: "3 h ago", tone: "info" },
  { who: "FastExpress", what: "confirmed delivery of 8A93DK", when: "5 h ago", tone: "ok" },
];

export const escrowVolume = [
  { month: "Mar", locked: 42000, released: 33800 },
  { month: "Apr", locked: 51500, released: 44100 },
  { month: "May", locked: 47800, released: 46200 },
  { month: "Jun", locked: 63400, released: 51900 },
  { month: "Jul", locked: 78100, released: 66700 },
  { month: "Aug", locked: 86200, released: 41800 },
];

export const disputeStats = [
  { month: "Mar", opened: 12, resolved: 10 },
  { month: "Apr", opened: 15, resolved: 14 },
  { month: "May", opened: 9, resolved: 11 },
  { month: "Jun", opened: 18, resolved: 15 },
  { month: "Jul", opened: 14, resolved: 16 },
  { month: "Aug", opened: 7, resolved: 5 },
];

export const users = [
  { name: "Tech Store Tunisia", role: "Seller", score: 96, status: "Verified", joined: "Mar 2022" },
  { name: "Ahmed Ben Ali", role: "Buyer", score: 91, status: "Verified", joined: "Jan 2024" },
  { name: "FastExpress", role: "Delivery", score: 93, status: "Verified", joined: "Sep 2023" },
  { name: "Mariem Kefi", role: "Buyer", score: 74, status: "Under review", joined: "Jun 2025" },
  { name: "Aramex TN", role: "Delivery", score: 89, status: "Verified", joined: "Feb 2023" },
];
