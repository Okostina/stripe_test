"use client";

import { useEffect, useState } from "react";
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
    note: "Good one for actually seeing the “processing” page above resolve to confirmed.",
  },
  {
    label: "SEPA — fails",
    value: "AT86 1904 3002 3547 3202",
    note: "Moves from processing to requires_payment_method.",
  },
];

// Tuned for the dark departures-board background, not the light page.
const STATUS_COLORS = {
  active: { fg: "#6fcf97", bg: "rgba(111,207,151,0.14)" },
  trialing: { fg: "#56ccf2", bg: "rgba(86,204,242,0.14)" },
  past_due: { fg: "#f5a623", bg: "rgba(245,166,35,0.14)" },
  incomplete: { fg: "#9aa5c4", bg: "rgba(154,165,196,0.14)" },
  incomplete_expired: { fg: "#ff8a80", bg: "rgba(255,138,128,0.14)" },
  canceled: { fg: "#ff8a80", bg: "rgba(255,138,128,0.14)" },
  unpaid: { fg: "#ff8a80", bg: "rgba(255,138,128,0.14)" },
  paused: { fg: "#9aa5c4", bg: "rgba(154,165,196,0.14)" },
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

function StatusTag({ status }) {
  const colors = STATUS_COLORS[status] || {
    fg: "#b8c0d9",
    bg: "rgba(184,192,217,0.14)",
  };
  return (
    <span
      className={styles.boardStatus}
      style={{ color: colors.fg, background: colors.bg }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function DeparturesBoard() {
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
    <aside className={styles.board}>
      <div className={styles.boardHeader}>
        <h3 className={styles.boardTitle}>Live subscriptions</h3>
        <button
          onClick={load}
          disabled={loading}
          title="Re-fetch from Stripe"
          className={styles.boardRefresh}
        >
          {loading ? "…" : "↻ Refresh"}
        </button>
      </div>
      <p className={styles.boardMeta}>
        Read live from the Stripe API on each refresh — test mode.
        {lastFetched && ` Last checked ${lastFetched.toLocaleTimeString()}.`}
      </p>

      {error && <p className={styles.boardError}>Couldn't load: {error}</p>}

      {!error && !loading && subscriptions.length === 0 && (
        <p className={styles.boardEmpty}>
          No subscriptions yet — subscribe and hit refresh to see it appear
          here.
        </p>
      )}

      <div className={styles.boardRows}>
        {subscriptions.map((sub) => (
          <div key={sub.id} className={styles.boardRow}>
            <div className={styles.boardRowTop}>
              <span className={styles.boardAmount}>
                {formatAmount(sub.amount, sub.currency)}
                {sub.interval && (
                  <span className={styles.boardInterval}> / {sub.interval}</span>
                )}
              </span>
              <StatusTag status={sub.status} />
            </div>
            {sub.customerEmail && (
              <div className={styles.boardEmail}>{sub.customerEmail}</div>
            )}
            <div className={styles.boardCycle}>
              Current cycle: {sub.latestInvoiceStatus || "—"} · renews{" "}
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

        <DeparturesBoard />
      </div>
    </div>
  );
}
