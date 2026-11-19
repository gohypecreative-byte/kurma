import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#092B20",
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
        "min-h-full overflow-x-clip bg-[#092B20]",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-screen w-full max-w-full relative flex flex-col bg-[#FAF7F2] text-[#1C1B18] selection:bg-[#EADBCC] selection:text-[#1C1B18]">
        <SmoothScrollProvider>
          <ProductsProvider>
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
