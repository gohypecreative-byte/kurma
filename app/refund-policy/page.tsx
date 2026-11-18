"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";

export default function ReturnsAndExchangesPage() {
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
            Returns &amp; Exchanges
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* 2. DIRECT EDITORIAL CONTENT                                               */}
        {/* ========================================================================= */}
        <div className="mt-4 sm:mt-6 space-y-8 sm:space-y-11 text-sm sm:text-base md:text-[17px] text-[#383229] leading-relaxed font-sans">
          {/* Introductory Mission Statement */}
          <p className="text-base sm:text-lg md:text-[19px] text-[#1C1B18] font-normal leading-relaxed">
            Thank you for shopping with Kurma. We are committed to providing a seamless and premium
            experience. If you are not completely satisfied with your purchase, please review our
            policy below.
          </p>

          {/* Section 1 */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              1. Eligibility for Returns &amp; Exchanges
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>Products may be returned or exchanged within 7 days of delivery.</li>
              <li>
                To be eligible, the item must be unused, unwashed, and in original condition, with all
                tags, packaging, and seal intact.
              </li>
              <li>
                Items with a broken seal are not eligible for return, but may be considered for
                exchange.
              </li>
              <li>
                Each order is eligible for a one-time exchange only, subject to availability.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              2. Return Policy
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>Return requests must be initiated within 7 days from the date of delivery.</li>
              <li>
                A return shipping fee of Rs. 150 will be applicable and deducted from the refund
                amount.
              </li>
              <li>Shipping charges paid at the time of order, if any, are non-refundable.</li>
              <li>
                Refunds will be processed only after the product is received and successfully
                inspected at our warehouse.
              </li>
              <li>Once approved, refunds are issued within 5-7 business days.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              3. Exchange Policy
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                Products may be exchanged for a different size, fragrance, or variant of the same
                item, subject to availability.
              </li>
              <li>Exchange requests must be submitted within 7 days of delivery.</li>
              <li>An exchange fee of Rs. 150 will be charged for processing an exchange.</li>
              <li>Our team will arrange a reverse pickup once the request is approved.</li>
              <li>
                If the requested size, fragrance, or variant is unavailable, you may choose a refund
                or an alternative product.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              4. Non-Returnable Items
            </h2>
            <p className="text-sm sm:text-base md:text-[17px]">
              The following items are not eligible for return or exchange:
            </p>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>Items marked as &ldquo;Final Sale&rdquo; or &ldquo;Non-Returnable&rdquo;.</li>
              <li>
                Customized or personalized products (e.g. monogrammed boxes, custom engraved brass
                plaques), unless received damaged or incorrect.
              </li>
              <li>
                Burned or opened incense sticks, dhoop cones, or opened fragrance cellars due to sacred
                hygienic standards.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              5. Reverse Pickup &amp; Processing
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                Kurma provides reverse pickup services for eligible returns and exchanges across all
                serviceable pincodes.
              </li>
              <li>
                Once the product is received at our warehouse, it will undergo a comprehensive quality
                check.
              </li>
              <li>
                Refunds are processed within 5-7 business days after approval to the original payment
                method.
              </li>
              <li>
                Exchanges are dispatched within 2-3 business days following inspection, subject to
                availability.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              6. Damaged / Defective / Incorrect Products
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                If you receive a damaged, defective, or incorrect product, you must report it within
                48 hours of delivery.
              </li>
              <li>
                Customers are required to provide clear images or an unboxing video for rapid
                verification.
              </li>
              <li>
                Upon approval, Kurma will offer an expedited brand-new replacement or full refund, with
                no return or courier charges applied.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              7. Order Cancellation
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                Orders can be canceled only before they are shipped / dispatched from our atelier.
              </li>
              <li>
                Once shipped, cancellation requests will not be accepted, and the standard return
                policy will apply upon delivery.
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
