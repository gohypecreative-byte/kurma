"use client";

import { LegalLayout } from "@/components/legal/legal-layout";

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Shipping & Delivery"
      titleHighlight="Policy"
      subtitle="White-glove handling, shock-proof heirloom packaging, and express nationwide transit from our atelier to your sanctuary."
      lastUpdated="October 2026"
    >
      <article className="space-y-6 text-stone-700 font-sans text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold block mb-1">
            Section 3 • Dispatch &amp; Transit Logistics
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
            Shipping &amp; Delivery Policy
          </h2>
        </div>

        {/* Highlight Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#fbf6ea] border border-[#eed08e]/40 space-y-1">
            <span className="text-[11px] font-bold text-[#8b5f10] uppercase tracking-wider block">
              Free Express Shipping
            </span>
            <p className="text-xs text-stone-700 font-medium">
              Complimentary air courier on all retail orders above ₹1,999 across India.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Pan-India Coverage
            </span>
            <p className="text-xs text-stone-700 font-medium">
              Servicing 18,000+ pincodes via BlueDart Air, Delhivery &amp; DTDC.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            1. Dispatch Timelines
          </h3>
          <p>
            Standard non-personalized fragrance suites and accessories are dispatched within <strong>24 business hours</strong> of order placement. Custom engraved brass plaques, monogram trunks, and bespoke hampers require <strong>48 to 72 business hours</strong> for meticulous artisan fabrication and quality inspection.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            2. Estimated Delivery Windows
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-50 font-serif text-stone-900 border-b border-stone-200">
                <tr>
                  <th className="p-3">Destination Region</th>
                  <th className="p-3">Courier Mode</th>
                  <th className="p-3">Estimated Transit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-3 font-medium">Delhi-NCR / Metro Hubs</td>
                  <td className="p-3 text-stone-600">Air Express Courier</td>
                  <td className="p-3 font-semibold text-emerald-800">1 – 2 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata</td>
                  <td className="p-3 text-stone-600">Air Priority Transit</td>
                  <td className="p-3 font-semibold text-emerald-800">2 – 3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Tier 2 &amp; Tier 3 Cities</td>
                  <td className="p-3 text-stone-600">Express Surface/Air</td>
                  <td className="p-3 font-semibold text-emerald-800">3 – 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Northeast &amp; Island Sanctuaries</td>
                  <td className="p-3 text-stone-600">Standard National Courier</td>
                  <td className="p-3 font-semibold text-emerald-800">5 – 7 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            3. Shock-Proof Heirloom Transit Packaging
          </h3>
          <p>
            Every Kurma luxury trunk and solid marble box is cocooned in custom high-density molded pulp inserts, moisture-absorbing silica sachets, and heavy-duty 5-ply corrugated transit master cartons. In the rare event of transit damage, our <strong>7-Day Transit Shield</strong> provides immediate replacement.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            4. Live Real-Time Tracking &amp; Delivery Updates
          </h3>
          <p>
            Once your package is collected by our courier partner, an automated dispatch notification is dispatched via SMS and Email containing your unique Air Waybill (AWB) number and direct tracking link to monitor your order every mile of the way.
          </p>
        </div>
      </article>
    </LegalLayout>
  );
}
