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
  title: "discover.wtf - Discover the Internet's Best",
  description: "Curated websites, tools, and resources tailored just for you.",
  generator: "v0.dev",
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
