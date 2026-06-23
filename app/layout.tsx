import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlas-hub-chi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Atlas Fan — Morocco at the World Cup 2026",
  description:
    "The free hub for Moroccan fans at the 2026 World Cup. Next match, ticket alerts, halal food, mosques, stadium transport & fan zones.",
  openGraph: {
    title: "Atlas Fan — Morocco at the World Cup 2026 🇲🇦",
    description:
      "Everything Moroccan fans need at the World Cup, in one place. Free.",
    type: "website",
    url: SITE_URL,
    siteName: "Atlas Fan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Fan — Morocco at the World Cup 2026 🇲🇦",
    description:
      "Everything Moroccan fans need at the World Cup, in one place. Free.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Atlas Fan",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
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
