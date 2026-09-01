import "./globals.css";

export const metadata = {
  title: "Llama Inc. — Your AI Travel Assistant",
  description: "Plan smarter, travel easier.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
