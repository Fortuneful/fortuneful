'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  Home, ReceiptText, BookOpen, BarChart3, Megaphone,
  Globe, Users, UserRound, CreditCard, Settings, Sparkles, ArrowRight,
  Check, ChevronRight, Sun, Moon, Zap, TrendingUp, Clock, X, Plug,
  Star, PhoneCall, MessageSquare, Download, Search, Camera, Loader2, Plus, Pencil
} from "lucide-react";

/* ================= DESIGN TOKENS ================= */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

const theme = {
  dark: {
    bg: "#0B0B0D", surface: "#141419", raised: "#1A1A21",
    border: "rgba(255,255,255,0.07)", borderStrong: "rgba(255,255,255,0.13)",
    text: "#F2F1EC", sub: "#9C9BA3", muted: "#5F5E66",
    gold: "#D9A441", goldSoft: "rgba(217,164,65,0.12)",
    green: "#4ADE80", greenSoft: "rgba(74,222,128,0.10)",
    amber: "#F5A623", amberSoft: "rgba(245,166,35,0.10)",
    red: "#F87171",
  },
  light: {
    bg: "#F7F6F3", surface: "#FFFFFF", raised: "#FFFFFF",
    border: "rgba(20,20,25,0.08)", borderStrong: "rgba(20,20,25,0.16)",
    text: "#17171B", sub: "#5F5E66", muted: "#9C9BA3",
    gold: "#B5822A", goldSoft: "rgba(181,130,42,0.10)",
    green: "#16A34A", greenSoft: "rgba(22,163,74,0.08)",
    amber: "#B45309", amberSoft: "rgba(180,83,9,0.08)",
    red: "#DC2626",
  },
};

/* ================= MOCK DATA ================= */
const BIZ = { name: "Chung Fa", owner: "Ali", plan: "Founder", business_type: "Restaurant" };

const FORT_SUGGESTIONS = {
  "Restaurant": ["Write 3 caption ideas for this week's specials", "Suggest a slow-Tuesday promo", "Draft a reply to a mixed review"],
  "Retail / E-commerce": ["Plan a launch-week social calendar", "Draft product descriptions", "Suggest a bundle promo idea"],
  "Beauty & Fragrance": ["Draft an Instagram caption for a new scent drop", "Suggest a referral promo", "Plan a restock announcement"],
  "Health & Supplements": ["Draft an educational post about a product benefit", "Suggest a first-time-customer offer", "Plan a subscription push"],
  "Services": ["Draft a testimonial request message", "Suggest a slow-season promo", "Plan a referral incentive"],
  "Other": ["Brainstorm a promo idea for this month", "Draft a social caption", "Suggest one quick win for this week"],
};

const revenueWeek = [
  { d: "Wed", v: 412 }, { d: "Thu", v: 388 }, { d: "Fri", v: 545 },
  { d: "Sat", v: 610 }, { d: "Sun", v: 502 }, { d: "Mon", v: 431 }, { d: "Tue", v: 0 },
];

const services = [
  {
    id: "website", icon: Globe, tone: "gold",
    title: "Website Build", subtitle: "chungfahtx.com",
    status: "Live", statusTone: "green",
    detail: "Site is live. Request a redesign or new pages any time.",
    cta: "Request changes",
  },
  {
    id: "social", icon: Megaphone, tone: "gold",
    title: "Social Posts", subtitle: "Instagram + TikTok",
    status: "In progress", statusTone: "gold",
    detail: "3 posts in production for this week's Family Bundle push.",
    cta: "Request a post",
  },
  {
    id: "media", icon: TrendingUp, tone: "amber",
    title: "Media Buying", subtitle: "Meta & Google Ads",
    status: "Not started", statusTone: "muted",
    detail: "Get a dedicated media buyer once your ad accounts are ready.",
    cta: "Book a call",
  },
  {
    id: "email", icon: MessageSquare, tone: "muted",
    title: "Email & SMS", subtitle: "Powered by Klaviyo",
    status: "Coming soon", statusTone: "muted",
    detail: "Build your list from every order and every menu suggestion.",
    cta: "Join waitlist",
  },
];

const requestLog = [
  { id: 1, title: "New sign for the storefront window", type: "Website", when: "2 days ago", status: "Delivered" },
  { id: 2, title: "Instagram post — Family Bundle launch", type: "Social", when: "Yesterday", status: "In progress" },
  { id: 3, title: "Fix pickup time on the homepage", type: "Website", when: "Today", status: "Requested" },
];

const staffSeed = [
  { id: 1, name: "Ali Vazir", role: "Owner", phone: "(832) 237-3595" },
  { id: 2, name: "Amma", role: "Kitchen", phone: "—" },
  { id: 3, name: "Abba", role: "Kitchen", phone: "—" },
];

const shopProducts = [
  { name: "Staff Uniforms", desc: "Branded aprons, shirts, and hats.", icon: "👕" },
  { name: "Menus", desc: "Printed table menus and takeout copies.", icon: "📋" },
  { name: "Flyers", desc: "Promo flyers for local drops.", icon: "📄" },
  { name: "Table Signage", desc: "Table tents, window decals.", icon: "🪧" },
  { name: "Plates & Packaging", desc: "Branded to-go boxes and plates.", icon: "🍱" },
];

const setupSteps = [
  { id: 1, group: "Connect your tools", title: "Connect Square", desc: "Sync your menu, orders, and payments.", mins: 4, done: true },
  { id: 2, group: "Connect your tools", title: "Claim Google Business Profile", desc: "Manage reviews and hours from here.", mins: 3, done: true },
  { id: 3, group: "Go live", title: "Turn on delivery", desc: "Dispatch couriers at cost — no marketplace fees.", mins: 5, done: false },
  { id: 6, group: "Go live", title: "Review ordering settings", desc: "Prep times, order limits, and pickup windows.", mins: 2, done: false },
  { id: 4, group: "Grow", title: "Import customer list", desc: "Bring past guests into your CRM.", mins: 6, done: false },
  { id: 5, group: "Grow", title: "Enable SMS receipts", desc: "Build your list with every order.", mins: 3, done: false },
];

const integrations = [
  { name: "Square", status: "connected" },
  { name: "Google Business", status: "connected" },
  { name: "Stripe", status: "available" },
  { name: "DoorDash", status: "available" },
  { name: "Uber Eats", status: "available" },
  { name: "Grubhub", status: "available" },
  { name: "Twilio", status: "available" },
  { name: "Gmail", status: "available" },
];

const recentOrders = [
  { id: "#1042", items: "Family Bundle, Iced Chai ×2", type: "Pickup", total: 60.85, time: "12 min ago", status: "Preparing" },
  { id: "#1041", items: "Szechuan Fried Rice, Egg Rolls ×5", type: "Pickup", total: 23.95, time: "26 min ago", status: "Ready" },
  { id: "#1040", items: "The Solo (General Tso's)", type: "Pickup", total: 19.99, time: "41 min ago", status: "Completed" },
  { id: "#1039", items: "Chung's Loaded Fries, Mango Lassi", type: "Delivery", total: 14.45, time: "1 hr ago", status: "Completed" },
];

const allOrders = [
  { id: "#1042", customer: "Sarah M.", items: "Family Bundle, Iced Chai ×2", type: "Pickup", total: 60.85, daysAgo: 0, time: "6:42 PM", status: "Preparing" },
  { id: "#1041", customer: "Omar K.", items: "Szechuan Fried Rice, Egg Rolls ×5", type: "Pickup", total: 23.95, daysAgo: 0, time: "6:28 PM", status: "Ready" },
  { id: "#1040", customer: "Jess T.", items: "The Solo (General Tso's)", type: "Pickup", total: 19.99, daysAgo: 0, time: "6:13 PM", status: "Completed" },
  { id: "#1039", customer: "Danny L.", items: "Chung's Loaded Fries, Mango Lassi", type: "Delivery", total: 14.45, daysAgo: 0, time: "5:54 PM", status: "Completed" },
  { id: "#1038", customer: "Priya R.", items: "Mongolian Beef, White Rice ×2", type: "Pickup", total: 22.85, daysAgo: 1, time: "7:31 PM", status: "Completed" },
  { id: "#1037", customer: "Mike B.", items: "The Solo (Sesame Chicken), Wings", type: "Delivery", total: 29.99, daysAgo: 1, time: "6:47 PM", status: "Completed" },
  { id: "#1036", customer: "Aisha N.", items: "Chung Fa's Chicken Dumplings ×2", type: "Pickup", total: 20.0, daysAgo: 1, time: "12:22 PM", status: "Completed" },
  { id: "#1035", customer: "Tom W.", items: "Family Bundle", type: "Pickup", total: 49.95, daysAgo: 2, time: "7:05 PM", status: "Completed" },
  { id: "#1034", customer: "Lena C.", items: "Hakka Noodles, Hot & Sour Soup", type: "Delivery", total: 19.95, daysAgo: 3, time: "1:18 PM", status: "Completed" },
  { id: "#1033", customer: "Raj P.", items: "Burnt Garlic Fried Rice, Limeade", type: "Pickup", total: 21.95, daysAgo: 4, time: "6:50 PM", status: "Completed" },
  { id: "#1032", customer: "Kim H.", items: "Orange Chicken, Egg Drop Soup", type: "Pickup", total: 19.95, daysAgo: 5, time: "5:36 PM", status: "Completed" },
  { id: "#1031", customer: "Chris D.", items: "The Solo (Chicken Chili)", type: "Delivery", total: 19.99, daysAgo: 6, time: "8:02 PM", status: "Refunded" },
  { id: "#1030", customer: "Fatima S.", items: "Family Bundle, Scallion Crab Rangoons", type: "Pickup", total: 59.95, daysAgo: 9, time: "7:44 PM", status: "Completed" },
  { id: "#1029", customer: "Ben G.", items: "Chung's Lo Mein, Iced Coffee ×2", type: "Pickup", total: 23.85, daysAgo: 14, time: "12:41 PM", status: "Completed" },
  { id: "#1028", customer: "Nadia Q.", items: "Beef & Broccoli, Wonton Soup", type: "Delivery", total: 20.95, daysAgo: 21, time: "6:19 PM", status: "Completed" },
];

const extractedMenu = [
  { cat: "Drinks", items: [
    { id: "d1", name: "Chung's Iced Coffee", price: 5.45, conf: "high" },
    { id: "d2", name: "Mango Lassi", price: 5.45, conf: "high" },
    { id: "d3", name: "Iced Chai", price: 5.45, conf: "high" },
    { id: "d4", name: "Limeade Super Green", price: 8.0, conf: "check" },
  ]},
  { cat: "Apps", items: [
    { id: "a1", name: "Chung Fa's Chicken Dumplings", price: 10.0, conf: "high" },
    { id: "a2", name: "Scallion Crab Rangoons (5)", price: 10.0, conf: "high" },
    { id: "a3", name: "Chung's Loaded Fries", price: 9.0, conf: "high" },
    { id: "a4", name: "Egg Rolls (1 / 5)", price: 3.0, conf: "check" },
  ]},
  { cat: "Entrées", items: [
    { id: "e1", name: "General Tso's Chicken", price: 13.95, conf: "high" },
    { id: "e2", name: "Mongolian Beef", price: 14.95, conf: "high" },
    { id: "e3", name: "Chung's Chicken w. Vegetables", price: 13.95, conf: "high" },
    { id: "e4", name: "Vegetable Delight", price: 11.95, conf: "high" },
  ]},
];

const NAV = [
  { icon: Home, label: "Home" },
  { icon: Sparkles, label: "Fort" },
  { icon: ReceiptText, label: "Orders" },
  { icon: BookOpen, label: "Menu" },
  { icon: Globe, label: "Website" },
  { icon: Megaphone, label: "Social Posts" },
  { icon: TrendingUp, label: "Media Buying" },
  { icon: MessageSquare, label: "Email & SMS" },
  { icon: UserRound, label: "Staff" },
  { icon: CreditCard, label: "Payments" },
  { icon: Plug, label: "Shop" },
];

/* ================= PRIMITIVES ================= */
const Card = ({ t, children, style, hover }) => (
  <div
    style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
      transition: "border-color .18s ease, transform .18s ease", ...style,
    }}
    onMouseEnter={(e) => { if (hover) e.currentTarget.style.borderColor = t.borderStrong; }}
    onMouseLeave={(e) => { if (hover) e.currentTarget.style.borderColor = t.border; }}
  >
    {children}
  </div>
);

const Btn = ({ t, children, primary, ghost, small, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "Inter, sans-serif", fontWeight: 600,
      fontSize: small ? 12.5 : 13.5, cursor: "pointer",
      padding: small ? "7px 12px" : "9px 16px", borderRadius: 9,
      border: primary ? "none" : `1px solid ${t.borderStrong}`,
      background: primary ? t.gold : ghost ? "transparent" : t.raised,
      color: primary ? "#141419" : t.text,
      transition: "opacity .15s ease, background .15s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.85)}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
  >
    {children}
  </button>
);

const Badge = ({ t, children, tone = "muted" }) => {
  const map = {
    green: { bg: t.greenSoft, fg: t.green },
    gold: { bg: t.goldSoft, fg: t.gold },
    amber: { bg: t.amberSoft, fg: t.amber },
    muted: { bg: "transparent", fg: t.muted },
  }[tone];
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 600, letterSpacing: "0.02em",
      padding: "3px 9px", borderRadius: 999, background: map.bg, color: map.fg,
      border: tone === "muted" ? `1px solid ${t.border}` : "none",
    }}>{children}</span>
  );
};

const Field = ({ t, label, children }) => (
  <label style={{ display: "block", marginBottom: 14 }}>
    <div style={{ fontSize: 12.5, fontWeight: 600, color: t.sub, marginBottom: 6 }}>{label}</div>
    {children}
  </label>
);

const inputStyle = (t) => ({
  width: "100%", background: t.raised, border: `1px solid ${t.border}`, borderRadius: 9,
  padding: "9px 12px", color: t.text, fontFamily: "Inter, sans-serif", fontSize: 13.5, outline: "none",
});

const Spark = ({ t, data }) => {
  const max = Math.max(...data.map((d) => d.v), 1);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${36 - (d.v / max) * 32}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" style={{ width: "100%", height: 44 }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={t.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <polyline points={`0,40 ${pts} 100,40`} fill={t.goldSoft} stroke="none" />
    </svg>
  );
};

/* ================= APP ================= */
export default function FortunefulDashboard() {
  const [mode, setMode] = useState("dark");
  const [active, setActive] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const [dismissed, setDismissed] = useState([]);
  const [doneExtra, setDoneExtra] = useState([]);
  const [range, setRange] = useState("Today");
  const [typeFilter, setTypeFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [menuPhase, setMenuPhase] = useState("empty"); // empty | processing | review | live
  const [menuData, setMenuData] = useState(extractedMenu);
  const [offItems, setOffItems] = useState([]);
  const [requests, setRequests] = useState(requestLog);
  const [biz, setBiz] = useState(BIZ);

  // Load the signed-in user's business (when auth is set up).
  // 404 = signed in but hasn't onboarded -> send to onboarding.
  // Any other failure (no auth installed yet) -> keep the default quietly.
  useEffect(() => {
    fetch("/api/business")
      .then((r) => {
        if (r.status === 404) { window.location.href = "/onboarding"; return null; }
        return r.ok ? r.json() : null;
      })
      .then((b) => {
        if (b && b.name) setBiz({ name: b.name, owner: (b.owner_name || "").split(" ")[0] || "there", plan: "Founder", business_type: b.business_type || "Restaurant" });
      })
      .catch(() => {});
  }, []);
  const [staff, setStaff] = useState(staffSeed);
  const [fortMessages, setFortMessages] = useState([]);
  const [fortInput, setFortInput] = useState("");
  const [fortLoading, setFortLoading] = useState(false);
  const [fortHistoryLoaded, setFortHistoryLoaded] = useState(false);

  useEffect(() => {
    if (active !== "Fort" || fortHistoryLoaded) return;
    setFortHistoryLoaded(true);
    fetch("/api/fort")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => { if (Array.isArray(rows)) setFortMessages(rows); })
      .catch(() => {});
  }, [active, fortHistoryLoaded]);

  const sendFort = async () => {
    const text = fortInput.trim();
    if (!text || fortLoading) return;
    setFortInput("");
    setFortMessages((prev) => [...prev, { role: "user", content: text }]);
    setFortLoading(true);
    try {
      const res = await fetch("/api/fort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fort couldn't respond");
      setFortMessages((prev) => [...prev, { role: "assistant", content: data.reply, filedRequests: data.filedRequests || [] }]);
      if (data.filedRequests && data.filedRequests.length) {
        setRequests((prev) => [
          ...data.filedRequests.map((r) => ({ id: r.id, title: r.title, type: r.type, status: r.status, when: "Just now" })),
          ...prev,
        ]);
      }
    } catch {
      setFortMessages((prev) => [...prev, { role: "assistant", content: "Sorry — something went wrong. Try again in a moment." }]);
    } finally {
      setFortLoading(false);
    }
  };
  const [forms, setForms] = useState({
    website: { type: "Copy edit", details: "" },
    social: { platform: "Instagram", occasion: "", notes: "" },
    media: { budget: "", platforms: "", goal: "" },
    email: { campaign: "New item announcement", notes: "" },
    staff: { name: "", role: "" },
    shop: {},
  });
  const t = theme[mode];

  const setForm = (cat, field, val) =>
    setForms((prev) => ({ ...prev, [cat]: { ...prev[cat], [field]: val } }));

  // --- Live data wiring ---
  // Loads real requests from /api/requests if the backend exists;
  // silently keeps the local seed data if it doesn't (e.g. in previews).
  const timeAgo = (iso) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 90) return "Just now";
    if (s < 5400) return `${Math.round(s / 60)} min ago`;
    if (s < 129600) return `${Math.round(s / 3600)} hr ago`;
    return `${Math.round(s / 86400)}d ago`;
  };

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) {
          setRequests(rows.map((r) => ({
            id: r.id, title: r.title, type: r.type, status: r.status, when: timeAgo(r.created_at),
          })));
        }
      })
      .catch(() => {}); // no backend yet — keep seed data
  }, []);

  const addRequest = (title, type) => {
    // Optimistic: show it immediately
    setRequests((prev) => [{ id: Date.now(), title, type, when: "Just now", status: "Requested" }, ...prev]);
    // Persist + notify if the backend exists
    fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type, business: "chung-fa" }),
    }).catch(() => {});
  };

  const startImport = () => {
    setMenuPhase("processing");
    setTimeout(() => setMenuPhase("review"), 2000);
  };
  const menuItemCount = menuData.reduce((a, c) => a + c.items.length, 0);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const inRange =
        range === "Today" ? o.daysAgo === 0 :
        range === "Yesterday" ? o.daysAgo === 1 :
        range === "Last 7 days" ? o.daysAgo < 7 :
        o.daysAgo < 28;
      const inType = typeFilter === "All" || o.type === typeFilter;
      const inQuery = query === "" ||
        (o.customer + o.items + o.id).toLowerCase().includes(query.toLowerCase());
      return inRange && inType && inQuery;
    });
  }, [range, typeFilter, query]);

  const rangeRevenue = filteredOrders.filter(o => o.status !== "Refunded").reduce((a, b) => a + b.total, 0);

  const downloadCSV = () => {
    const rows = [["Order", "Customer", "Items", "Type", "Total", "When", "Status"],
      ...filteredOrders.map(o => [o.id, o.customer, `"${o.items}"`, o.type, o.total.toFixed(2), `${o.daysAgo}d ago ${o.time}`, o.status])];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fortuneful-orders-${range.toLowerCase().replaceAll(" ", "-")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const steps = useMemo(
    () => setupSteps.map((s) => ({ ...s, done: s.done || doneExtra.includes(s.id) })),
    [doneExtra]
  );
  const doneCount = steps.filter((s) => s.done).length;
  const weekTotal = revenueWeek.reduce((a, b) => a + b.v, 0);

  return (
    <div style={{
      display: "flex", flexDirection: isMobile ? "column" : "row",
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5,
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .rise { animation: rise .5s ease both; }
        .rise-2 { animation: rise .5s .07s ease both; }
        .rise-3 { animation: rise .5s .14s ease both; }
        .rise-4 { animation: rise .5s .21s ease both; }
        @media (prefers-reduced-motion: reduce) { .rise,.rise-2,.rise-3,.rise-4 { animation: none; } }
        button:focus-visible, a:focus-visible { outline: 2px solid ${t.gold}; outline-offset: 2px; }
        ::selection { background: ${t.gold}; color: #141419; }
        .mnav::-webkit-scrollbar { display: none; }
      `}</style>

      {isMobile ? (
        /* ============ MOBILE TOP BAR ============ */
        <header style={{
          position: "sticky", top: 0, zIndex: 40, background: t.bg,
          borderBottom: `1px solid ${t.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px 8px" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: t.gold,
              display: "grid", placeItems: "center", color: "#141419", fontWeight: 800,
              fontFamily: "'Instrument Serif', serif", fontSize: 17, fontStyle: "italic",
            }}>F</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>Fortuneful</div>
              <div style={{ fontSize: 10.5, color: t.muted, fontFamily: "'JetBrains Mono', monospace" }}>{biz.name}</div>
            </div>
            <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} aria-label="Toggle theme"
              style={{ background: "none", border: "none", color: t.sub, cursor: "pointer", padding: 6 }}>
              {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
          <nav className="mnav" style={{
            display: "flex", gap: 6, overflowX: "auto", padding: "4px 12px 10px",
            scrollbarWidth: "none",
          }}>
            {NAV.map(({ icon: Icon, label }) => {
              const on = active === label;
              return (
                <button key={label} onClick={() => setActive(label)} style={{
                  display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
                  padding: "7px 12px", borderRadius: 999, border: `1px solid ${on ? t.gold : t.border}`,
                  cursor: "pointer", whiteSpace: "nowrap",
                  background: on ? t.goldSoft : "transparent",
                  color: on ? t.gold : t.sub, fontWeight: 600, fontSize: 12.5,
                  fontFamily: "Inter, sans-serif",
                }}>
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </button>
              );
            })}
          </nav>
        </header>
      ) : (
      /* ============ SIDEBAR ============ */
      <aside style={{
        width: 224, flexShrink: 0, borderRight: `1px solid ${t.border}`,
        padding: "20px 12px", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 10px 18px" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, background: t.gold,
            display: "grid", placeItems: "center", color: "#141419", fontWeight: 800,
            fontFamily: "'Instrument Serif', serif", fontSize: 19, fontStyle: "italic",
          }}>F</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: "-0.01em" }}>Fortuneful</div>
            <div style={{ fontSize: 11, color: t.muted, fontFamily: "'JetBrains Mono', monospace" }}>{biz.name}</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV.map(({ icon: Icon, label }) => {
            const on = active === label;
            return (
              <button key={label} onClick={() => setActive(label)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "8px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                background: on ? t.raised : "transparent",
                color: on ? t.text : t.sub, fontWeight: on ? 600 : 500, fontSize: 13.5,
                fontFamily: "Inter, sans-serif", textAlign: "left",
                transition: "background .15s ease, color .15s ease",
                boxShadow: on ? `inset 2px 0 0 ${t.gold}` : "none",
              }}>
                <Icon size={16} strokeWidth={2} style={{ color: on ? t.gold : t.muted }} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
          <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            borderRadius: 9, border: "none", cursor: "pointer", background: "transparent",
            color: t.sub, fontSize: 13.5, fontWeight: 500, fontFamily: "Inter, sans-serif",
          }}>
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {mode === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button onClick={() => setActive("Settings")} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            borderRadius: 9, border: "none", cursor: "pointer", background: "transparent",
            color: t.sub, fontSize: 13.5, fontWeight: 500, fontFamily: "Inter, sans-serif",
          }}>
            <Settings size={16} /> Settings
          </button>
        </div>
      </aside>
      )}

      {/* ============ MAIN ============ */}
      <main style={{ flex: 1, padding: isMobile ? "20px 16px 56px" : "36px 40px 64px", maxWidth: 1120, margin: "0 auto", width: "100%" }}>
        {active === "Home" ? (
          <>
            {/* Greeting */}
            <header className="rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 style={{
                  fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
                  fontWeight: 400, fontSize: 34, letterSpacing: "-0.01em", margin: 0,
                }}>
                  Good evening, {biz.owner}.
                </h1>
                <p style={{ color: t.sub, marginTop: 6, fontSize: 14.5 }}>
                  {biz.name} made{" "}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: t.green }}>
                    ${weekTotal.toLocaleString()}
                  </span>{" "}
                  this week · {requests.filter(r => r.status !== "Delivered").length} requests in progress
                </p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
                borderRadius: 999, background: t.amberSoft, border: `1px solid ${t.border}`,
                color: t.amber, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                Delivery is off <ArrowRight size={14} />
              </div>
            </header>

            {/* ===== Services — signature ===== */}
            <div className="rise-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginTop: 28 }}>
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <Card t={t} key={s.id} hover style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: s.tone === "amber" ? t.amberSoft : s.tone === "gold" ? t.goldSoft : t.raised,
                        color: s.tone === "amber" ? t.amber : s.tone === "gold" ? t.gold : t.muted,
                        display: "grid", placeItems: "center",
                      }}>
                        <Icon size={16} />
                      </div>
                      <Badge t={t} tone={s.statusTone}>{s.status}</Badge>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 12 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: t.muted, marginTop: 1 }}>{s.subtitle}</div>
                    <p style={{ fontSize: 12.5, color: t.sub, marginTop: 8, flex: 1 }}>{s.detail}</p>
                    <div style={{ marginTop: 12, textAlign: "center" }}>
                      <Btn t={t} small primary={s.status !== "Coming soon"} onClick={() => setActive(s.title === "Website Build" ? "Website" : s.title === "Social Posts" ? "Social Posts" : s.title === "Media Buying" ? "Media Buying" : "Email & SMS")}>
                        {s.cta} <ArrowRight size={12} />
                      </Btn>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* ===== Request log ===== */}
            <Card t={t} className="rise-3" style={{ marginTop: 14, padding: "18px 20px", animation: "rise .5s .14s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Your requests</div>
                <Btn t={t} small ghost onClick={() => setActive("Website")}>New request <Plus size={13} /></Btn>
              </div>
              {requests.map((r, i) => (
                <div key={r.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                  borderBottom: i < requests.length - 1 ? `1px solid ${t.border}` : "none",
                }}>
                  <Badge t={t} tone="muted">{r.type}</Badge>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{r.title}</div>
                  <span style={{ fontSize: 12, color: t.muted }}>{r.when}</span>
                  <Badge t={t} tone={r.status === "Delivered" ? "green" : r.status === "In progress" ? "gold" : "muted"}>{r.status}</Badge>
                </div>
              ))}
            </Card>

            {/* ===== Stats row ===== */}
            <div className="rise-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 14 }}>
              {[
                { label: "Revenue this week", val: `$${weekTotal.toLocaleString()}`, delta: "+18% vs last week", spark: true },
                { label: "Orders", val: "121", delta: "+11 vs last week" },
                { label: "Avg. ticket", val: "$23.87", delta: "+$2.10 with bundles" },
                { label: "New reviews", val: "4.6★", delta: "9 this week" },
              ].map((s) => (
                <Card t={t} key={s.label} hover style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, color: t.muted, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>{s.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 600, marginTop: 6 }}>{s.val}</div>
                  <div style={{ fontSize: 12.5, color: t.green, marginTop: 2 }}>{s.delta}</div>
                  {s.spark && <div style={{ marginTop: 8 }}><Spark t={t} data={revenueWeek} /></div>}
                </Card>
              ))}
            </div>

            {/* ===== Setup + Integrations ===== */}
            <div className="rise-4" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 14, marginTop: 14 }}>
              <Card t={t} style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Finish setting up</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: t.sub }}>
                    {doneCount}/{steps.length}
                  </span>
                </div>
                <div style={{ height: 4, background: t.raised, borderRadius: 99, marginTop: 12 }}>
                  <div style={{ height: 4, width: `${(doneCount / steps.length) * 100}%`, background: t.gold, borderRadius: 99, transition: "width .4s ease" }} />
                </div>
                <div style={{ marginTop: 6 }}>
                  {["Connect your tools", "Go live", "Grow"].map((group) => {
                    const groupSteps = steps.filter((s) => s.group === group);
                    const groupDone = groupSteps.every((s) => s.done);
                    return (
                      <div key={group}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8,
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                          textTransform: "uppercase", color: groupDone ? t.green : t.muted,
                          padding: "14px 0 2px",
                        }}>
                          {group}
                          {groupDone && <Check size={12} strokeWidth={3} />}
                        </div>
                        {groupSteps.map((s) => (
                          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${t.border}` }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: 999, flexShrink: 0, display: "grid", placeItems: "center",
                              background: s.done ? t.greenSoft : "transparent",
                              border: s.done ? "none" : `1.5px solid ${t.borderStrong}`,
                              color: t.green,
                            }}>
                              {s.done && <Check size={13} strokeWidth={3} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: 13.5, textDecoration: s.done ? "line-through" : "none", color: s.done ? t.muted : t.text }}>{s.title}</div>
                              {!s.done && <div style={{ fontSize: 12.5, color: t.sub }}>{s.desc}</div>}
                            </div>
                            {!s.done && (
                              <>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: t.muted, fontFamily: "'JetBrains Mono', monospace" }}>
                                  <Clock size={12} /> {s.mins}m
                                </span>
                                <Btn t={t} small onClick={() => setDoneExtra([...doneExtra, s.id])}>
                                  Set up <ChevronRight size={13} />
                                </Btn>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card t={t} style={{ padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Integrations</div>
                <p style={{ fontSize: 12.5, color: t.sub, margin: "4px 0 12px" }}>Fortune works through your existing tools.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {integrations.map((ig) => (
                    <div key={ig.name} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 12px", borderRadius: 10, background: t.raised, border: `1px solid ${t.border}`,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{ig.name}</span>
                      {ig.status === "connected"
                        ? <Badge t={t} tone="green">Connected</Badge>
                        : <Badge t={t} tone="muted">Connect</Badge>}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ===== Recent orders ===== */}
            <Card t={t} style={{ marginTop: 14, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Recent orders</div>
                <Btn t={t} small ghost onClick={() => setActive("Orders")}>View all <ChevronRight size={13} /></Btn>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      {["Order", "Items", "Type", "Total", "Placed", "Status"].map((h) => (
                        <th key={h} style={{
                          textAlign: "left", padding: "8px 10px", color: t.muted, fontWeight: 600,
                          fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em",
                          borderBottom: `1px solid ${t.border}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id}>
                        <td style={{ padding: "11px 10px", fontFamily: "'JetBrains Mono', monospace", color: t.sub, borderBottom: `1px solid ${t.border}` }}>{o.id}</td>
                        <td style={{ padding: "11px 10px", borderBottom: `1px solid ${t.border}` }}>{o.items}</td>
                        <td style={{ padding: "11px 10px", color: t.sub, borderBottom: `1px solid ${t.border}` }}>{o.type}</td>
                        <td style={{ padding: "11px 10px", fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${t.border}` }}>${o.total.toFixed(2)}</td>
                        <td style={{ padding: "11px 10px", color: t.sub, borderBottom: `1px solid ${t.border}` }}>{o.time}</td>
                        <td style={{ padding: "11px 10px", borderBottom: `1px solid ${t.border}` }}>
                          <Badge t={t} tone={o.status === "Completed" ? "muted" : o.status === "Ready" ? "green" : "gold"}>{o.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : active === "Orders" ? (
          <>
            <header className="rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Orders</h1>
                <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: t.text, fontWeight: 600 }}>{filteredOrders.length}</span> orders ·{" "}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: t.green, fontWeight: 600 }}>${rangeRevenue.toFixed(2)}</span> {range.toLowerCase()}
                </p>
              </div>
              <Btn t={t} onClick={downloadCSV}><Download size={14} /> Download CSV</Btn>
            </header>

            <div className="rise-2" style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3 }}>
                {["Today", "Yesterday", "Last 7 days", "Last 28 days"].map((r) => (
                  <button key={r} onClick={() => setRange(r)} style={{
                    border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif",
                    fontSize: 12.5, fontWeight: 600, padding: "7px 13px", borderRadius: 8,
                    background: range === r ? t.raised : "transparent",
                    color: range === r ? t.gold : t.sub,
                    boxShadow: range === r ? `inset 0 0 0 1px ${t.borderStrong}` : "none",
                    transition: "background .15s ease, color .15s ease",
                  }}>{r}</button>
                ))}
              </div>
              <div style={{ display: "flex", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3 }}>
                {["All", "Pickup", "Delivery"].map((f) => (
                  <button key={f} onClick={() => setTypeFilter(f)} style={{
                    border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif",
                    fontSize: 12.5, fontWeight: 600, padding: "7px 13px", borderRadius: 8,
                    background: typeFilter === f ? t.raised : "transparent",
                    color: typeFilter === f ? t.text : t.sub,
                    transition: "background .15s ease, color .15s ease",
                  }}>{f}</button>
                ))}
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 180,
                background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px",
              }}>
                <Search size={14} style={{ color: t.muted, flexShrink: 0 }} />
                <input
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search orders, customers, items"
                  style={{
                    background: "transparent", border: "none", outline: "none", width: "100%",
                    color: t.text, fontFamily: "Inter, sans-serif", fontSize: 13,
                  }}
                />
              </div>
            </div>

            <Card t={t} style={{ marginTop: 14, padding: filteredOrders.length ? "6px 20px 10px" : "48px 32px", animation: "rise .5s .14s ease both" }}>
              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: t.goldSoft, color: t.gold,
                    display: "grid", placeItems: "center", margin: "0 auto 14px",
                  }}>
                    <ReceiptText size={20} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>No orders match</div>
                  <p style={{ color: t.sub, fontSize: 13.5, maxWidth: 380, margin: "6px auto 0" }}>
                    Try a wider date range or clear the search. New orders appear here the moment they're placed.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                    <thead>
                      <tr>
                        {["Order", "Customer", "Items", "Type", "Total", "Placed", "Status"].map((h) => (
                          <th key={h} style={{
                            textAlign: "left", padding: "12px 10px 8px", color: t.muted, fontWeight: 600,
                            fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em",
                            borderBottom: `1px solid ${t.border}`,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.id}>
                          <td style={{ padding: "11px 10px", fontFamily: "'JetBrains Mono', monospace", color: t.sub, borderBottom: `1px solid ${t.border}` }}>{o.id}</td>
                          <td style={{ padding: "11px 10px", fontWeight: 600, borderBottom: `1px solid ${t.border}` }}>{o.customer}</td>
                          <td style={{ padding: "11px 10px", color: t.sub, borderBottom: `1px solid ${t.border}` }}>{o.items}</td>
                          <td style={{ padding: "11px 10px", color: t.sub, borderBottom: `1px solid ${t.border}` }}>{o.type}</td>
                          <td style={{ padding: "11px 10px", fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${t.border}` }}>${o.total.toFixed(2)}</td>
                          <td style={{ padding: "11px 10px", color: t.sub, borderBottom: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>
                            {o.daysAgo === 0 ? "Today" : o.daysAgo === 1 ? "Yesterday" : `${o.daysAgo}d ago`} · {o.time}
                          </td>
                          <td style={{ padding: "11px 10px", borderBottom: `1px solid ${t.border}` }}>
                            <Badge t={t} tone={
                              o.status === "Refunded" ? "amber" :
                              o.status === "Completed" ? "muted" :
                              o.status === "Ready" ? "green" : "gold"
                            }>{o.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        ) : active === "Menu" ? (
          <>
            <header className="rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Menu</h1>
                <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>
                  {menuPhase === "live"
                    ? <><span style={{ fontFamily: "'JetBrains Mono', monospace", color: t.text, fontWeight: 600 }}>{menuItemCount}</span> items across {menuData.length} categories</>
                    : "One menu for online ordering, delivery apps, and your website."}
                </p>
              </div>
              {menuPhase === "live" && (
                <Btn t={t} primary onClick={() => {
                  const next = [...menuData];
                  next[0] = { ...next[0], items: [{ id: `new${Date.now()}`, name: "New item", price: 0, conf: "high" }, ...next[0].items] };
                  setMenuData(next);
                }}><Plus size={14} /> Add item</Btn>
              )}
            </header>

            {menuPhase === "empty" && (
              <Card t={t} className="rise-2" style={{ marginTop: 24, padding: "56px 32px", textAlign: "center", animation: "rise .5s .07s ease both" }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 14, background: t.goldSoft, color: t.gold,
                  display: "grid", placeItems: "center", margin: "0 auto 16px",
                }}>
                  <Camera size={24} />
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 22 }}>
                  Snap a photo of your menu. Fortune builds it.
                </div>
                <p style={{ color: t.sub, fontSize: 13.5, maxWidth: 420, margin: "8px auto 20px" }}>
                  A phone photo, a PDF, or a link to your old site — Fortune reads it, extracts every item and price,
                  and sets up your online menu. You review before anything goes live.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Btn t={t} primary onClick={startImport}><Camera size={14} /> Upload menu photo</Btn>
                  <Btn t={t} ghost onClick={() => { setMenuData([{ cat: "New category", items: [] }]); setMenuPhase("live"); }}>
                    Start from scratch
                  </Btn>
                </div>
              </Card>
            )}

            {menuPhase === "processing" && (
              <Card t={t} style={{ marginTop: 24, padding: "64px 32px", textAlign: "center" }}>
                <Loader2 size={28} className="spin" style={{ color: t.gold, margin: "0 auto 16px", display: "block" }} />
                <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 20 }}>
                  Reading your menu…
                </div>
                <p style={{ color: t.sub, fontSize: 13.5, marginTop: 6 }}>
                  Extracting items, prices, and categories. Usually under a minute.
                </p>
              </Card>
            )}

            {(menuPhase === "review" || menuPhase === "live") && (
              <>
                {menuPhase === "review" && (
                  <Card t={t} className="rise-2" style={{
                    marginTop: 20, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                    background: `linear-gradient(90deg, ${t.goldSoft}, ${t.surface} 70%)`, animation: "rise .5s ease both",
                  }}>
                    <Sparkles size={16} style={{ color: t.gold, flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: 13.5, flex: 1 }}>
                      Fortune found <strong>{menuItemCount} items</strong> in <strong>{menuData.length} categories</strong>.
                      Two are marked for a quick look before going live.
                    </p>
                    <Btn t={t} primary onClick={() => setMenuPhase("live")}><Check size={14} /> Approve &amp; publish</Btn>
                    <Btn t={t} ghost onClick={() => setMenuPhase("empty")}>Start over</Btn>
                  </Card>
                )}

                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                  {menuData.map((cat) => (
                    <Card t={t} key={cat.cat} style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{cat.cat}</div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.muted }}>{cat.items.length} items</span>
                      </div>
                      {cat.items.length === 0 && (
                        <p style={{ color: t.muted, fontSize: 13, margin: "10px 0 4px" }}>No items yet — add your first.</p>
                      )}
                      {cat.items.map((it) => {
                        const off = offItems.includes(it.id);
                        return (
                          <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: t.raised,
                              border: `1px dashed ${t.borderStrong}`, display: "grid", placeItems: "center", color: t.muted,
                            }} title="Add photo">
                              <Camera size={13} />
                            </div>
                            <div style={{ flex: 1, opacity: off ? 0.45 : 1 }}>
                              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{it.name}</span>
                              {it.conf === "check" && menuPhase === "review" && (
                                <span style={{ marginLeft: 8 }}><Badge t={t} tone="amber">Check price</Badge></span>
                              )}
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, opacity: off ? 0.45 : 1 }}>
                              ${it.price.toFixed(2)}
                            </span>
                            {menuPhase === "live" && (
                              <>
                                <button aria-label={`Edit ${it.name}`} style={{ background: "none", border: "none", color: t.muted, cursor: "pointer", padding: 4 }}>
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => setOffItems(off ? offItems.filter((x) => x !== it.id) : [...offItems, it.id])}
                                  aria-label={off ? `Mark ${it.name} available` : `Mark ${it.name} sold out`}
                                  style={{
                                    width: 34, height: 20, borderRadius: 999, border: "none", cursor: "pointer",
                                    background: off ? t.raised : t.green, position: "relative", flexShrink: 0,
                                    transition: "background .2s ease",
                                  }}>
                                  <span style={{
                                    position: "absolute", top: 2, left: off ? 2 : 16, width: 16, height: 16,
                                    borderRadius: 999, background: "#fff", transition: "left .2s ease",
                                  }} />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        ) : active === "Website" ? (
          <div className="rise">
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Website</h1>
                <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>chungfahtx.com</p>
              </div>
              <Badge t={t} tone="green">Live</Badge>
            </header>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: 14, marginTop: 22 }}>
              <Card t={t} style={{ padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Request a change</div>
                <p style={{ fontSize: 12.5, color: t.sub, marginBottom: 16 }}>We build it manually and update you here when it's live.</p>
                <Field t={t} label="What kind of change?">
                  <select style={inputStyle(t)} value={forms.website.type} onChange={(e) => setForm("website", "type", e.target.value)}>
                    {["Copy edit", "New page", "Redesign", "Bug fix", "Add photos"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field t={t} label="Details">
                  <textarea style={{ ...inputStyle(t), minHeight: 90, resize: "vertical", fontFamily: "Inter, sans-serif" }}
                    placeholder="e.g. Update the hours on the homepage"
                    value={forms.website.details} onChange={(e) => setForm("website", "details", e.target.value)} />
                </Field>
                <div style={{ textAlign: "center" }}>
                <Btn t={t} primary onClick={() => {
                  if (!forms.website.details) return;
                  addRequest(`${forms.website.type}: ${forms.website.details.slice(0, 50)}`, "Website");
                  setForm("website", "details", "");
                }}>Submit request</Btn>
                </div>
              </Card>
              <Card t={t} style={{ padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 10 }}>Site details</div>
                {[["Domain", "chungfahtx.com"], ["Pages", "Home, Menu, Catering"], ["Last updated", "Today"], ["Hosting", "Fortuneful"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}`, fontSize: 13 }}>
                    <span style={{ color: t.sub }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14 }}>
                  <Btn t={t} ghost small onClick={() => window.open("https://chungfahtx.com", "_blank")}>Visit site <ArrowRight size={12} /></Btn>
                </div>
              </Card>
            </div>
            <Card t={t} style={{ marginTop: 14, padding: "18px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Website requests</div>
              {requests.filter((r) => r.type === "Website").map((r, i, arr) => (
                <div key={r.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{r.title}</div>
                  <span style={{ fontSize: 12, color: t.muted }}>{r.when}</span>
                  <Badge t={t} tone={r.status === "Delivered" ? "green" : r.status === "In progress" ? "gold" : "muted"}>{r.status}</Badge>
                </div>
              ))}
            </Card>
          </div>
        ) : active === "Social Posts" ? (
          <div className="rise">
            <header>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Social Posts</h1>
              <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>Instagram + TikTok, made and posted for you.</p>
            </header>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: 14, marginTop: 22 }}>
              <Card t={t} style={{ padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Request a post</div>
                <p style={{ fontSize: 12.5, color: t.sub, marginBottom: 16 }}>Tell us the occasion — we'll shoot, edit, and post it.</p>
                <Field t={t} label="Platform">
                  <select style={inputStyle(t)} value={forms.social.platform} onChange={(e) => setForm("social", "platform", e.target.value)}>
                    {["Instagram", "TikTok", "Both"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field t={t} label="Occasion / theme">
                  <input style={inputStyle(t)} placeholder="e.g. New Family Bundle launch"
                    value={forms.social.occasion} onChange={(e) => setForm("social", "occasion", e.target.value)} />
                </Field>
                <Field t={t} label="Notes">
                  <textarea style={{ ...inputStyle(t), minHeight: 70, resize: "vertical", fontFamily: "Inter, sans-serif" }}
                    value={forms.social.notes} onChange={(e) => setForm("social", "notes", e.target.value)} />
                </Field>
                <div style={{ textAlign: "center" }}>
                <Btn t={t} primary onClick={() => {
                  if (!forms.social.occasion) return;
                  addRequest(`${forms.social.platform} post — ${forms.social.occasion}`, "Social");
                  setForm("social", "occasion", ""); setForm("social", "notes", "");
                }}>Submit request</Btn>
                </div>
              </Card>
              <Card t={t} style={{ padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 10 }}>This week</div>
                <p style={{ fontSize: 13, color: t.sub }}>3 posts in production for the Family Bundle push.</p>
                <div style={{ height: 4, background: t.raised, borderRadius: 99, marginTop: 12 }}>
                  <div style={{ height: 4, width: "60%", background: t.gold, borderRadius: 99 }} />
                </div>
              </Card>
            </div>
            <Card t={t} style={{ marginTop: 14, padding: "18px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Post requests</div>
              {requests.filter((r) => r.type === "Social").map((r, i, arr) => (
                <div key={r.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{r.title}</div>
                  <span style={{ fontSize: 12, color: t.muted }}>{r.when}</span>
                  <Badge t={t} tone={r.status === "Delivered" ? "green" : r.status === "In progress" ? "gold" : "muted"}>{r.status}</Badge>
                </div>
              ))}
            </Card>
          </div>
        ) : active === "Media Buying" ? (
          <div className="rise">
            <header>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Media Buying</h1>
              <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>A dedicated media buyer for your ad platforms.</p>
            </header>
            <Card t={t} style={{ marginTop: 22, padding: "28px 24px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: t.amberSoft, color: t.amber, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
                <TrendingUp size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Not started yet</div>
              <p style={{ color: t.sub, fontSize: 13.5, maxWidth: 440, margin: "6px auto 20px" }}>
                We'll set up your Meta and Google ad accounts and run them for you.
                Book a 15-minute call to get started, or send us the basics below.
              </p>
              <Btn t={t} primary onClick={() => {}}><PhoneCall size={14} /> Book a call</Btn>
            </Card>
            <Card t={t} style={{ marginTop: 14, padding: "18px 20px", maxWidth: 480 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12 }}>Or tell us the basics</div>
              <Field t={t} label="Monthly ad budget">
                <input style={inputStyle(t)} placeholder="e.g. $500/mo" value={forms.media.budget} onChange={(e) => setForm("media", "budget", e.target.value)} />
              </Field>
              <Field t={t} label="Platforms">
                <input style={inputStyle(t)} placeholder="e.g. Meta, Google" value={forms.media.platforms} onChange={(e) => setForm("media", "platforms", e.target.value)} />
              </Field>
              <Field t={t} label="What's the goal?">
                <textarea style={{ ...inputStyle(t), minHeight: 70, resize: "vertical", fontFamily: "Inter, sans-serif" }}
                  value={forms.media.goal} onChange={(e) => setForm("media", "goal", e.target.value)} />
              </Field>
              <div style={{ textAlign: "center" }}>
              <Btn t={t} primary onClick={() => {
                if (!forms.media.budget) return;
                addRequest(`Media buying inquiry — ${forms.media.budget}`, "Media");
                setForm("media", "budget", ""); setForm("media", "platforms", ""); setForm("media", "goal", "");
              }}>Send to our team</Btn>
              </div>
            </Card>
          </div>
        ) : active === "Email & SMS" ? (
          <div className="rise">
            <header>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Email &amp; SMS</h1>
              <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>Powered by Klaviyo — coming soon.</p>
            </header>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 22 }}>
              {[["Email list", "0 contacts"], ["SMS list", "0 contacts"], ["Menu suggestions", "3 collected"]].map(([k, v]) => (
                <Card t={t} key={k} style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, color: t.muted, fontWeight: 600, textTransform: "uppercase" }}>{k}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, marginTop: 6 }}>{v}</div>
                </Card>
              ))}
            </div>
            <Card t={t} style={{ marginTop: 14, padding: "18px 20px", maxWidth: 480 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12 }}>Request your first campaign</div>
              <Field t={t} label="Campaign type">
                <select style={inputStyle(t)} value={forms.email.campaign} onChange={(e) => setForm("email", "campaign", e.target.value)}>
                  {["New item announcement", "Weekly promo", "Review request", "Win-back offer"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field t={t} label="Notes">
                <textarea style={{ ...inputStyle(t), minHeight: 70, resize: "vertical", fontFamily: "Inter, sans-serif" }}
                  value={forms.email.notes} onChange={(e) => setForm("email", "notes", e.target.value)} />
              </Field>
              <div style={{ textAlign: "center" }}><Btn t={t} primary onClick={() => addRequest(`Email/SMS — ${forms.email.campaign}`, "Email")}>Join the waitlist</Btn></div>
            </Card>
          </div>
        ) : active === "Staff" ? (
          <div className="rise">
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Staff</h1>
                <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>{staff.length} team members</p>
              </div>
            </header>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 14, marginTop: 22 }}>
              <Card t={t} style={{ padding: "6px 20px" }}>
                {staff.map((m, i) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: i < staff.length - 1 ? `1px solid ${t.border}` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 999, background: t.goldSoft, color: t.gold, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>
                      {m.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: t.muted }}>{m.role}</div>
                    </div>
                    <span style={{ fontSize: 12.5, color: t.sub, fontFamily: "'JetBrains Mono', monospace" }}>{m.phone}</span>
                  </div>
                ))}
              </Card>
              <Card t={t} style={{ padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12 }}>Add team member</div>
                <Field t={t} label="Name">
                  <input style={inputStyle(t)} value={forms.staff.name} onChange={(e) => setForm("staff", "name", e.target.value)} />
                </Field>
                <Field t={t} label="Role">
                  <input style={inputStyle(t)} placeholder="e.g. Kitchen, Front counter" value={forms.staff.role} onChange={(e) => setForm("staff", "role", e.target.value)} />
                </Field>
                <div style={{ textAlign: "center" }}>
                <Btn t={t} primary onClick={() => {
                  if (!forms.staff.name) return;
                  setStaff([...staff, { id: Date.now(), name: forms.staff.name, role: forms.staff.role || "Staff", phone: "—" }]);
                  setForm("staff", "name", ""); setForm("staff", "role", "");
                }}><Plus size={13} /> Add</Btn>
                </div>
              </Card>
            </div>
          </div>
        ) : active === "Payments" ? (
          <div className="rise">
            <header>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Payments</h1>
              <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>Processed through Square.</p>
            </header>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 22 }}>
              <Card t={t} style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: t.muted, fontWeight: 600, textTransform: "uppercase" }}>Processor</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginTop: 6 }}>Square</div>
                <div style={{ marginTop: 8 }}><Badge t={t} tone="green">Connected</Badge></div>
              </Card>
              <Card t={t} style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: t.muted, fontWeight: 600, textTransform: "uppercase" }}>Payout schedule</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginTop: 6 }}>Daily</div>
              </Card>
              <Card t={t} style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: t.muted, fontWeight: 600, textTransform: "uppercase" }}>This week</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 20, marginTop: 6, color: t.green }}>${weekTotal.toLocaleString()}</div>
              </Card>
            </div>
            <Card t={t} style={{ marginTop: 14, padding: "18px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 10 }}>More ways to get paid</div>
              {["Stripe", "DoorDash", "Uber Eats", "Grubhub"].map((p) => (
                <div key={p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p}</span>
                  <Badge t={t} tone="muted">Coming soon</Badge>
                </div>
              ))}
            </Card>
          </div>
        ) : active === "Shop" ? (
          <div className="rise">
            <header>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Shop</h1>
              <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>Branded uniforms, print, and packaging. Coming soon.</p>
            </header>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 22 }}>
              {shopProducts.map((p) => (
                <Card t={t} key={p.name} hover style={{ padding: "18px 18px" }}>
                  <div style={{ fontSize: 24 }}>{p.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 10 }}>{p.name}</div>
                  <p style={{ fontSize: 12.5, color: t.sub, marginTop: 4 }}>{p.desc}</p>
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Badge t={t} tone="muted">Coming soon</Badge>
                    <Btn t={t} small ghost onClick={() => addRequest(`Quote request — ${p.name}`, "Shop")}>Request quote</Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : active === "Fort" ? (
          <div className="rise" style={{ display: "flex", flexDirection: "column", height: isMobile ? "calc(100vh - 160px)" : "calc(100vh - 120px)" }}>
            <header style={{ marginBottom: 14 }}>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>Fort</h1>
              <p style={{ color: t.sub, marginTop: 4, fontSize: 14 }}>Your on-demand growth strategist.</p>
            </header>

            <Card t={t} style={{ flex: 1, display: "flex", flexDirection: "column", padding: "18px 20px", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                {fortMessages.length === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: t.raised, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13.5 }}>
                      Hey {biz.owner}, I'm Fort — your growth strategist for {biz.name}. Here's a few things I can help with:
                    </div>
                    {(FORT_SUGGESTIONS[biz.business_type] || FORT_SUGGESTIONS["Other"]).map((s) => (
                      <button key={s} onClick={() => setFortInput(s)} style={{
                        alignSelf: "flex-start", textAlign: "left", padding: "8px 12px", borderRadius: 9, cursor: "pointer",
                        border: `1px solid ${t.border}`, background: "transparent", color: t.gold, fontWeight: 600, fontSize: 12.5, fontFamily: "Inter, sans-serif",
                      }}>{s}</button>
                    ))}
                  </div>
                )}

                {fortMessages.map((m, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                    <div style={{
                      maxWidth: "85%", borderRadius: 12, padding: "10px 14px", fontSize: 13.5, whiteSpace: "pre-wrap",
                      background: m.role === "user" ? t.goldSoft : t.raised,
                      color: m.role === "user" ? t.gold : t.text,
                      border: `1px solid ${m.role === "user" ? "transparent" : t.border}`,
                    }}>
                      {m.content}
                    </div>
                    {m.filedRequests && m.filedRequests.map((r) => (
                      <div key={r.id} style={{
                        maxWidth: "85%", borderRadius: 10, padding: "8px 12px", fontSize: 12.5, fontWeight: 600,
                        background: t.goldSoft, color: t.gold, border: `1px solid ${t.gold}`,
                      }}>
                        Filed: {r.title} — the team is on it
                      </div>
                    ))}
                  </div>
                ))}

                {fortLoading && (
                  <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, color: t.sub, fontSize: 12.5 }}>
                    <Loader2 size={14} className="spin" /> Fort is thinking…
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14, borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
                <input
                  style={{ ...inputStyle(t), flex: 1 }}
                  placeholder="Ask Fort anything, or describe what you need done…"
                  value={fortInput}
                  onChange={(e) => setFortInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFort(); } }}
                  disabled={fortLoading}
                />
                <Btn t={t} primary onClick={sendFort}>Send</Btn>
              </div>
            </Card>
          </div>
        ) : (
          /* ===== Stub pages ===== */
          <div className="rise" style={{ paddingTop: 40 }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 32, margin: 0 }}>
              {active}
            </h1>
            <Card t={t} style={{ marginTop: 20, padding: "40px 32px", textAlign: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: t.goldSoft, color: t.gold,
                display: "grid", placeItems: "center", margin: "0 auto 14px",
              }}>
                <MessageSquare size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{active} is on the roadmap</div>
              <p style={{ color: t.sub, fontSize: 13.5, maxWidth: 420, margin: "6px auto 16px" }}>
                Request this today and our team handles it manually. Same request-and-track workflow
                as Website and Social — we're just not self-serve here yet.
              </p>
              <Btn t={t} primary onClick={() => setActive("Home")}>Back to Home</Btn>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
