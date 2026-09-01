export default function Cancel() {
  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "96px 24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 32 }}>No worries</h1>
      <p style={{ fontSize: 17, color: "#4a4a4a", lineHeight: 1.5 }}>
        You didn't get charged — checkout was cancelled.
      </p>
      <a href="/" style={{ color: "#1d1d1f", fontWeight: 600 }}>
        &larr; Back to packages
      </a>
    </main>
  );
}
