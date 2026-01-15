import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChickCheck - Baby Chick Care Guide",
  description: "Your 8-week guide to raising healthy, happy chicks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
