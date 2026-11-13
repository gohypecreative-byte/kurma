"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { Star, CheckCircle, PenLine, X, Heart } from "lucide-react";

interface Review {
  id: string;
  author: string;
  location: string;
  category: "all" | "trunks" | "elements" | "brass" | "gifting";
  productName: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Vikram Singhania",
    location: "Mumbai",
    category: "trunks",
    productName: "Elements in Harmony Marble Gift Box",
    rating: 5,
    date: "2 weeks ago",
    title: "An authentic heirloom piece that commands reverence",
    content:
      "The forest green marble trunk with the heavy brass lock is beyond stunning. We presented this to our keynote speakers at our annual founders summit, and the brass plaque engraving made it deeply memorable. The aroma when opening the lid is pure temple sanctity.",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Dr. Radhika Sen",
    location: "Bengaluru",
    category: "elements",
    productName: "Space (Akasha) & Earth (Prithvi) Boxes",
    rating: 5,
    date: "1 month ago",
    title: "Zero black soot — finally an incense safe for home pranayama",
    content:
      "As someone sensitive to synthetic perfume and traditional black charcoal smoke, Kurma has been a revelatory discovery. The smoke is thin and milky white, and the agarwood in Space creates an ethereal meditative atmosphere during 6 AM yoga.",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Ananya & Rohan Kapur",
    location: "New Delhi",
    category: "gifting",
    productName: "Kurma MDF Keepsake Gift Box",
    rating: 5,
    date: "3 weeks ago",
    title: "The highlight of our wedding gifting favors",
    content:
      "Our wedding guests are still messaging us about the wax-sealed blessing notes and the exquisite scent of the incense. The curation feels regal, timeless, and spiritually grounded. Truly luxury gifting done with reverence.",
    verified: true,
  },
  {
    id: "rev-4",
    author: "Capt. Arvind Joshi",
    location: "Dehradun",
    category: "brass",
    productName: "Solid Brass Turtle Incense Holder",
    rating: 5,
    date: "1 month ago",
    title: "Substantial weight, impeccable Moradabad brass casting",
    content:
      "The turtle holder has serious heft. It holds the stick at the perfect angle so the ash falls neatly onto the tray. Beautiful detail on the shell carvings; it feels like an antique discovered in a royal courtyard.",
    verified: true,
  },
  {
    id: "rev-5",
    author: "Meera Nair",
    location: "Kochi",
    category: "elements",
    productName: "5 Elements Complete Fragrance Suite",
    rating: 5,
    date: "2 months ago",
    title: "Each element has a distinct personality and ritual hour",
    content:
      "Water (Jal) with its blue lotus note is my favorite for midday focus, while Fire (Agni) has a rich clove warmth perfect for chilly evenings. 135 sticks in the presentation sleeve represents incredible value for pure resins.",
    verified: true,
  },
  {
    id: "rev-6",
    author: "Siddharth Chawla",
    location: "Hyderabad",
    category: "trunks",
    productName: "Artisanal Empty Green Marble Box",
    rating: 5,
    date: "3 weeks ago",
    title: "Sublime craftsmanship and natural stone veining",
    content:
      "Every single marble box has unique natural stone veins. The gold clasp is smooth and secure. I use it to keep my meditation malas and sacred talismans on my prayer altar. Worth every rupee.",
    verified: true,
  },
];

export default function ReviewsPage() {
  const { cartCount, setIsCartOpen } = useCart();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formAuthor, setFormAuthor] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formProduct, setFormProduct] = useState("Elements in Harmony Marble Gift Box");
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredReviews = reviews;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor || !formContent) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: formAuthor,
      location: formLocation || "India",
      category: "elements",
      productName: formProduct,
      rating: formRating,
      date: "Just now",
      title: formTitle || "Sacred Experience",
      content: formContent,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setFormAuthor("");
      setFormLocation("");
      setFormTitle("");
      setFormContent("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* Header & Overall Ratings Hero */}
        <section className="text-center space-y-5 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 font-normal tracking-tight">
            Loved by Connoisseurs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
            Read unvarnished feedback from patrons who have brought Kurma into their meditation rooms, family celebrations, and sacred altars.
          </p>

          {/* Ratings Metric Pill */}
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white border border-stone-200/80 shadow-2xs max-w-full">
            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-stone-900 mt-1 block">
                4.9 out of 5 Stars
              </span>
            </div>
            <div className="h-7 w-px bg-stone-200 hidden xs:block" />
            <div className="text-left">
              <span className="text-xs sm:text-sm font-bold text-stone-900">1,280+</span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block">Verified Buyers</span>
            </div>
            <div className="h-7 w-px bg-stone-200 hidden xs:block" />
            <div className="text-left">
              <span className="text-xs sm:text-sm font-bold text-stone-900">98%</span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block">Recommendation</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Share Your Experience</span>
            </button>
          </div>
        </section>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-sm font-semibold text-stone-900 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                {/* Review Content */}
                <p className="text-xs sm:text-[13px] text-stone-600 font-sans leading-relaxed">
                  {rev.content}
                </p>
              </div>

              {/* Author Meta */}
              <div className="pt-3 border-t border-stone-100 text-xs">
                <p className="font-medium text-stone-900">
                  {rev.author}
                  <span className="text-stone-400 font-normal">, {rev.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-serif text-stone-900 font-normal">
                Share Your Kurma Experience
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your thoughts guide fellow collectors and honor our generational craftsmen.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg text-stone-900">Thank You</h4>
                <p className="text-xs text-stone-500">Your review has been verified and added.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Your Name</label>
                    <input
                      required
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="e.g. Maya Iyer"
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#1E1E1C]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Location</label>
                    <input
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#1E1E1C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Creations Purchased</label>
                  <select
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#1E1E1C]"
                  >
                    <option value="Elements in Harmony Marble Gift Box">Elements in Harmony Marble Gift Box</option>
                    <option value="Kurma MDF Keepsake Gift Box">Kurma MDF Keepsake Gift Box</option>
                    <option value="5 Elements Complete Fragrance Suite">5 Elements Complete Fragrance Suite</option>
                    <option value="Solid Brass Turtle Incense Holder">Solid Brass Turtle Incense Holder</option>
                    <option value="Earth Luxury Incense">Earth Luxury Incense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= formRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Headline</label>
                  <input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Summary of your experience"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#1E1E1C]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Your Thoughts</label>
                  <textarea
                    required
                    rows={3}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Describe the fragrance, burning experience, or gift box quality..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#1E1E1C]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#1E1E1C] text-white font-cinzel font-semibold uppercase tracking-wider hover:bg-[#0c3823] cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
