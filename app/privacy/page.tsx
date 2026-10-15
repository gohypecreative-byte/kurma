"use client";

import { LegalLayout } from "@/components/legal/legal-layout";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy &"
      titleHighlight="Data Protection"
      subtitle="Safeguarding your sanctuary. How Kurma collects, protects, and handles your personal information with absolute discretion."
      lastUpdated="October 2026"
    >
      <article className="space-y-6 text-stone-700 font-sans text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold block mb-1">
            Section 2 • Customer Data &amp; Trust
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
            Privacy Policy &amp; Data Protection
          </h2>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            1. Information We Collect
          </h3>
          <p>
            When you order from Kurma or request bespoke gifting consultations, we collect essential fulfillment data including your full name, shipping and billing address, telephone number, email address, gift recipient details (for bespoke deliveries), and optional corporate GST identification for business invoicing.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            2. Payment Security &amp; Tokenization
          </h3>
          <p>
            We <strong>never store or view your full credit card numbers, CVVs, or UPI PINs</strong>. All financial transactions are processed through RBI-authorized, PCI-DSS Level 1 compliant secure payment gateways (Razorpay, Cashfree, UPI). End-to-end 256-bit SSL encryption secures every transmission between your browser and our servers.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            3. How We Use Your Information
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
            <li>Fulfill and deliver your orders via trusted premium courier partners (BlueDart, Delhivery, DTDC).</li>
            <li>Transmit live SMS and WhatsApp transit alerts, tracking links, and digital GST invoices.</li>
            <li>Verify personalized engravings, brass plaques, and bespoke corporate hamper specifications.</li>
            <li>Distribute occasional festive dispatch invitations and seasonal heirloom releases (with instant 1-click unsubscribe).</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            4. Zero Third-Party Selling Policy
          </h3>
          <p>
            Kurma maintains a strict zero-tolerance policy against selling, renting, or leasing personal customer contact information to commercial advertising brokers, data aggregators, or third parties. Your details remain sacred within our sanctuary.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            5. Cookies &amp; Session Storage
          </h3>
          <p>
            We utilize essential session cookies solely to preserve your active shopping bag, remember your preferred shipping preferences, and gather anonymous aggregated performance metrics to enhance site speed and checkout reliability.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            6. Data Rights &amp; Grievance Redressal
          </h3>
          <p>
            In compliance with the Digital Personal Data Protection Act (DPDPA) and Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, you have the right to inspect, update, or request permanent deletion of your stored customer records at any time by contacting our Privacy Grievance Officer at <em>concierge@kurma.co.in</em>.
          </p>
        </div>
      </article>
    </LegalLayout>
  );
}
