import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HelixFlow — AI-Assisted CRM for Agencies",
  description:
    "HelixFlow is a lightweight, AI-assisted CRM built for agencies and service businesses. Leads to delivery, then growth on autopilot.",
  openGraph: {
    type: "website",
    title: "HelixFlow — AI-Assisted CRM for Agencies",
    description:
      "HelixFlow is a lightweight, AI-assisted CRM built for agencies and service businesses. Leads to delivery, then growth on autopilot.",
    siteName: "HelixFlow",
    url: "https://helixflow.cloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "HelixFlow — AI-Assisted CRM for Agencies",
    description:
      "Leads to delivery, then growth on autopilot. Built for agencies.",
  },
  metadataBase: new URL("https://helixflow.cloud"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
