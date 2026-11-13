import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/lib/cart-context";
import { ProductsProvider } from "@/lib/products-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
        "min-h-full overflow-x-clip",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        playfair.variable,
        cinzel.variable,
        "font-sans"
      )}
    >
      <body className="min-h-screen w-full max-w-full relative flex flex-col bg-[#FAF7F2] text-[#1C1B18] selection:bg-[#EADBCC] selection:text-[#1C1B18]">
        <SmoothScrollProvider>
          <ProductsProvider>
            <CartProvider>{children}</CartProvider>
          </ProductsProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
