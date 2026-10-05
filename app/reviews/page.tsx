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
  const [activeCategory, setActiveCategory] = useState<string>("all");
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

  const filteredReviews = useMemo(() => {
    if (activeCategory === "all") return reviews;
    return reviews.filter((r) => r.category === activeCategory);
  }, [reviews, activeCategory]);

  const categories = [
    { id: "all", label: "All Reviews", count: reviews.length },
    {
      id: "trunks",
      label: "Heirloom Trunks",
      count: reviews.filter((r) => r.category === "trunks").length,
    },
    {
      id: "elements",
      label: "The 5 Elements",
      count: reviews.filter((r) => r.category === "elements").length,
    },
    {
      id: "brass",
      label: "Brass Craftsmanship",
      count: reviews.filter((r) => r.category === "brass").length,
    },
    {
      id: "gifting",
      label: "Bespoke Gifting",
      count: reviews.filter((r) => r.category === "gifting").length,
    },
  ];

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* Header & Overall Ratings Hero */}
        <section className="text-center space-y-5 max-w-3xl mx-auto pt-2">
          <span className="text-xs font-cinzel font-semibold tracking-[0.24em] text-stone-400 uppercase">
            Collector Testimonials
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 font-normal tracking-tight">
            Loved by Connoisseurs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
            Read unvarnished feedback from patrons who have brought Kurma into their meditation rooms, family celebrations, and sacred altars.
          </p>

          {/* Ratings Metric Pill */}
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-900 mt-1 block">
                4.9 out of 5 Stars
              </span>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-left">
              <span className="text-sm font-bold text-stone-900">1,280+</span>
              <span className="text-[11px] text-stone-500 block">Verified Buyers</span>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-left">
              <span className="text-sm font-bold text-stone-900">98%</span>
              <span className="text-[11px] text-stone-500 block">Recommendation</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Share Your Experience</span>
            </button>
          </div>
        </section>

        {/* Filter Underline Tabs */}
        <div className="flex flex-nowrap overflow-hidden items-center justify-center gap-2 sm:gap-4 md:gap-8 py-2 text-xs font-cinzel tracking-wider border-b border-stone-200/60">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pb-1.5 transition-all whitespace-nowrap cursor-pointer uppercase ${
                  isActive
                    ? "text-stone-900 border-b-2 border-stone-900 font-semibold"
                    : "text-stone-400 hover:text-stone-800 font-normal"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-sans text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Verified Patron
                    </span>
                  )}
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

              {/* Author & Product Meta */}
              <div className="pt-3 border-t border-stone-100 flex items-end justify-between text-xs">
                <div>
                  <p className="font-medium text-stone-900">
                    {rev.author}
                    <span className="text-stone-400 font-normal">, {rev.location}</span>
                  </p>
                  <p className="text-[11px] text-[#9B783E] font-cinzel mt-0.5 truncate max-w-[200px]">
                    {rev.productName}
                  </p>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
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
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#072515]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Location</label>
                    <input
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#072515]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Creations Purchased</label>
                  <select
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#072515]"
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
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#072515]"
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
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#072515]"
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
                    className="px-5 py-2 rounded-lg bg-[#072515] text-[#eed08e] font-cinzel font-semibold uppercase tracking-wider hover:bg-[#0c3823] cursor-pointer"
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
