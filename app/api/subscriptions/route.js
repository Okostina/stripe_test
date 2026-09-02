import { NextResponse } from "next/server";
import { getStripe } from "../../../lib/stripe";

// Read-only view of live Stripe state, queried directly on each request —
// not a copy of data our webhook wrote somewhere. We don't have a database,
// so rather than fake persistence we just ask Stripe for the truth every
// time the panel refreshes. (The webhook handler still runs and still logs
// every event server-side; this route is a separate, simpler way to prove
// the integration works end to end without needing infra beyond what's
// already here.)

// This panel is meant to be shown to whoever's reviewing the integration —
// not just the shopper who owns the subscription — so we mask emails before
// they ever leave the server rather than trusting the client to hide them.
// "ol***@gmail.com": first 2 characters of the local part, then the real
// domain (useful for telling test accounts apart without exposing who they are).
function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return null;
  const [local, domain] = email.split("@");
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - visible.length, 3))}@${domain}`;
}

export async function GET() {
  try {
    const stripe = getStripe();

    const subscriptions = await stripe.subscriptions.list({
      status: "all",
      limit: 20,
      expand: ["data.latest_invoice", "data.customer"],
    });

    const items = subscriptions.data
      .sort((a, b) => b.created - a.created)
      .map((sub) => {
        const item = sub.items?.data?.[0];
        const price = item?.price;
        const invoice = sub.latest_invoice;
        const customer = sub.customer;

        return {
          id: sub.id,
          status: sub.status,
          customerEmail: maskEmail(
            customer && typeof customer === "object" ? customer.email : null
          ),
          amount: price?.unit_amount != null ? price.unit_amount / 100 : null,
          currency: price?.currency ? price.currency.toUpperCase() : null,
          interval: price?.recurring?.interval || null,
          currentPeriodStart: sub.current_period_start,
          currentPeriodEnd: sub.current_period_end,
          latestInvoiceStatus:
            (invoice && typeof invoice === "object" && invoice.status) ||
            null,
          created: sub.created,
        };
      });

    return NextResponse.json({ subscriptions: items });
  } catch (err) {
    console.error("subscriptions list error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
