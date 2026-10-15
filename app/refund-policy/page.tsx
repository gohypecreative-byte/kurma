"use client";

import { LegalLayout } from "@/components/legal/legal-layout";

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Cancellation & Refund"
      titleHighlight="Policy"
      subtitle="Peace of mind with every heirloom. Our 7-Day Transit Shield and straightforward, transparent resolution policy."
      lastUpdated="October 2026"
    >
      <article className="space-y-6 text-stone-700 font-sans text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold block mb-1">
            Section 4 • Customer Shield &amp; Guarantees
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
            Cancellation &amp; Refund Policy
          </h2>
        </div>

        {/* Highlight Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#fbf6ea] border border-[#eed08e]/40 space-y-1">
            <span className="text-[11px] font-bold text-[#8b5f10] uppercase tracking-wider block">
              7-Day Transit Shield
            </span>
            <p className="text-xs text-stone-700 font-medium">
              Free 24h replacement for any rare transit breakage with zero return courier costs.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Pre-Dispatch Cancellation
            </span>
            <p className="text-xs text-stone-700 font-medium">
              100% full refund before warehouse hand-off with zero cancellation penalty.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            1. 7-Day Damaged Transit Replacement Guarantee
          </h3>
          <p>
            While transit breakages are exceptionally rare (&lt; 0.2%), if your order arrives damaged, shattered, or with missing pieces due to courier mishandling:
          </p>
          <div className="bg-[#fbf6ea] p-4 sm:p-5 rounded-2xl border border-[#eed08e]/50 space-y-2">
            <p className="font-semibold text-stone-900">
              Simple 3-step resolution process:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-stone-700">
              <li>
                Notify our concierge via WhatsApp (<strong>+91 99999 99999</strong>) or email (<em>concierge@kurma.co.in</em>) within <strong>7 days of delivery</strong>.
              </li>
              <li>
                Attach 2–3 clear photographs of the outer transit carton and the damaged product.
              </li>
              <li>
                We will dispatch a brand-new pristine replacement within <strong>24 hours</strong> with zero reverse shipping fees charged to you.
              </li>
            </ol>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            2. Order Cancellations
          </h3>
          <p>
            Standard orders may be cancelled for a 100% full refund before dispatch from our atelier (typically within 4 hours of placing the order). Once an order has been collected by the courier partner, it cannot be recalled while in transit.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            3. Refund Settlement Timelines
          </h3>
          <p>
            Approved refunds are credited directly back to the original source payment method (Credit/Debit Card, Netbanking, or UPI Account) within <strong>5 to 7 business days</strong> in compliance with standard Indian banking clearance protocols.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            4. Non-Returnable Items
          </h3>
          <p>
            Due to sacred hygienic standards and the personalized nature of bespoke gifting:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-600">
            <li>Incense boxes where the tamper-evident gold safety seal has been opened or burnt.</li>
            <li>Trunks with personalized laser-engraved brass plaques or customized monogrammed names.</li>
            <li>Items purchased during final warehouse clearance festive flash sales.</li>
          </ul>
        </div>
      </article>
    </LegalLayout>
  );
}
