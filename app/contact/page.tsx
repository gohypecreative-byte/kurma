"use client";

import { useState } from "react";
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
  Gift,
} from "lucide-react";

export default function ContactPage() {
  const { cartCount, setIsCartOpen } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "corporate",
    quantity: "25-100",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gifting Inquiry Form State (Transferred from Home Page)
  const [giftingForm, setGiftingForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    budget: "",
    quantity: "",
    message: "",
  });
  const [giftingSubmitted, setGiftingSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const handleGiftingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGiftingSubmitted(true);
    setTimeout(() => {
      setGiftingSubmitted(false);
      setGiftingForm({
        name: "",
        phone: "",
        email: "",
        company: "",
        budget: "",
        quantity: "",
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Navbar */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-stone-400">
          <Link href="/" className="hover:text-stone-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <span className="text-stone-800 font-medium">Contact Concierge</span>
        </nav>

        {/* HERO SECTION */}
        <div className="max-w-3xl space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#eed08e]/70 bg-[#fbf6ea] text-[#8b5f10] text-[10.5px] sm:text-xs font-cinzel tracking-widest uppercase font-bold">
            <span>Sacred Concierge &amp; Corporate Inquiries</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-stone-900 leading-tight">
            Connect With Our Fragrance Masters.
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans max-w-2xl">
            Whether curating bespoke debossed gift trunks for executive conferences, wedding celebration favors, or seeking personalized fragrance consultation, our Mysore atelier is at your service.
          </p>
        </div>

        {/* MAIN TWO-COLUMN CONTACT STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Contact Details & Ateliers */}
          <div className="lg:col-span-5 space-y-6">
            {/* Atelier Information Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-100 pb-3">
                Sanctuary Headquarters
              </h2>

              <div className="space-y-4 text-xs font-sans text-stone-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fbf6ea] border border-[#eed08e]/80 text-[#8b5f10] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block font-cinzel text-[11px] uppercase">
                      Registered Corporate Office
                    </span>
                    <p className="mt-0.5 leading-relaxed">
                      Kurma Impressions Private Limited<br />
                      Plot No. 75P, Sector-44, Gurugram,<br />
                      Haryana — 122003, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fbf6ea] border border-[#eed08e]/80 text-[#8b5f10] flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block font-cinzel text-[11px] uppercase">
                      Artisan Fragrance Foundry
                    </span>
                    <p className="mt-0.5 leading-relaxed">
                      Mysore Botanical Collectives, Karnataka &amp;<br />
                      Moradabad Brass Guild, Uttar Pradesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fbf6ea] border border-[#eed08e]/80 text-[#8b5f10] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block font-cinzel text-[11px] uppercase">
                      Direct Concierge Line
                    </span>
                    <a
                      href="tel:+919212422000"
                      className="mt-0.5 block hover:text-[#8b5f10] transition-colors font-medium"
                    >
                      +91 92124 22000 / +91-11-26802680
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fbf6ea] border border-[#eed08e]/80 text-[#8b5f10] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block font-cinzel text-[11px] uppercase">
                      Electronic Correspondence
                    </span>
                    <a
                      href="mailto:concierge@kurma.com"
                      className="mt-0.5 block hover:text-[#8b5f10] transition-colors font-medium"
                    >
                      concierge@kurma.com / corporate@kurma.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fbf6ea] border border-[#eed08e]/80 text-[#8b5f10] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block font-cinzel text-[11px] uppercase">
                      Atelier Hours
                    </span>
                    <p className="mt-0.5 leading-relaxed">
                      Monday to Saturday: 9:30 AM – 7:00 PM IST<br />
                      Sunday: Reserved for Meditation &amp; Prayer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Assurance Badge */}
            <div className="bg-[#072515] bg-[url('/images/textures/green-texture.png')] bg-repeat text-white rounded-3xl p-6 border border-[#eed08e]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-cinzel uppercase text-[#eed08e] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#eed08e]" />
                <span>Executive Corporate Gifting Privileges</span>
              </div>
              <ul className="text-xs text-stone-300 space-y-2">
                <li>• Free Brass Plaque Company Logo Engraving on orders 25+</li>
                <li>• Insured Doorstep Delivery across India, UAE, UK, Singapore &amp; USA</li>
                <li>• Custom Deckle-Edge Scroll with Chairman / Founder Message</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#8b5f10] font-bold">
                Bespoke Inscription
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal mt-0.5">
                Request a Custom Consultation
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-1">
                Fill the sacred dossier below and our gifting concierge will respond within 4 business hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 bg-[#fbf6ea] border border-[#eed08e] rounded-2xl p-8 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-normal text-stone-900">
                    Sacred Inscription Received
                  </h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto">
                    Thank you, {form.name || "Esteemed Patron"}. Our dedicated corporate gifting officer will contact you via WhatsApp / Phone shortly with tailored catalogs and sample arrangements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-cinzel uppercase tracking-wider font-semibold hover:bg-[#0c3823] transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Aditya Singhania"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-700">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    Official / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="aditya@enterprise.com"
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                  />
                </div>

                {/* Inquiry Type & Estimated Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-700">
                      Occasion / Purpose
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden cursor-pointer"
                    >
                      <option value="corporate">Executive Corporate Gifting</option>
                      <option value="wedding">Wedding &amp; Festive Favors</option>
                      <option value="bespoke">Bespoke Monogrammed Heirloom Trunk</option>
                      <option value="retail">Boutique &amp; Retail Collaboration</option>
                      <option value="general">Personal Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-700">
                      Estimated Gift Units
                    </label>
                    <select
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden cursor-pointer"
                    >
                      <option value="1-10">1 – 10 Pieces (Sanctuary Keepsake)</option>
                      <option value="10-50">10 – 50 Pieces (Executive Hamper)</option>
                      <option value="50-250">50 – 250 Pieces (Corporate Gala / Wedding)</option>
                      <option value="250+">250+ Pieces (Enterprise Bulk Customization)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Message / Personalization details */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    Personalization Needs &amp; Sacred Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your event, desired brass lid engraving, timeline, or preferred elements..."
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-cinzel font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sealing Inscription...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Sacred Inquiry to Concierge</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* GIFTING INQUIRY Section (Transferred from Home Page) */}
        <section id="gifting-inquiry" className="pt-12 sm:pt-16 border-t border-stone-200/80 max-w-3xl mx-auto space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h2 className="font-serif tracking-[0.2em] text-2xl sm:text-3xl font-bold text-[#8b5f10] uppercase">
              GIFTING INQUIRY
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm font-medium max-w-xl mx-auto">
              Share your vision with us, and we&apos;ll create something extraordinary
            </p>
          </div>

          {/* Inquiry Form */}
          <form onSubmit={handleGiftingSubmit} className="space-y-4 sm:space-y-5">
            {/* Row 1: NAME & PHONE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  value={giftingForm.name}
                  onChange={(e) => setGiftingForm({ ...giftingForm, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                  PHONE
                </label>
                <input
                  type="tel"
                  required
                  value={giftingForm.phone}
                  onChange={(e) => setGiftingForm({ ...giftingForm, phone: e.target.value })}
                  placeholder="+91"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Row 2: EMAIL */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                EMAIL
              </label>
              <input
                type="email"
                required
                value={giftingForm.email}
                onChange={(e) => setGiftingForm({ ...giftingForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
              />
            </div>

            {/* Row 3: COMPANY & BUDGET */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                  COMPANY
                </label>
                <input
                  type="text"
                  value={giftingForm.company}
                  onChange={(e) => setGiftingForm({ ...giftingForm, company: e.target.value })}
                  placeholder="Brand or company name"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                  BUDGET
                </label>
                <input
                  type="text"
                  value={giftingForm.budget}
                  onChange={(e) => setGiftingForm({ ...giftingForm, budget: e.target.value })}
                  placeholder="Approximate budget"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Row 4: QUANTITY */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                QUANTITY
              </label>
              <input
                type="text"
                value={giftingForm.quantity}
                onChange={(e) => setGiftingForm({ ...giftingForm, quantity: e.target.value })}
                placeholder="Number of gifts"
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
              />
            </div>

            {/* Row 5: MESSAGE */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                MESSAGE
              </label>
              <textarea
                rows={4}
                value={giftingForm.message}
                onChange={(e) => setGiftingForm({ ...giftingForm, message: e.target.value })}
                placeholder="Looking for festive hampers for clients..."
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-3 text-center">
              <button
                type="submit"
                className="bg-[#8b5f10] hover:bg-[#6f4b0d] text-white px-10 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 active:scale-98"
              >
                <span>SUBMIT INQUIRY</span>
              </button>

              {giftingSubmitted && (
                <p className="text-xs font-bold text-emerald-800 mt-3 animate-in fade-in">
                  Thank you! Your gifting inquiry has been received. Our concierge will contact you shortly.
                </p>
              )}
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
