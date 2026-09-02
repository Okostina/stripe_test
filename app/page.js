"use client";

import { useEffect, useState } from "react";

const subscriptionPerks = [
  "Unlimited AI itinerary planning",
  "Personalized destination recommendations",
  "Real-time price-drop alerts",
  "Priority chat support",
];

const FEATURES = [
  {
    heading: "Instant itineraries",
    body: "Enter your dates and destination and get a full plan in seconds — flights, stays, and things to do, all balanced against your time.",
    example:
      "Planning a week in Lisbon? Travel Advice Pro drafts a 7-day route balancing must-sees like Belém with quieter spots like Alfama, timing and rough budget included.",
    icon: "route",
  },
  {
    heading: "Personalized to your style",
    body: "Tell it who's traveling and how you like to move, and it adjusts pacing and picks accordingly — not a generic top-10 list.",
    example:
      "Traveling with toddlers, or planning a long weekend for two? It reshapes the plan around that, not just the destination.",
    icon: "compass",
  },
  {
    heading: "Price alerts & priority support",
    body: "We keep watching fares after you book, and a real answer is always a message away — not a support ticket queue.",
    example:
      "Ask “is now a good time to book Tokyo in March?” and get a straight answer, plus a nudge later if fares drop.",
    icon: "bell",
  },
];

const TEST_CARDS = [
  {
    label: "Card — succeeds",
    value: "4242 4242 4242 4242",
    note: "Any future expiry, any CVC, any postal code.",
  },
  {
    label: "Card — requires 3D Secure",
    value: "4000 0025 0000 3155",
    note: "Forces an authentication challenge before it succeeds.",
  },
  {
    label: "Card — declined",
    value: "4000 0000 0000 9995",
    note: "Fails with an insufficient_funds decline.",
  },
];

const TEST_IBANS = [
  {
    label: "SEPA — succeeds instantly*",
    value: "AT61 1904 3002 3457 3201",
    note: "*Still goes through a brief processing state — SEPA never confirms in real time.",
  },
  {
    label: "SEPA — succeeds after ~3 min",
    value: "AT32 1904 3002 3547 3204",
    note: "Good one for actually seeing the “processing” page above resolve to confirmed.",
  },
  {
    label: "SEPA — fails",
    value: "AT86 1904 3002 3547 3202",
    note: "Moves from processing to requires_payment_method.",
  },
];

const STATUS_COLORS = {
  active: { bg: "#e4f3e0", fg: "#2b6a1f" },
  trialing: { bg: "#e3edfa", fg: "#1d4f91" },
  past_due: { bg: "#fbe8d3", fg: "#9a5a10" },
  incomplete: { bg: "#eee", fg: "#555" },
  incomplete_expired: { bg: "#fbe0df", fg: "#a3241c" },
  canceled: { bg: "#fbe0df", fg: "#a3241c" },
  unpaid: { bg: "#fbe0df", fg: "#a3241c" },
  paused: { bg: "#eee", fg: "#555" },
};

function formatAmount(amount, currency) {
  if (amount == null || !currency) return "—";
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function formatDate(unixSeconds) {
  if (!unixSeconds) return "—";
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function FeatureIcon({ name }) {
  const icons = {
    route: (
      <path d="M5 19c3-1 4-3 4-5s-2-3-2-5 2-4 5-4 5 2 5 4-2 3-2 5 1 4 4 5" />
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M14.5 9.5 13 13l-3.5 1.5L11 11l3.5-1.5Z" />
      </>
    ),
    bell: (
      <path d="M7 16v-5a5 5 0 0 1 10 0v5l1.5 2h-13L7 16Zm3.5 3.5a1.7 1.7 0 0 0 3 0" />
    ),
  };

  return (
    <div
      style={{
        width: 56,
        height: 56,
        flexShrink: 0,
        borderRadius: 12,
        border: "1.5px solid #1d1d1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[name]}
      </svg>
    </div>
  );
}

function FeatureRow({ heading, body, example, icon, reverse }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        flexDirection: reverse ? "row-reverse" : "row",
        textAlign: reverse ? "right" : "left",
      }}
    >
      <FeatureIcon name={icon} />
      <div style={{ flex: 1 }}>
        <h3
          style={{
            display: "inline-block",
            margin: "0 0 10px",
            fontSize: 19,
            fontWeight: 700,
            background: "#f4e9b8",
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          {heading}
        </h3>
        <p style={{ margin: 0, color: "#4a4a4a", lineHeight: 1.55, fontSize: 15 }}>
          {body}
        </p>
        <p
          style={{
            margin: "10px 0 0",
            color: "#6b6b6b",
            fontStyle: "italic",
            lineHeight: 1.55,
            fontSize: 14,
          }}
        >
          <strong style={{ fontStyle: "normal" }}>Example: </strong>
          {example}
        </p>
      </div>
    </div>
  );
}

function PlanCard({ eyebrow, title, price, cadence, perks, cta, loading, onSubscribe }) {
  return (
    <div
      style={{
        border: "2px solid #1d1d1f",
        borderRadius: 16,
        padding: "32px 28px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        maxWidth: 380,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: "#8a6d3b",
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </span>
      <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
      <div>
        <span style={{ fontSize: 36, fontWeight: 700 }}>{price}</span>
        {cadence && <span style={{ color: "#6b6b6b" }}> {cadence}</span>}
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {perks.map((perk) => (
          <li key={perk} style={{ display: "flex", gap: 8, fontSize: 15, lineHeight: 1.4 }}>
            <span>✓</span>
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSubscribe}
        disabled={loading}
        style={{
          marginTop: "auto",
          padding: "12px 20px",
          borderRadius: 10,
          border: "none",
          background: "#1d1d1f",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Redirecting to Stripe…" : cta}
      </button>
    </div>
  );
}

function TestCredentials() {
  return (
    <div
      style={{
        maxWidth: 380,
        margin: "24px auto 0",
        border: "1px dashed #c9c0af",
        borderRadius: 12,
        padding: "18px 20px",
        background: "#fbf9f4",
      }}
    >
      <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#6b6b6b" }}>
        TEST MODE — SAMPLE PAYMENT DETAILS
      </p>
      {[...TEST_CARDS, ...TEST_IBANS].map((c) => (
        <div key={c.value} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: "#4a4a4a" }}>{c.label}</div>
          <code
            style={{
              fontSize: 13,
              background: "#f1ece3",
              padding: "1px 6px",
              borderRadius: 4,
            }}
          >
            {c.value}
          </code>
          <div style={{ fontSize: 12, color: "#9a9a9a" }}>{c.note}</div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: "#eee", fg: "#555" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        background: colors.bg,
        color: colors.fg,
      }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function SubscriptionsPanel() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setSubscriptions(data.subscriptions || []);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <aside
      style={{
        width: "100%",
        maxWidth: 320,
        flexShrink: 0,
        border: "1px solid #e3ddd3",
        borderRadius: 16,
        padding: "20px 18px",
        background: "#fff",
        alignSelf: "flex-start",
        position: "sticky",
        top: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15 }}>Live subscriptions</h3>
        <button
          onClick={load}
          disabled={loading}
          title="Re-fetch from Stripe"
          style={{
            border: "1px solid #d8d2c4",
            background: "#fbf9f4",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "…" : "↻ Refresh"}
        </button>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 11, color: "#9a9a9a" }}>
        Read live from the Stripe API on each refresh — test mode.
        {lastFetched && ` Last checked ${lastFetched.toLocaleTimeString()}.`}
      </p>

      {error && (
        <p style={{ color: "#b3261e", fontSize: 13 }}>Couldn't load: {error}</p>
      )}

      {!error && !loading && subscriptions.length === 0 && (
        <p style={{ fontSize: 13, color: "#6b6b6b" }}>
          No subscriptions yet — subscribe above and hit refresh to see it
          appear here.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                {formatAmount(sub.amount, sub.currency)}
                {sub.interval && (
                  <span style={{ fontWeight: 400, color: "#9a9a9a" }}>
                    {" "}
                    / {sub.interval}
                  </span>
                )}
              </span>
              <StatusBadge status={sub.status} />
            </div>
            {sub.customerEmail && (
              <div style={{ fontSize: 12, color: "#6b6b6b", marginBottom: 4 }}>
                {sub.customerEmail}
              </div>
            )}
            <div style={{ fontSize: 11, color: "#9a9a9a" }}>
              Current cycle:{" "}
              {sub.latestInvoiceStatus ? sub.latestInvoiceStatus : "—"} · renews{" "}
              {formatDate(sub.currentPeriodEnd)}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubscribe() {
    setErrorMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/subscription", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Something went wrong");
      }
      window.location.href = data.url;
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "64px 24px 96px",
        display: "flex",
        gap: 40,
        alignItems: "flex-start",
        flexWrap: "wrap-reverse",
        justifyContent: "center",
      }}
    >
      <main style={{ flex: "1 1 560px", maxWidth: 900 }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <h1 style={{ fontSize: 40, marginBottom: 12 }}>🦙 Llama Inc.</h1>
          <p style={{ fontSize: 18, color: "#4a4a4a", maxWidth: 560, margin: "0 auto" }}>
            Your AI travel assistant. Plan trips in seconds, and get real help
            the moment something goes wrong.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 48, marginBottom: 80 }}>
          {FEATURES.map((feature, i) => (
            <FeatureRow key={feature.heading} {...feature} reverse={i % 2 === 1} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <PlanCard
            eyebrow="Subscription"
            title="Travel Advice Pro"
            price="€5"
            cadence="/ month"
            perks={subscriptionPerks}
            cta="Subscribe"
            loading={loading}
            onSubscribe={handleSubscribe}
          />
        </div>

        {errorMessage && (
          <p style={{ textAlign: "center", color: "#b3261e", marginTop: 24 }}>
            {errorMessage}
          </p>
        )}

        <TestCredentials />
      </main>

      <SubscriptionsPanel />
    </div>
  );
}
