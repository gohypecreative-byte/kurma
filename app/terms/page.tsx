"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LegalLayout } from "@/components/legal/legal-layout";

function TermsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab === "privacy") {
      router.replace("/privacy");
    } else if (tab === "shipping") {
      router.replace("/shipping-policy");
    } else if (tab === "refunds") {
      router.replace("/refund-policy");
    }
  }, [tab, router]);

  return (
    <LegalLayout
      title="Terms of Service &"
      titleHighlight="Sanctuary Policies"
      subtitle="Transparent, fair, and crafted with the same uncompromising integrity as our hand-cast brass and sacred charcoal-free agarbatti."
      lastUpdated="October 2026"
    >
      <article className="space-y-6 text-stone-700 font-sans text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold block mb-1">
            Section 1 • General Use
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
            Terms &amp; Conditions of Service
          </h2>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            1. Acceptance of Terms &amp; Brand Identity
          </h3>
          <p>
            Welcome to <strong>Kurma</strong> (operating via <em>kurma.co.in</em> / <em>gohypecreative-byte/kurma</em>). By browsing, accessing, or purchasing through this website, you agree to be bound by these Terms and Conditions, all applicable laws and regulations of the Republic of India, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            2. Artisanal Handcrafted Authenticity &amp; Product Variance
          </h3>
          <p>
            All Kurma brass holders, turtle burners, and medallions are individually cast in virgin brass by master metalsmiths in Moradabad, India. Minor variations in antique patina, repoussé detailing, weight (+/- 5%), and natural brass oxidation are organic hallmarks of traditional Indian metalcraft and shall not be classified as manufacturing defects.
          </p>
          <p>
            Our sacred agarbatti sticks are 100% charcoal-free, rolled using botanical wood powders, organic flower resins, and essential oils. Burn times average 55–65 minutes per stick depending on ambient room draft.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            3. Pricing, Taxes &amp; GST Invoicing
          </h3>
          <p>
            All retail product prices displayed on the website are inclusive of applicable Goods and Services Tax (GST) under Indian tax laws. A valid GST tax invoice is automatically generated upon order confirmation and emailed with dispatch tracking details. For registered corporate entities claiming input tax credit, GSTIN numbers must be entered during checkout or bespoke consultation.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            4. Personalization &amp; Customization Rules
          </h3>
          <p>
            Customizations such as lid monogram foil debossing, engraved brass plaques, wax seals, and handwritten message scrolls are executed in strict accordance with the text provided by the customer. Customers are solely responsible for verifying correct spelling, honorifics, and dates. Personalized items cannot be returned or refunded once laser engraving or hot-foil stamping has commenced.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            5. Intellectual Property &amp; Sacred Trade Dress
          </h3>
          <p>
            The Kurma name, stylized turtle emblem, Pancha Mahabhuta iconography, bespoke trunk packaging architecture, and editorial ritual guides are proprietary intellectual property protected under Indian Trademark, Copyright, and Design Acts. Reproduction, reselling, or commercial imitation without prior written authorization is strictly prohibited.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
            6. Governing Law &amp; Judicial Jurisdiction
          </h3>
          <p>
            These terms and conditions are governed by and construed in accordance with the substantive laws of the Republic of India. Any disputes arising out of or in connection with the website or purchase contracts shall be subject to the exclusive jurisdiction of the competent courts in <strong>New Delhi, India</strong>.
          </p>
        </div>
      </article>
    </LegalLayout>
  );
}

export default function TermsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#8b5f10] border-t-transparent animate-spin" />
        </div>
      }
    >
      <TermsPageContent />
    </Suspense>
  );
}
