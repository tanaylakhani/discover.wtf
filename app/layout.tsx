import type React from "react";
import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";

import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const myFont = localFont({
  src: "./AspektaVF.woff2",
  variable: "--font-aspekta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  preload: true,
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});
const instrument_sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: {
    default: "discover.wtf - Discover the Internet's Best",
    template: "%s | discover.wtf"
  },
  description: "TikTok for the internet. Swipe through curated websites, tools, and hidden gems. No algorithm limits - just pure discovery of the web's best content.",
  keywords: [
    "web discovery",
    "curated websites", 
    "internet discovery",
    "web tools",
    "browser extension",
    "website curation",
    "indie web",
    "discovery platform"
  ],
  authors: [{ name: "discover.wtf team" }],
  creator: "discover.wtf",
  publisher: "discover.wtf",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://discover.wtf",
    title: "discover.wtf - Discover the Internet's Best",
    description: "TikTok for the internet. Swipe through curated websites, tools, and hidden gems.",
    siteName: "discover.wtf",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "discover.wtf - Discover the Internet's Best",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "discover.wtf - Discover the Internet's Best",
    description: "TikTok for the internet. Swipe through curated websites, tools, and hidden gems.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://discover.wtf"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          myFont.variable,
          instrument.variable,
          instrument_sans.variable,
          "bg-white font-inter dark:bg-neutral-900"
        )}
      >
        <AuthProvider>
          <ThemeProvider defaultTheme="light" forcedTheme="light">
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
