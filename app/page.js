const adHocPerks = [
  "Emergency rebooking when a flight is cancelled or delayed",
  "Visa & travel-document expediting",
  "24/7 live agent escalation mid-trip",
  "One-off local expert consultations",
];

const subscriptionPerks = [
  "Unlimited AI itinerary planning",
  "Personalized destination recommendations",
  "Real-time price-drop alerts",
  "Priority chat support",
];

function PlanCard({ eyebrow, title, price, cadence, perks, cta, highlight }) {
  return (
    <div
      style={{
        border: highlight ? "2px solid #1d1d1f" : "1px solid #e3ddd3",
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
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5, color: "#8a6d3b", textTransform: "uppercase" }}>
        {eyebrow}
      </span>
      <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
      <div>
        <span style={{ fontSize: 36, fontWeight: 700 }}>{price}</span>
        {cadence && <span style={{ color: "#6b6b6b" }}> {cadence}</span>}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {perks.map((perk) => (
          <li key={perk} style={{ display: "flex", gap: 8, fontSize: 15, lineHeight: 1.4 }}>
            <span>✓</span>
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <button
        style={{
          marginTop: "auto",
          padding: "12px 20px",
          borderRadius: 10,
          border: "none",
          background: highlight ? "#1d1d1f" : "#f1ece3",
          color: highlight ? "#fff" : "#1d1d1f",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {cta}
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>🦙 Llama Inc.</h1>
        <p style={{ fontSize: 18, color: "#4a4a4a", maxWidth: 560, margin: "0 auto" }}>
          Your AI travel assistant. Plan trips in seconds, and get real help the moment
          something goes wrong.
        </p>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        <PlanCard
          eyebrow="Subscription"
          title="Travel Advice Pro"
          price="€5"
          cadence="/ month"
          perks={subscriptionPerks}
          cta="Subscribe"
          highlight
        />
        <PlanCard
          eyebrow="Pay as you go"
          title="On-Demand Concierge"
          price="Save a card"
          cadence="pay only when you use it"
          perks={adHocPerks}
          cta="Save card & continue"
        />
      </div>

      <p style={{ textAlign: "center", color: "#9a9a9a", fontSize: 13, marginTop: 48 }}>
        Payment integration coming in the next step — buttons are placeholders for now.
      </p>
    </main>
  );
}
