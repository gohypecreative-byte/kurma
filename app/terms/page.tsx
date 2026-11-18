"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";

export default function TermsPage() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1B18] selection:bg-[#EADBCC] font-sans">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-28">
        {/* ========================================================================= */}
        {/* 1. HERO HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="text-center pb-6 sm:pb-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#092B20] tracking-tight uppercase leading-[1.15]">
            Terms &amp; Conditions
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* 2. DIRECT EDITORIAL CONTENT (NO BOX CONTAINER)                            */}
        {/* ========================================================================= */}
        <div className="mt-4 sm:mt-6 space-y-8 sm:space-y-11 text-sm sm:text-base md:text-[17px] text-[#383229] leading-relaxed font-sans">
          {/* Introductory Mission Statement */}
          <p className="text-base sm:text-lg md:text-[19px] text-[#1C1B18] font-normal leading-relaxed">
            Welcome to Kurma. By accessing our website and purchasing our products, you agree to
            comply with and be bound by the following terms and conditions. Please review them
            carefully.
          </p>

          {/* Section 1 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              1. Eligibility
            </h2>
            <p>
              You must be at least 18 years old or accessing the site under the supervision of a
              parent or legal guardian to use this website and make a purchase.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              2. Products &amp; Pricing
            </h2>
            <p>
              All prices are displayed in Indian Rupees (INR) and are inclusive of GST unless stated
              otherwise. Product descriptions and prices are subject to change without prior notice.
              We strive for accuracy in depicting our handcrafted brass, natural incense, and curated
              gift trunks, but do not warrant that product descriptions or other content are entirely
              error-free.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              3. Orders &amp; Payments
            </h2>
            <p>
              We reserve the right to refuse or cancel any order for any reason, including limitations
              on quantities available, inaccuracies in product or pricing information, or issues
              identified by our fraud avoidance department. Payment must be completed through
              authorized payment methods available at checkout.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              4. Shipping &amp; Delivery
            </h2>
            <p>
              Please refer to our{" "}
              <Link
                href="/shipping-policy"
                className="text-[#8C6D23] font-semibold underline underline-offset-4 hover:text-[#092B20] transition-colors"
              >
                Shipping Policy
              </Link>{" "}
              for detailed information on processing times, delivery estimates, and costs. Kurma is not
              liable for any delays in delivery caused by courier partners or circumstances beyond our
              control.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              5. Returns &amp; Exchanges
            </h2>
            <p>
              All returns and exchanges are subject to our official{" "}
              <Link
                href="/refund-policy"
                className="text-[#8C6D23] font-semibold underline underline-offset-4 hover:text-[#092B20] transition-colors"
              >
                Refund Policy
              </Link>
              . By making a purchase, you agree to the terms outlined in that policy.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              6. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, graphics, logos, images, ritual guides,
              packaging architecture, and software, is the property of Kurma and is protected by
              Indian and international copyright and trademark laws. Any unauthorized use is strictly
              prohibited.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              7. User Conduct
            </h2>
            <p>
              You agree not to use this site for any unlawful purpose or to post any content that is
              offensive, defamatory, or harmful. We reserve the right to terminate your access for
              violating these terms.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 sm:space-y-3.5">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              8. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Kurma shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of this website or the
              purchase of any products.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
