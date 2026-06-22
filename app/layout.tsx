import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas Hub — Morocco at the World Cup 2026",
  description:
    "The free hub for Moroccan fans at the 2026 World Cup. Next match, ticket alerts, halal food, mosques, stadium transport & fan zones.",
  openGraph: {
    title: "Atlas Hub — Morocco at the World Cup 2026 🇲🇦",
    description:
      "Everything Moroccan fans need at the World Cup, in one place. Free.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#006233",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
