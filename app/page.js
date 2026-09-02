"use client";

import { useState } from "react";

const subscriptionPerks = [
  "Unlimited AI itinerary planning",
  "Personalized destination recommendations",
  "Real-time price-drop alerts",
  "Priority chat support",
];

function PlanCard({
  eyebrow,
  title,
  price,
  cadence,
  perks,
  cta,
  loading,
  onSubscribe,
}) {
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
        flex: "1 1 320px",
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
          <li
            key={perk}
            style={{ display: "flex", gap: 8, fontSize: 15, lineHeight: 1.4 }}
          >
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
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
      });
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
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>🦙 Llama Inc.</h1>
        <p
          style={{
            fontSize: 18,
            color: "#4a4a4a",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          Your AI travel assistant. Plan trips in seconds, and get real help
          the moment something goes wrong.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
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

      <p
        style={{
          textAlign: "center",
          color: "#9a9a9a",
          fontSize: 13,
          marginTop: 48,
        }}
      >
        Test mode — no real charges. Use card 4242 4242 4242 4242, any future
        expiry, any CVC.
      </p>
    </main>
  );
}
