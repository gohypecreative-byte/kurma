"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  Scale,
  HelpCircle,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface LegalLayoutProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  lastUpdated?: string;
  hideBadge?: boolean;
  hideLastUpdated?: boolean;
  hideBreadcrumb?: boolean;
  hideTrustBadges?: boolean;
  children: React.ReactNode;
}

export function LegalLayout({
  badge = "Kurma Legal & Compliance Hub",
  title,
  titleHighlight,
  subtitle,
  lastUpdated = "October 2026",
  hideBadge = false,
  hideLastUpdated = false,
  hideBreadcrumb = false,
  hideTrustBadges = false,
  children,
}: LegalLayoutProps) {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      {/* Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Hero Header */}
      <section className="w-full bg-[#ECE4D8] border-b border-[#DDD3C2] text-[#1C1B18] relative overflow-hidden py-10 sm:py-18">
        <div className="absolute inset-0 bg-[radial-gradient(#eed08e_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3.5">
          {!hideBadge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5f10]/10 border border-[#8b5f10]/25 text-[#8b5f10] text-[11px] font-serif uppercase tracking-widest">
              <Scale className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
          )}

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-[#1C1B18] tracking-tight leading-tight">
            {title}{" "}
            {titleHighlight && (
              <span className="italic font-serif font-normal text-[#8b5f10]">
                {titleHighlight}
              </span>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {!hideLastUpdated && (
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10.5px] sm:text-[11px] text-stone-500 font-sans tracking-wide">
              <span>Last Updated: {lastUpdated}</span>
              <span className="hidden sm:inline">•</span>
              <span>Compliant with Indian E-Commerce Rules</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Breadcrumb */}
        {!hideBreadcrumb && (
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-5 font-sans">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-stone-800 font-medium truncate max-w-[220px] sm:max-w-none">
              {title} {titleHighlight}
            </span>
          </div>
        )}

        {/* 2-Column Grid: Policy Document + Contact & Trust Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Policy Document (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-8 md:p-10 shadow-xs space-y-6 sm:space-y-8">
            {children}
          </div>

          {/* Quick Help & Grievance Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-[#ECE4D8] text-[#1C1B18] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#DDD3C2] space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8b5f10]/15 border border-[#8b5f10]/30 flex items-center justify-center text-[#8b5f10]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    Need Clarification?
                  </h4>
                  <p className="text-[11px] text-stone-600 font-sans">
                    Kurma Concierge &amp; Legal Desk
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                Have specific queries regarding corporate invoicing, customized plaque engraving, or live shipment tracking?
              </p>

              <div className="space-y-3 pt-1 text-xs font-sans">
                <div className="flex items-center gap-2.5 text-[#8b5f10]">
                  <Mail className="w-4 h-4 shrink-0 text-[#8b5f10]" />
                  <a href="mailto:concierge@kurma.co.in" className="hover:underline font-medium">
                    concierge@kurma.co.in
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-[#8b5f10]">
                  <Phone className="w-4 h-4 shrink-0 text-[#8b5f10]" />
                  <a href="tel:+918005876200" className="hover:underline font-medium">
                    +91 800-KURMA-01 (Mon–Sat, 10am–7pm)
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eed08e]/20">
                <Link
                  href="/contact"
                  className="w-full py-2.5 rounded-xl bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
                >
                  <span>Open Inquiry Ticket</span>
                </Link>
              </div>
            </div>

            {/* Certification Trust Badges */}
            {!hideTrustBadges && (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-6 space-y-4 shadow-xs">
                <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8b5f10]" />
                  <span>Kurma Quality Assurance</span>
                </h4>

                <div className="space-y-3 text-xs text-stone-600 font-sans">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>100% Charcoal-Free:</strong> Zero toxic benzene or chemical binders; certified indoor safe.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Virgin Brass:</strong> Cast by Moradabad hereditary guild metalsmiths with anti-tarnish coating.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Transit Insurance:</strong> Free 24h replacements for any verified courier damages.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
