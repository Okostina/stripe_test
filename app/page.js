"use client";

import { useState } from "react";

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
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px 96px" }}>
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

      <p style={{ textAlign: "center", color: "#9a9a9a", fontSize: 13, marginTop: 48 }}>
        Test mode — no real charges. Use card 4242 4242 4242 4242, any future
        expiry, any CVC.
      </p>
    </main>
  );
}
