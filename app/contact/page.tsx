"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building,
  ArrowRight,
  MessageSquare,
  ChevronDown,
  HelpCircle,
  Award,
  Globe,
} from "lucide-react";

export default function ContactPage() {
  const { cartCount, setIsCartOpen } = useCart();

  // Inquiry Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    inquiryType: "corporate",
    quantity: "25-100",
    budget: "₹25k–₹1 Lakh",
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

  const inquiryTypes = [
    { id: "corporate", label: "Executive Corporate Gifting" },
    { id: "wedding", label: "Weddings & Celebrations" },
    { id: "bespoke", label: "Custom Engraved Heirloom" },
    { id: "retail", label: "Retail & Boutique Partnership" },
  ];

  const quantityOptions = [
    { label: "1 – 10 (Personal)", value: "1-10" },
    { label: "10 – 50 (Executive)", value: "10-50" },
    { label: "50 – 200 (Celebration)", value: "50-200" },
    { label: "200+ (Enterprise Bulk)", value: "200+" },
  ];

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 1. LUXURY HERO BANNER */}
      <section className="w-full bg-[#072515] bg-[radial-gradient(ellipse_at_center,#0b3822_0%,#04160d_100%)] border-b border-[#eed08e]/30 text-white relative overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#eed08e]/50 bg-[#0c3823]/80 text-[#eed08e] text-xs font-serif tracking-widest uppercase">
            <span>Sacred Concierge &amp; Bespoke Atelier</span>
          </div>

          {/* Heading */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white tracking-wide leading-tight">
              Connect With Our Fragrance Masters
            </h1>
            <p className="text-xl sm:text-2xl font-serif italic text-[#eed08e]">
              &amp; Heirloom Gifting Concierge
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="h-px w-20 sm:w-28 bg-gradient-to-r from-transparent via-[#eed08e]/70 to-transparent" />
            <div className="w-2 h-2 rotate-45 border border-[#eed08e] bg-[#072515]" />
            <div className="h-px w-20 sm:w-28 bg-gradient-to-r from-transparent via-[#eed08e]/70 to-transparent" />
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans max-w-2xl mx-auto">
            Whether curating gold-embossed keepsake trunks for executive conferences, sacred wedding favors, or bespoke brass engravings—our Mysore atelier is at your service.
          </p>

          {/* Reassurance Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-stone-300 font-sans">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#eed08e]" />
              <span>4-Hour Concierge Response</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#eed08e]" />
              <span>Free Brass Plaque Engraving (25+ units)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#eed08e]" />
              <span>Worldwide Insured Dispatch</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. MAIN TWO-COLUMN CONTACT STAGE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Direct Channels & Ateliers */}
          <div className="lg:col-span-5 space-y-6">
            {/* Instant Concierge Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold">
                  Instant Support
                </span>
                <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal mt-0.5">
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

            {/* Visual Bespoke Showcase */}
            <div className="bg-[#072515] rounded-3xl p-6 text-white border border-[#eed08e]/30 relative overflow-hidden space-y-4">
              <div className="flex items-center gap-2 text-xs font-serif uppercase text-[#eed08e]">
                <Award className="w-4 h-4 text-[#eed08e]" />
                <span>Executive Privileges</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Looking to experience our elemental fragrances firsthand? Request complimentary scent discovery scrolls and tactile box samples for orders over 50 units.
              </p>
              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                <Image
                  src="/images/product/suite-clean.png"
                  alt="Kurma 5 Elements Complete Suite"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Unified Bespoke Consultation Dossier */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold">
                Bespoke Inscription
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal mt-0.5">
                Request a Custom Consultation
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-1">
                Fill the inquiry dossier below and our gifting concierge will respond within 4 business hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 bg-[#FAF8F5] border border-[#eed08e]/80 rounded-2xl p-8 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center mx-auto shadow-md">
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
                  className="px-6 py-2.5 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#0c3823] transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-xs font-sans">
                {/* Inquiry Type Chips */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                    Inquiry Category *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {inquiryTypes.map((type) => (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => setForm({ ...form, inquiryType: type.id })}
                        className={`p-2.5 rounded-xl text-[11px] font-medium border text-left transition-all cursor-pointer ${
                          form.inquiryType === type.id
                            ? "bg-[#072515] text-[#eed08e] border-[#072515] shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

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

                {/* Estimated Quantity Chips */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                    Estimated Gift Quantity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {quantityOptions.map((q) => (
                      <button
                        type="button"
                        key={q.value}
                        onClick={() => setForm({ ...form, quantity: q.value })}
                        className={`p-2.5 rounded-xl text-[11px] font-medium border text-center transition-all cursor-pointer ${
                          form.quantity === q.value
                            ? "bg-[#072515] text-[#eed08e] border-[#072515]"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message / Bespoke Inscription */}
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
                  className="w-full py-4 px-6 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
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
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Bespoke Gifting &amp; Concierge Guidance
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Everything you need to know about custom engravings, turnaround times, and delivery privileges.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-stone-100">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#8b5f10] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 group-hover:text-[#8b5f10] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#8b5f10]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="mt-2.5 text-xs text-stone-600 leading-relaxed font-sans pr-6 animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. DISCOVER COLLECTIONS QUICK CALLOUT */}
        <section className="rounded-3xl bg-gradient-to-r from-[#072515] to-[#0e3b24] text-white p-8 sm:p-12 border border-[#eed08e]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Prefer to Browse Our Ready Collections?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Explore our handcrafted 5 Element luxury fragrance suites, solid cast brass burners, and heirloom keepsake trunks.
            </p>
          </div>
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-[#eed08e] hover:bg-[#f7e8c4] text-[#072515] text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 active:scale-98"
          >
            Explore Master Shop ↗
          </Link>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
