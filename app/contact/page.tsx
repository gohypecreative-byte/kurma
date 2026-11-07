"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { RealisticSmoke } from "@/components/home/realistic-smoke";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  Building,
  ArrowRight,
  MessageSquare,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const { cartCount, setIsCartOpen } = useCart();

  // Inquiry Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const faqs = [
    {
      q: "Can we personalize the gift trunk with our company logo or family initials?",
      a: "Yes. For orders of 25 units or more, our Moradabad brass artisans hand-chisel or laser-engrave custom brass nameplates with your company insignia, family monogram, or auspicious Sanskrit blessing. Lid gold foil debossing is also available on wooden MDF trunks.",
    },
    {
      q: "What is the expected lead time for bespoke and custom engraved orders?",
      a: "Standard in-stock suites dispatch within 24 to 48 hours. For bespoke brass engraved plaques or personalized gift trunks, turnaround is typically 4 to 7 business days depending on volume. Urgent express dispatch can be arranged upon request.",
    },
    {
      q: "Are Kurma incense formulations 100% non-toxic and charcoal-free?",
      a: "All Kurma incense sticks are handcrafted in Mysore using 100% charcoal-free organic flower powders, pure Mysore sandalwood, and natural essential oils. They produce delicate fragrant diffusion without toxic black residue, safe for enclosed sanctuaries, infants, and daily morning pooja.",
    },
    {
      q: "Do you offer doorstep dispatch to multiple corporate addresses worldwide?",
      a: "Yes. Our concierge coordinates single-point consolidated shipments as well as multi-address direct-to-recipient deliveries across India, UAE, UK, Singapore, and the USA with complete tracking and transit insurance.",
    },
    {
      q: "Can we curate a custom combination of fragrances for our hampers?",
      a: "Absolutely. You can tailor your gift suite with your preferred selection among Earth, Water, Fire, Air, Space, Royal Mysore Chandan, and Temple Flora. Our concierge will supply curated scent sampling kits for bulk orders.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      {/* Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 1. LUXURY HERO BANNER */}
      <section className="w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] bg-[#EDE1D1] border-b border-[#DDD3C2] text-[#1C1B18] relative overflow-hidden flex items-center py-14 sm:py-18 lg:py-20 select-none">
        {/* Full-bleed background image - Heirloom Gifting Box & Lit Incense */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Image
            src="/images/contact/contact-banner-no-smoke.jpg"
            alt="Kurma Heirloom Gifting Box, Mysore Incense and Burning Fragrant Stick"
            fill
            priority
            className="object-cover object-right md:object-[center_35%]"
            sizes="100vw"
          />
          {/* Realistic Flowing Sandalwood Smoke Animation */}
          <RealisticSmoke preset="contact" />
        </div>

        {/* Content Container - Left-aligned to sit naturally in the clean beige space without overlapping products */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl lg:max-w-[600px] text-left">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-5xl font-serif font-normal text-[#1C1B18] tracking-tight leading-[1.15]">
              Connect With Our Fragrance Masters
            </h1>
          </div>
        </div>
      </section>

      {/* 2. MAIN TWO-COLUMN CONTACT STAGE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Direct Channels & Ateliers */}
          <div className="lg:col-span-5 space-y-6">
            {/* Instant Concierge Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-8 space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
                  Direct Concierge Channels
                </h2>
              </div>

              {/* Instant WhatsApp Action */}
              <a
                href="https://wa.me/919212422000?text=Hello%20Kurma%20Concierge,%20I%20would%20like%20to%20inquire%20about%20bespoke%20fragrance%20gifting."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp with Concierge</span>
              </a>

              {/* Direct Info List */}
              <div className="space-y-4 text-xs font-sans text-stone-600 pt-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-stone-200 text-[#8b5f10] flex items-center justify-center shrink-0 shadow-2xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px] uppercase tracking-wide">
                      Direct Concierge Line
                    </span>
                    <a
                      href="tel:+919212422000"
                      className="mt-0.5 block hover:text-[#8b5f10] transition-colors font-medium text-stone-700"
                    >
                      +91 92124 22000 / +91-11-26802680
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-stone-200 text-[#8b5f10] flex items-center justify-center shrink-0 shadow-2xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px] uppercase tracking-wide">
                      Electronic Correspondence
                    </span>
                    <a
                      href="mailto:concierge@kurma.com"
                      className="mt-0.5 block hover:text-[#8b5f10] transition-colors font-medium text-stone-700 break-all sm:break-normal"
                    >
                      concierge@kurma.com / corporate@kurma.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-stone-200 text-[#8b5f10] flex items-center justify-center shrink-0 shadow-2xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px] uppercase tracking-wide">
                      Atelier Hours
                    </span>
                    <p className="mt-0.5 leading-relaxed text-stone-600">
                      Monday to Saturday: 9:30 AM – 7:00 PM IST<br />
                      Sunday: Reserved for Meditation &amp; Prayer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Locations Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-lg font-normal text-stone-900 border-b border-stone-100 pb-3">
                Sanctuary Headquarters &amp; Foundries
              </h3>

              <div className="space-y-4 text-xs font-sans text-stone-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-stone-200 text-[#8b5f10] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px] uppercase">
                      Corporate Office
                    </span>
                    <p className="mt-0.5 leading-relaxed">
                      Kurma Impressions Private Limited<br />
                      Plot No. 75P, Sector-44, Gurugram,<br />
                      Haryana — 122003, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-stone-200 text-[#8b5f10] flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px] uppercase">
                      Artisan Craft Guilds
                    </span>
                    <p className="mt-0.5 leading-relaxed">
                      • Mysore Botanical Collectives (Karnataka)<br />
                      • Moradabad Brass Guild (Uttar Pradesh)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Unified Bespoke Consultation Dossier */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-8 lg:p-10 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal mt-0.5">
                Request a Custom Consultation
              </h2>
              
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 bg-[#FAF8F5] border border-[#eed08e]/80 rounded-2xl p-8 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-[#1E1E1C] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-normal text-stone-900">
                    Sacred Inscription Received
                  </h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {form.name || "Esteemed Patron"}. Our dedicated corporate gifting officer will connect with you via WhatsApp &amp; phone shortly with tailored catalog previews and bespoke arrangement details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#0c3823] transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-xs font-sans">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Aditya Singhania"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                      Official / Personal Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="aditya@enterprise.com"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                      Company / Occasion Name
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Tata Consultancy or Wedding"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                    Personalization &amp; Event Details
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about desired brass plaque engraving, required delivery date, preferred elements, or festive requirements..."
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sealing Inscription...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Sacred Inquiry to Concierge</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. CONCIERGE FAQ ACCORDION SECTION */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-8 sm:p-12 md:p-16 space-y-8 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-[40px] font-serif text-stone-900 font-normal tracking-tight">
              Bespoke Gifting &amp; Concierge Guidance
            </h2>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-stone-200/70">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setOpenFaqIndex(index)}
                  className="py-5 sm:py-6.5 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 sm:gap-6 cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-base sm:text-lg md:text-[19px] transition-colors leading-snug ${
                        isOpen
                          ? "text-[#8b5f10] font-semibold"
                          : "text-stone-900 font-medium group-hover:text-[#8b5f10]"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOpen
                          ? "bg-[#FAF5EC] text-[#8b5f10] rotate-180 shadow-2xs"
                          : "bg-stone-50 text-stone-400 group-hover:bg-[#FAF5EC] group-hover:text-[#8b5f10]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3.5 text-sm sm:text-[15px] md:text-base text-stone-600 leading-relaxed font-sans pr-8 sm:pr-14">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
