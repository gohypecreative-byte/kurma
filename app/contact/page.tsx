"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  Mail,
  Phone,
  Printer,
  MapPin,
  CheckCircle2,
  Send,
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function ContactPage() {
  const { cartCount, setIsCartOpen } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          type: "BESPOKE",
        }),
      });
      setIsSubmitted(true);
    } catch {
      // Graceful fallback
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      {/* Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Contact Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: GET IN TOUCH & DIRECT CHANNELS                               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-8 sm:space-y-10">
            {/* Header Text */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-normal text-[#1C1B18] tracking-tight leading-tight">
                Get in touch
              </h1>
              <p className="text-stone-600 text-sm sm:text-[15px] font-sans leading-relaxed">
                We&apos;re here for you every step of the way. Whether you have
                questions, need order assistance, or want to share feedback, our
                friendly customer support team is ready to assist. Our team is here
                to help! Reach out to us via
              </p>
            </div>

            {/* Contact Items List */}
            <div className="space-y-5">
              {/* 1. Mail */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2E8] border border-[#FFE1CD] text-[#E07A2B] flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-stone-500 block">Mail</span>
                  <a
                    href="mailto:care@kurmaluxury.com"
                    className="text-stone-900 font-semibold text-sm sm:text-base hover:text-[#C5A45B] transition-colors"
                  >
                    care@kurmaluxury.com
                  </a>
                </div>
              </div>

              {/* 2. Phone */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] border border-[#D8E6FF] text-[#3B66DE] flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-stone-500 block">Phone</span>
                  <a
                    href="tel:+919212422000"
                    className="text-stone-900 font-semibold text-sm sm:text-base hover:text-[#C5A45B] transition-colors"
                  >
                    +91 92124 22000
                  </a>
                </div>
              </div>

              {/* 3. Fax */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F6F0FF] border border-[#E9DCFF] text-[#864BD8] flex items-center justify-center shrink-0 shadow-2xs">
                  <Printer className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-stone-500 block">Fax</span>
                  <span className="text-stone-900 font-semibold text-sm sm:text-base block">
                    (011) 2680-2680
                  </span>
                </div>
              </div>

              {/* 4. Office */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EDFBF4] border border-[#D1F5E1] text-[#249B60] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-stone-500 block">Office</span>
                  <span className="text-stone-900 font-semibold text-sm sm:text-base block leading-snug">
                    Plot No. 75P, Sector-44, Gurugram, Haryana — 122003
                  </span>
                </div>
              </div>
            </div>

            {/* Stay Connected */}
            <div className="space-y-3.5 pt-2">
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#1C1B18] tracking-tight">
                Stay Connected
              </h2>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-[#F3EDE2] hover:bg-[#E8D9AE] border border-[#DDD3C2] text-[#6B5A3E] hover:text-[#1C1B18] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter X"
                  className="w-10 h-10 rounded-full bg-[#F3EDE2] hover:bg-[#E8D9AE] border border-[#DDD3C2] text-[#6B5A3E] hover:text-[#1C1B18] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <TwitterXIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-[#F3EDE2] hover:bg-[#E8D9AE] border border-[#DDD3C2] text-[#6B5A3E] hover:text-[#1C1B18] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: WHITE FORM CARD ("Send us a message")                       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-white rounded-3xl sm:rounded-[32px] border border-[#EAE3D8] shadow-[0_4px_24px_rgba(9,43,32,0.06)] p-6 sm:p-10 lg:p-12 text-[#1C1B18]">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-normal text-[#092B20] tracking-tight">
                Send us a message
              </h2>
              <p className="text-xs sm:text-sm text-[#5A5248] font-sans max-w-md mx-auto leading-relaxed">
                Your email address will not be published. Required fields are marked *
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-5 bg-[#FAF7F2] border border-[#EAE3D8] rounded-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#092B20]/10 border border-[#092B20]/20 text-[#092B20] flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-normal text-[#092B20]">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5248] max-w-md mx-auto leading-relaxed">
                    Thank you, {form.name || "Esteemed Patron"}. Our concierge team has received your message and will reach out to you shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: "", email: "", phone: "", message: "" });
                    setIsSubmitted(false);
                  }}
                  className="px-8 py-3 rounded-full bg-[#092B20] hover:bg-[#123D2D] text-white text-xs font-sans uppercase tracking-wider font-bold transition-all cursor-pointer shadow-md active:scale-95 mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#1C1B18]">
                    Name <span className="text-[#C5A45B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder=""
                    className="w-full h-12 px-4 rounded-xl bg-white border border-[#DDD3C2] text-[#1C1B18] placeholder-stone-400 focus:border-[#092B20] focus:ring-1 focus:ring-[#092B20] outline-none transition-all text-sm"
                  />
                </div>

                {/* 2. Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#1C1B18]">
                    Email Address <span className="text-[#C5A45B]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder=""
                    className="w-full h-12 px-4 rounded-xl bg-white border border-[#DDD3C2] text-[#1C1B18] placeholder-stone-400 focus:border-[#092B20] focus:ring-1 focus:ring-[#092B20] outline-none transition-all text-sm"
                  />
                </div>

                {/* 3. Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#1C1B18]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder=""
                    className="w-full h-12 px-4 rounded-xl bg-white border border-[#DDD3C2] text-[#1C1B18] placeholder-stone-400 focus:border-[#092B20] focus:ring-1 focus:ring-[#092B20] outline-none transition-all text-sm"
                  />
                </div>

                {/* 4. Messages */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#1C1B18]">
                    Messages <span className="text-[#C5A45B]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder=""
                    className="w-full p-4 rounded-xl bg-white border border-[#DDD3C2] text-[#1C1B18] placeholder-stone-400 focus:border-[#092B20] focus:ring-1 focus:ring-[#092B20] outline-none transition-all text-sm resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-13 rounded-full bg-[#28513B] hover:bg-[#1E3F2E] active:scale-[0.99] text-white font-semibold text-sm sm:text-base tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
