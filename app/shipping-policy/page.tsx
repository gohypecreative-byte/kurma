"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";

export default function ShippingPolicyPage() {
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
            Shipping &amp; Delivery Policy
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* 2. DIRECT EDITORIAL CONTENT (NO BOX CONTAINER)                            */}
        {/* ========================================================================= */}
        <div className="mt-4 sm:mt-6 space-y-8 sm:space-y-11 text-sm sm:text-base md:text-[17px] text-[#383229] leading-relaxed font-sans">
          {/* Introductory Mission Statement */}
          <p className="text-base sm:text-lg md:text-[19px] text-[#1C1B18] font-normal leading-relaxed">
            At Kurma, we are committed to providing an elegant, seamless shopping experience — from
            browsing our sacred collections to the moment your order arrives at your door. This
            policy outlines everything you need to know about our shipping process, timelines, and how
            we partner with trusted logistics agencies to deliver your sacred items with white-glove
            care.
          </p>

          {/* Section: Our Shipping & Handling Process */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              Our Shipping &amp; Handling Process
            </h2>
            <p className="text-sm sm:text-base md:text-[17px]">
              Our fulfillment process is designed to be clear and efficient, ensuring you receive
              your handcrafted items safely and as quickly as possible:
            </p>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                <strong className="text-[#1C1B18] font-semibold">Order Processing:</strong> All
                standard orders are carefully inspected and dispatched from our atelier warehouse in
                Faridabad (Delhi-NCR) within 1–2 business days (Monday–Saturday, excluding public
                holidays).
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Artisan Personalization:</strong>{" "}
                Bespoke engraved brass plaques, monogram trunks, and custom hampers require 48 to 72
                business hours for artisan fabrication prior to dispatch.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Shipment Handover:</strong> Once your
                order has passed our stringent multi-point quality inspection, it is cocooned in
                shock-proof protective packaging and handed over to one of our premier logistics
                partners.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Order Confirmation:</strong> You will
                receive a shipment confirmation email and SMS/WhatsApp alert with your tracking ID and
                a direct link to track your package as soon as your order is dispatched.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Handling &amp; Shipping Fees:</strong>{" "}
                We offer{" "}
                <span className="text-[#092B20] font-bold">Complimentary Express Shipping</span> on all
                prepaid orders across India. A nominal ₹49 handling fee applies to orders below ₹999 to
                cover transit insurance.
              </li>
            </ul>
          </section>

          {/* Section: How to Track Your Order */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              How to Track Your Order
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                <strong className="text-[#1C1B18] font-semibold">Simple Telemetry:</strong> Once your
                order is dispatched, you will receive an automated email and SMS containing your
                unique tracking number and the name of the courier partner.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Carrier Activation Window:</strong>{" "}
                Please allow up to 12–24 hours for the tracking link to become fully active on the
                carrier&apos;s live tracking network after handover.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Direct Kurma Tracker:</strong> You
                can track your parcel in real-time right here on our dedicated{" "}
                <Link
                  href="/track-order"
                  className="text-[#8C6D23] font-semibold underline underline-offset-4 hover:text-[#092B20] transition-colors"
                >
                  Track Order Portal
                </Link>{" "}
                using your Order ID or phone number.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Patron Account:</strong> If you have
                an account with us, you can also view live milestone tracking in the &apos;My
                Orders&apos; section of your Kurma profile.
              </li>
            </ul>
          </section>

          {/* Section: If Your Package is Marked "Delivered" But Not Received */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              If Your Package is Marked &ldquo;Delivered&rdquo; But Not Received:
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                First, please check with family members, household staff, neighbours, and building
                security/concierge desks to see if someone accepted the package on your behalf.
              </li>
              <li>
                If you still cannot locate your parcel, you must contact us within{" "}
                <strong className="text-[#1C1B18] font-semibold">48 hours</strong> of the carrier
                marking the status as &ldquo;Delivered&rdquo;.
              </li>
              <li>
                We will launch an immediate investigation with our courier partner, which includes
                retrieving GPS delivery pin coordinates and physical Proof of Delivery (POD). This
                resolution process typically takes 1–2 business days.
              </li>
            </ul>
          </section>

          {/* Section: Cash on Delivery (COD) */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              Cash on Delivery (COD)
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                <strong className="text-[#1C1B18] font-semibold">COD Availability:</strong> Full COD is
                available on standard orders up to ₹4,999 across most serviceable Indian pincodes. For
                orders above ₹4,999, prepaid checkout or Partial COD is required to prevent fraudulent
                dispatches.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Nominal COD Fee:</strong> A ₹99
                handling fee is charged on COD orders to cover two-way courier cash management and is
                non-refundable.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Partial COD:</strong> On select
                heirloom orders above ₹4,999, a 10% advance deposit will be charged upfront
                (non-refundable) and the remaining balance is collected at the time of delivery.
              </li>
            </ul>
          </section>

          {/* Section: Non-Delivery & Return to Origin (RTO) */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              Non-Delivery &amp; Return to Origin (RTO)
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                If a delivery cannot be completed due to an incorrect address, customer unavailability
                after 3 delivery attempts, or refusal to accept the package, the shipment is returned to
                our warehouse. This is called a{" "}
                <strong className="text-[#1C1B18] font-semibold">Return to Origin (RTO)</strong>.
              </li>
              <li>
                An RTO charge of ₹150 will be applicable to cover two-way freight cost for
                customer-side unavailability. For prepaid orders, this amount will be deducted from the
                refund if cancelled.
              </li>
              <li>
                To avoid RTO charges, please double-check your delivery address, landmark, and phone
                number before confirming your order, and ensure someone is available to receive the
                package during delivery hours.
              </li>
              <li>
                If you would like to reattempt delivery, please contact us at{" "}
                <a
                  href="mailto:care@kurma.com"
                  className="text-[#8C6D23] font-semibold underline underline-offset-2 hover:text-[#092B20]"
                >
                  care@kurma.com
                </a>{" "}
                before the package reaches our central warehouse.
              </li>
            </ul>
          </section>

          {/* Section: Other Shipping Information */}
          <section className="space-y-3.5 sm:space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
              Other Shipping Information
            </h2>
            <ul className="space-y-3 pl-5 sm:pl-6 list-disc marker:text-[#8C6D23] text-sm sm:text-base md:text-[16.5px]">
              <li>
                <strong className="text-[#1C1B18] font-semibold">P.O. Boxes:</strong> We are unable to
                ship to P.O. boxes or APO/FPO addresses in India. A complete physical street address is
                mandatory.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">Address Changes:</strong> We cannot
                modify the delivery address once an order has been dispatched and assigned an Air
                Waybill.
              </li>
              <li>
                <strong className="text-[#1C1B18] font-semibold">International Shipping:</strong>{" "}
                Currently, Kurma delivers to all serviceable locations within India. For special
                international consignments, please reach out to our concierge team.
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
