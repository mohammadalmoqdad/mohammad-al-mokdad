import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteMetadata } from "@/lib/seo";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-family",
  display: "swap",
});

export const metadata: Metadata = getSiteMetadata();

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} min-h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-sans text-paper">
        <a href="#hero" className="skip-link">
          Skip to content
        </a>
        <JsonLd />
        {children}
        <span className="site-noise" aria-hidden="true" />
      </body>
    </html>
  );
}
