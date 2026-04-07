import type { Metadata, Viewport } from "next";
import { Inter, Merriweather, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChickCheck - Baby Chick Care Guide",
  description: "Your 8-week guide to raising healthy, happy chicks",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ChickCheck",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#9E2A2B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} ${caveat.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="bg-barn-500 focus:ring-barn-500 sr-only text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
