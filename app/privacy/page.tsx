"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";

interface SectionItem {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

export default function PrivacyPage() {
  const { cartCount, setIsCartOpen } = useCart();

  const sections: SectionItem[] = [
    {
      id: "overview",
      number: "1.",
      title: "Overview",
      content: (
        <p>
          At Kurma, we are committed to protecting your privacy and safeguarding your personal
          information with absolute discretion. This Privacy Policy explains what data we collect,
          how we use it, and the choices you have regarding your personal sanctuary.
        </p>
      ),
    },
    {
      id: "information-we-collect",
      number: "2.",
      title: "Information We Collect",
      content: (
        <p>
          We may collect personal information such as your name, email address, phone number,
          shipping address, and payment details when you place an order, customize a gift trunk, or
          create an account. For corporate clients, optional GST credentials are collected for
          statutory tax compliance.
        </p>
      ),
    },
    {
      id: "how-we-use-information",
      number: "3.",
      title: "How We Use Your Information",
      content: (
        <p>
          We use your information to process orders, provide concierge customer support, ensure
          handcrafted atelier dispatch, send real-time tracking alerts, and share relevant heirloom
          offers and festive releases (only if you choose to receive them, with instant one-click
          opt-out).
        </p>
      ),
    },
    {
      id: "data-sharing",
      number: "4.",
      title: "Data Sharing",
      content: (
        <p>
          We maintain a strict zero-tolerance policy against selling or renting your personal
          information. We only share essential delivery data with trusted partners such as
          authorized payment gateways, express courier partners (e.g. BlueDart), and verified
          service providers to complete your order and enhance your experience.
        </p>
      ),
    },
    {
      id: "data-security",
      number: "5.",
      title: "Data Security",
      content: (
        <p>
          We use industry-standard security measures, including 256-bit SSL encryption, PCI-DSS
          compliant payment tokenization, and protected servers, to protect your information from
          unauthorized access, alteration, or disclosure.
        </p>
      ),
    },
    {
      id: "your-rights",
      number: "6.",
      title: "Your Rights",
      content: (
        <p>
          In accordance with the Digital Personal Data Protection Act (DPDPA), you have the right
          to access, update, inspect, or delete your personal information from our active records.
          You can also opt out of promotional communications at any time.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1B18] selection:bg-[#EADBCC] font-sans">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-28">
        {/* ========================================================================= */}
        {/* 1. HERO HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="text-center pb-6 sm:pb-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#092B20] tracking-tight leading-[1.15]">
            Privacy Policy
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* 2. DIRECT EDITORIAL CONTENT (NO BOXES)                                    */}
        {/* ========================================================================= */}
        <div className="mt-4 sm:mt-6 space-y-8 sm:space-y-11 text-sm sm:text-base md:text-[17px] text-[#383229] leading-relaxed font-sans">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="space-y-3 sm:space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold text-[#092B20] tracking-tight">
                <span>{sec.number} </span>
                <span>{sec.title}</span>
              </h2>
              <div className="text-sm sm:text-base md:text-[17px] text-[#383229] leading-relaxed font-sans">
                {sec.content}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
