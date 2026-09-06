"use client";

import { useState } from "react";
import styles from "./page.module.css";

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
  },
  {
    heading: "Personalized to your style",
    body: "Tell it who's traveling and how you like to move, and it adjusts pacing and picks accordingly — not a generic top-10 list.",
    example:
      "Traveling with toddlers, or planning a long weekend for two? It reshapes the plan around that, not just the destination.",
  },
  {
    heading: "Price alerts & priority support",
    body: "We keep watching fares after you book, and a real answer is always a message away — not a support ticket queue.",
    example:
      "Ask “is now a good time to book Tokyo in March?” and get a straight answer, plus a nudge later if fares drop.",
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
    note: "Good one for actually seeing the “processing” page resolve to confirmed.",
  },
  {
    label: "SEPA — fails",
    value: "AT86 1904 3002 3547 3202",
    note: "Moves from processing to requires_payment_method.",
  },
];

// Decorative only — a handful of bars of varying height, like a ticket barcode.
const BARCODE_BARS = [6, 12, 8, 16, 5, 14, 9, 12, 6, 16, 8, 10, 5, 13, 7];

function FeatureRow({ heading, body, example }) {
  return (
    <div className={styles.stop}>
      <div className={styles.stopMarker} aria-hidden="true">
        <span className={styles.stopDot} />
        <span className={styles.stopDash} />
      </div>
      <h3 className={styles.stopHeading}>{heading}</h3>
      <p className={styles.stopBody}>{body}</p>
      <p className={styles.stopExample}>
        <strong>Example: </strong>
        {example}
      </p>
    </div>
  );
}

function BoardingPass({ loading, onSubscribe }) {
  return (
    <div className={styles.boardingPass}>
      <div className={styles.bpHeader}>
        <span className={styles.bpHeaderLabel}>Boarding pass</span>
        <span className={styles.barcode} aria-hidden="true">
          {BARCODE_BARS.map((h, i) => (
            <span key={i} style={{ height: h }} />
          ))}
        </span>
      </div>

      <div className={styles.bpPriceRow}>
        <span className={styles.bpAmount}>€5</span>
        <span className={styles.bpCadence}>/ month, billed by Stripe</span>
      </div>
      <p className={styles.bpTitle}>Travel Advice Pro</p>

      <div className={styles.bpDivider} />

      <div className={styles.bpFields}>
        <div className={styles.bpField}>
          <label>Passenger</label>
          <span className={styles.bpFieldValue}>You</span>
        </div>
        <div className={styles.bpField}>
          <label>Fare class</label>
          <span className={styles.bpFieldValue}>Pro</span>
        </div>
        <div className={styles.bpField}>
          <label>Cycle</label>
          <span className={styles.bpFieldValue}>Monthly</span>
        </div>
        <div className={styles.bpField}>
          <label>Access</label>
          <span className={styles.bpFieldValue}>Instant</span>
        </div>
      </div>

      <div className={styles.bpPerks}>
        <p className={styles.bpPerksLabel}>Included</p>
        <ul>
          {subscriptionPerks.map((perk) => (
            <li key={perk}>
              <span>✓</span>
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={styles.bpCta}
        onClick={onSubscribe}
        disabled={loading}
      >
        {loading ? "Redirecting to Stripe…" : "Subscribe"}
      </button>
    </div>
  );
}

function TestNotice() {
  return (
    <div className={styles.notice}>
      <p className={styles.noticeLabel}>Test mode — sample payment details</p>
      {[...TEST_CARDS, ...TEST_IBANS].map((c) => (
        <div key={c.value} className={styles.noticeItem}>
          <div className={styles.noticeItemLabel}>{c.label}</div>
          <code className={styles.noticeCode}>{c.value}</code>
          <div className={styles.noticeNote}>{c.note}</div>
        </div>
      ))}
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
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.brandRow}>
          <span className={styles.brandMark} aria-hidden="true">
            🦙
          </span>
          <p className={styles.eyebrow}>Llama Inc. · AI travel assistant</p>
        </div>
        <h1>Travel plans that don't fall apart when reality does.</h1>
        <p>
          AI itinerary planning that adapts to you, plus a real answer the
          moment something goes wrong — no ticket queue.
        </p>
      </header>

      <div className={styles.route}>
        {FEATURES.map((feature) => (
          <FeatureRow key={feature.heading} {...feature} />
        ))}
      </div>

      <div className={styles.ticketRow}>
        <div className={styles.ticketCol}>
          <BoardingPass loading={loading} onSubscribe={handleSubscribe} />
          {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
        </div>

        <TestNotice />
      </div>
    </div>
  );
}
