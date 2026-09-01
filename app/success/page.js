export default function Success({ searchParams }) {
  const type = searchParams?.type;
  const isSubscription = type === "subscription";

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "96px 24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 32 }}>You're all set 🎉</h1>
      <p style={{ fontSize: 17, color: "#4a4a4a", lineHeight: 1.5 }}>
        {isSubscription
          ? "Travel Advice Pro is active — welcome aboard."
          : "Your card is saved. We'll only charge it when you actually use a concierge service."}
      </p>
      <a href="/" style={{ color: "#1d1d1f", fontWeight: 600 }}>
        &larr; Back to packages
      </a>
    </main>
  );
}
