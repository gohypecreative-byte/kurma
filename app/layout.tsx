import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kurma | Premium Corporate Gifting",
  description: "Thoughtful Gifts. Strong Impressions. Curated, branded luxury gifts that leave a lasting impact on employees, clients, and partners.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        playfair.variable,
        cinzel.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900 selection:bg-amber-100 selection:text-amber-900">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
