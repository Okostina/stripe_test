import { getStripe } from "../../lib/stripe";

// The redirect back here only means the shopper submitted the Checkout
// form — for some payment methods (bank debits, some redirect methods) the
// payment is still "processing" at this point, not actually confirmed.
// So rather than always saying "you're subscribed," we look up the real
// status server-side and show one of three honest states. The webhook
// handler remains the actual source of truth for any real fulfillment
// logic; this is purely about what we tell the shopper right now.
async function getStatus(sessionId, type) {
  if (!sessionId) return "unknown";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription.latest_invoice.payment_intent", "setup_intent"],
    });

    if (type === "concierge") {
      return session.setup_intent?.status === "succeeded"
        ? "confirmed"
        : "processing";
    }

    // Subscription mode
    const subscription = session.subscription;
    const paymentIntentStatus =
      subscription?.latest_invoice?.payment_intent?.status;

    if (
      subscription?.status === "active" &&
      (!paymentIntentStatus || paymentIntentStatus === "succeeded")
    ) {
      return "confirmed";
    }
    if (
      paymentIntentStatus === "requires_payment_method" ||
      subscription?.status === "incomplete_expired" ||
      subscription?.status === "canceled"
    ) {
      return "failed";
    }
    // Covers "processing" (e.g. SEPA Direct Debit, 3-min settlement) and
    // "incomplete" (subscription created, first invoice not settled yet) —
    // anything in between confirmed and failed, treat as still in flight.
    return "processing";
  } catch (err) {
    console.error("success page: couldn't retrieve session status", err);
    return "unknown";
  }
}

const COPY = {
  confirmed: {
    heading: "You're all set 🎉",
    subscription:
      "Travel Advice Pro is active — welcome aboard.",
    concierge:
      "Your card is saved. We'll only charge it when you actually use a concierge service.",
  },
  processing: {
    heading: "Almost there",
    subscription:
      "We're processing your payment — this can take a few minutes depending on your payment method. We'll finalize your Travel Advice Pro subscription as soon as it clears, no need to do anything else.",
    concierge:
      "We're finishing setup on your saved card. This usually only takes a moment.",
  },
  failed: {
    heading: "That didn't go through",
    subscription:
      "Your payment couldn't be completed, so Travel Advice Pro hasn't started. No charge was made — feel free to try again.",
    concierge:
      "We couldn't save your card. No charge was made — feel free to try again.",
  },
  unknown: {
    heading: "Thanks!",
    subscription: "We're confirming your order now.",
    concierge: "We're confirming your order now.",
  },
};

export default async function Success({ searchParams }) {
  const sessionId = searchParams?.session_id;
  const type = searchParams?.type === "concierge" ? "concierge" : "subscription";
  const status = await getStatus(sessionId, type);
  const copy = COPY[status];

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "96px 24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 32 }}>{copy.heading}</h1>
      <p style={{ fontSize: 17, color: "#4a4a4a", lineHeight: 1.5 }}>
        {copy[type]}
      </p>
      <a href="/" style={{ color: "#1d1d1f", fontWeight: 600 }}>
        &larr; Back to packages
      </a>
    </main>
  );
}
