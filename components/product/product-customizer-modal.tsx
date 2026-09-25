"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  PenTool,
  ShoppingBag,
  Check,
  ShieldCheck,
  Layers,
  Lock,
  ArrowLeft,
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  RotateCcw,
} from "lucide-react";
import { ProductSKU, formatPrice, createCartItemId } from "@/lib/products";
import { CartItem } from "@/components/cart/cart-drawer";

interface ProductCustomizerModalProps {
  product: ProductSKU | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export function ProductCustomizerModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductCustomizerModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8 relative z-10">
        <CustomizerContent
          key={product.id}
          product={product}
          onClose={onClose}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
}

function CustomizerContent({
  product,
  onClose,
  onAddToCart,
}: {
  product: ProductSKU;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [modalStep, setModalStep] = useState<"customize" | "pay" | "success">("customize");

  // Express Pay form state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Initialize custom options directly from product definition without useEffect
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    product.customizationFields.forEach((field) => {
      if (field.defaultValue) {
        initialValues[field.id] = field.defaultValue;
      } else if (field.options && field.options.length > 0) {
        initialValues[field.id] = field.options[0].value;
      } else {
        initialValues[field.id] = "";
      }
    });
    return initialValues;
  });

  // Calculate price with add-ons if any
  let unitPrice = product.price;
  product.customizationFields.forEach((field) => {
    if (field.options) {
      const selectedOption = field.options.find(
        (opt) => opt.value === customValues[field.id]
      );
      if (selectedOption?.priceDelta) {
        unitPrice += selectedOption.priceDelta;
      }
    }
  });

  const totalPrice = unitPrice * quantity;

  const handleFieldChange = (fieldId: string, value: string) => {
    setCustomValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const getReadableCustomizations = () => {
    const readable: Record<string, string> = {};
    product.customizationFields.forEach((field) => {
      const val = customValues[field.id];
      if (val && val.trim() !== "") {
        readable[field.label] = val;
      }
    });
    return readable;
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      id: createCartItemId(product.id),
      skuId: product.id,
      name: product.name,
      price: unitPrice,
      priceDisplay: formatPrice(unitPrice),
      image: selectedImage || product.image,
      quantity,
      customizations: getReadableCustomizations(),
    };

    onAddToCart(item);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const handleProceedToPay = () => {
    setModalStep("pay");
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
      alert("Please fill in recipient name, phone number, and address.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const generatedId = `KRM-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);

      // Also record into cart context
      onAddToCart({
        id: createCartItemId(product.id),
        skuId: product.id,
        name: product.name,
        price: unitPrice,
        priceDisplay: formatPrice(unitPrice),
        image: selectedImage || product.image,
        quantity,
        customizations: getReadableCustomizations(),
      });

      setIsProcessing(false);
      setModalStep("success");
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl bg-white text-stone-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#eed08e]/50 animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[92vh] relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close customizer"
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/40 hover:bg-stone-900/60 text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* LEFT COLUMN: Gallery & Product Visuals */}
      <div className="w-full md:w-5/12 bg-[#072515] p-5 sm:p-7 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Background texture subtle shine */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, #eed08e 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div>
          {/* Category & Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#eed08e]">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-[10px] font-semibold bg-[#eed08e]/20 text-[#eed08e] px-2.5 py-0.5 rounded-full border border-[#eed08e]/40">
                {product.badge}
              </span>
            )}
          </div>

          {/* Main Image Frame */}
          <div className="relative aspect-4/3 w-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#eed08e]/30 shadow-2xl bg-stone-900 flex items-center justify-center">
            <Image
              src={selectedImage || product.image}
              alt={product.name}
              fill
              className="object-contain p-3.5 transition-all duration-300 drop-shadow-md"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>

          {/* Thumbnails (if gallery exists) */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img
                      ? "border-[#eed08e] scale-105 shadow-md"
                      : "border-stone-700/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-contain p-0.5 bg-stone-900"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Highlights Specs at bottom of image panel */}
        <div className="pt-4 border-t border-white/10 mt-4 space-y-1.5 hidden sm:block">
          <h4 className="text-[11px] font-semibold text-[#eed08e] uppercase tracking-wider flex items-center gap-1.5 font-cinzel">
            <Layers className="w-3.5 h-3.5" />
            Sacred Formulation
          </h4>
          <ul className="text-xs text-stone-300 space-y-1">
            {product.details.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-[#eed08e]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form (Customization OR Express Pay OR Success) */}
      <div className="w-full md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto bg-stone-50/50">
        {/* VIEW 1: CUSTOMIZATION FORM */}
        {modalStep === "customize" && (
          <>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#c0881b] font-cinzel tracking-wider uppercase font-bold">
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Bespoke Sacred Customizer</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-tight mt-0.5">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium tracking-wide mt-0.5">
                  {product.subtitle}
                </p>

                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-xl font-bold text-stone-900">
                    {formatPrice(unitPrice)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Free Sacred Shipping
                  </span>
                </div>
              </div>

              {/* SKU Customization Fields */}
              <div className="border-t border-stone-200 pt-3 space-y-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-wider font-cinzel">
                  <PenTool className="w-3.5 h-3.5 text-[#c0881b]" />
                  <span>Personalize Options</span>
                </div>

                {product.customizationFields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-800">
                      {field.label}
                    </label>

                    {field.description && (
                      <p className="text-[11px] text-stone-500">
                        {field.description}
                      </p>
                    )}

                    {/* Text input */}
                    {field.type === "text" && (
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={field.maxLength}
                          value={customValues[field.id] || ""}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                          placeholder={field.placeholder}
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#c0881b] focus:ring-1 focus:ring-[#c0881b] shadow-2xs"
                        />
                        {field.maxLength && (
                          <span className="text-[10px] text-stone-400 absolute right-3 top-2.5">
                            {(customValues[field.id] || "").length}/
                            {field.maxLength}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Radio Options */}
                    {field.type === "radio" && field.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {field.options.map((opt) => {
                          const isSelected = customValues[field.id] === opt.value;
                          return (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() =>
                                handleFieldChange(field.id, opt.value)
                              }
                              className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "border-[#c0881b] bg-[#fbf6ea] font-semibold text-stone-900 shadow-xs"
                                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#c0881b] shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Dropdown Select */}
                    {field.type === "select" && field.options && (
                      <select
                        value={customValues[field.id] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.id, e.target.value)
                        }
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#c0881b] cursor-pointer shadow-2xs"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary & CTAs */}
            <div className="border-t border-stone-200 pt-4 mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-800 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Total</span>
                  <span className="text-lg font-bold text-stone-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Dual Action: Instant Pay NOW (Primary) + Add to Cart (Secondary) */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="flex-1 py-3 px-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-500" />
                  <span>{added ? "Added!" : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleProceedToPay}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#c0881b] hover:bg-[#a97514] active:scale-98 text-white font-cinzel font-semibold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Buy &amp; Pay Now ({formatPrice(totalPrice)})</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10.5px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Handcrafted in India
                </span>
                <span>•</span>
                <span>Doorstep Insured Dispatch</span>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: EXPRESS CHECKOUT & INSTANT PAYMENT FORM */}
        {modalStep === "pay" && (
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <div>
                <span className="text-[10px] font-cinzel text-[#c0881b] uppercase tracking-wider font-bold">
                  Step 2 • Express Checkout
                </span>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Delivery &amp; Payment
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalStep("customize")}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            </div>

            {/* Configured Item Capsule */}
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between font-bold text-stone-900">
                <span>{product.name} (x{quantity})</span>
                <span className="text-[#c0881b]">{formatPrice(totalPrice)}</span>
              </div>
              {Object.entries(getReadableCustomizations()).map(([k, v]) => (
                <div key={k} className="text-[11px] text-stone-600">
                  <span className="font-medium text-[#8b5f10]">{k}:</span> {v}
                </div>
              ))}
            </div>

            {/* Address inputs */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    placeholder="Aditi Sharma"
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    Phone (Delivery Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Complete Street Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, address: e.target.value })
                  }
                  placeholder="House/Flat No., Street, Landmark"
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.city}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, city: e.target.value })
                    }
                    placeholder="Bengaluru"
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.pincode}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, pincode: e.target.value })
                    }
                    placeholder="560001"
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-2 rounded-lg border text-center text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                      : "border-stone-200 bg-white text-stone-600"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#c0881b]" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2 rounded-lg border text-center text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                      : "border-stone-200 bg-white text-stone-600"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#c0881b]" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-2 rounded-lg border text-center text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                      : "border-stone-200 bg-white text-stone-600"
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#c0881b]" />
                  <span>COD</span>
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-[#c0881b] hover:bg-[#a97514] text-white font-cinzel font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Processing Prana Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {formatPrice(totalPrice)} &amp; Confirm Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: ORDER SUCCESS SCREEN */}
        {modalStep === "success" && (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#fbf6ea] border-2 border-[#eed08e] text-[#c0881b] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#8b5f10] font-bold block">
                Blessed &amp; Confirmed
              </span>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Order Placed Successfully!
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Thank you, {customerInfo.name || "Devotee"}. We are preparing your customized order for immediate dispatch.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#eed08e] rounded-xl p-4 text-left text-xs space-y-2 text-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-mono font-bold text-stone-900">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Item:</span>
                <span className="font-semibold text-stone-900">{product.name} (x{quantity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery To:</span>
                <span className="font-medium text-stone-900 truncate max-w-[180px]">
                  {customerInfo.address}, {customerInfo.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Paid:</span>
                <span className="font-bold text-[#c0881b]">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#c0881b] hover:bg-[#a97514] text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
