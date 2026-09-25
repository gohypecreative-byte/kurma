export interface CustomizationField {
  id: string;
  label: string;
  type: "text" | "select" | "radio";
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string; priceDelta?: number }[];
  maxLength?: number;
  defaultValue?: string;
}

export interface ProductSKU {
  id: string;
  name: string;
  subtitle: string;
  category: "Gift Boxes" | "Fragrances" | "Sacred Accessories";
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  badge?: string;
  description: string;
  details: string[];
  elements?: string[];
  customizationFields: CustomizationField[];
}

export const PRODUCTS: ProductSKU[] = [
  // 1. MDF Gift Box
  {
    id: "mdf-gift-box",
    name: "Kurma MDF Keepsake Gift Box",
    subtitle: "Pure Fragrance • Higher Consciousness",
    category: "Gift Boxes",
    price: 2499,
    originalPrice: 2999,
    image: "/images/product/mdf-box-clean.png",
    gallery: [
      "/images/product/mdf-box-clean.png",
      "/images/product/image.png",
    ],
    badge: "Handcrafted Wood",
    description:
      "Artisanal rigid MDF keepsake gift trunk finished with warm natural wood grain, gold-foil stamped Kurma turtle insignia, and tailored compartments for sacred incense and heirloom accessories.",
    details: [
      "Rigid artisanal wooden MDF craftsmanship",
      "Metallic gold-foil Kurma emblem debossing",
      "Dimensions: 34cm x 24cm x 8cm",
      "Includes magnetic closure and protective outer sleeve",
    ],
    customizationFields: [
      {
        id: "lid_engraving",
        label: "Lid Monogram / Name Engraving",
        type: "text",
        placeholder: "e.g. The Sharma Family or Aditya",
        description: "Custom gold foil personalization on the front lid (up to 24 characters)",
        maxLength: 24,
      },
      {
        id: "velvet_lining",
        label: "Interior Velvet Lining Color",
        type: "radio",
        defaultValue: "Forest Green",
        options: [
          { label: "Sacred Forest Green", value: "Forest Green" },
          { label: "Imperial Crimson", value: "Imperial Crimson" },
          { label: "Midnight Obsidian", value: "Midnight Obsidian" },
        ],
      },
      {
        id: "gift_card_message",
        label: "Handwritten Blessing / Gift Message",
        type: "text",
        placeholder: "Wishing you peace, harmony, and prosperity...",
        description: "Printed on handmade deckle-edge paper and sealed in wax",
        maxLength: 120,
      },
    ],
  },

  // 2. Marble Gift Box
  {
    id: "marble-gift-box",
    name: "Elements in Harmony Luxury Marble Gift Box",
    subtitle: "Complete 5 Elements Suite & Sacred Accessories",
    category: "Gift Boxes",
    price: 4999,
    originalPrice: 5999,
    image: "/images/product/marble-box-clean.png",
    gallery: [
      "/images/product/marble-box-clean.png",
      "/images/product/image9.png",
      "/images/product/suite-clean.png",
      "/images/product/image8.png",
    ],
    badge: "Flagship Suite",
    description:
      "The definitive Kurma heirloom set. Housed in an emerald-veined green marble trunk with solid brass lock, containing all 5 Element luxury fragrance boxes, the solid brass turtle incense holder, keepsake medallion, premium bookmark, and guide booklet.",
    details: [
      "Includes all 5 Element fragrance boxes (135 total sticks)",
      "Solid cast brass turtle incense stand with single-hole burner",
      "Antiqued brass keepsake medallion engraved with the 5 elements",
      "Textured gold-foil paper bookmark with handmade emerald silk tassel",
      "The Kurma Story and elemental fragrance ritual guide",
      "Solid lockable clasp and gold-plated corner brackets",
    ],
    elements: ["Earth", "Water", "Fire", "Air", "Space"],
    customizationFields: [
      {
        id: "brass_plaque",
        label: "Brass Plaque Engraving",
        type: "text",
        placeholder: "e.g. Om Shanti • Ananya & Vikram",
        description: "Deep-engraved brass plaque mounted inside the box lid (up to 30 characters)",
        maxLength: 30,
      },
      {
        id: "wax_seal_color",
        label: "Handmade Wax Seal & Silk Ribbon",
        type: "radio",
        defaultValue: "Imperial Gold",
        options: [
          { label: "Imperial Gold Wax Seal", value: "Imperial Gold" },
          { label: "Forest Emerald Wax Seal", value: "Forest Emerald" },
          { label: "Royal Ruby Wax Seal", value: "Royal Ruby" },
        ],
      },
      {
        id: "pashmina_addon",
        label: "Add Pashmina Pocket Square (+₹999)",
        type: "radio",
        defaultValue: "No Pashmina",
        options: [
          { label: "No, box contents only", value: "No Pashmina", priceDelta: 0 },
          { label: "Yes, include Embroidered Pashmina Square (+₹999)", value: "Include Pashmina", priceDelta: 999 },
        ],
      },
      {
        id: "personal_note",
        label: "Personalized Festive Gift Scroll",
        type: "text",
        placeholder: "May the sacred elements fill your sanctuary with divine grace...",
        description: "Tied with gold zari thread",
        maxLength: 140,
      },
    ],
  },

  // 2b. 5 Elements Complete Fragrance Suite
  {
    id: "5-elements-suite",
    name: "5 Elements Complete Fragrance Suite",
    subtitle: "Complete 5-Element Collection • 135 Sticks",
    category: "Gift Boxes",
    price: 1799,
    originalPrice: 2199,
    image: "/images/product/suite-clean.png",
    gallery: [
      "/images/product/suite-clean.png",
      "/images/product/five-boxes-3d.png",
      "/images/product/turtle-holder-clean.png",
      "/images/product/image7.png",
    ],
    badge: "Complete Suite",
    description:
      "All 5 Element luxury fragrance boxes (Earth, Water, Fire, Air, Space) bundled in a golden keepsake presentation sleeve. 135 pure charcoal-free botanical incense sticks.",
    details: [
      "Includes all 5 fragrance boxes (27 sticks each, 135 sticks total)",
      "100% Charcoal-free with certified pure natural resins",
      "Includes gold foil gift sleeve band",
      "Safe for daily morning and evening prayer rituals",
    ],
    elements: ["Earth", "Water", "Fire", "Air", "Space"],
    customizationFields: [
      {
        id: "lid_engraving",
        label: "Lid / Gold Band Monogram Engraving",
        type: "text",
        placeholder: "e.g. Om Shanti • The Sharma Sanctuary",
        description: "Custom debossed gold foil personalization (up to 30 characters)",
        maxLength: 30,
      },
      {
        id: "ritual_intent",
        label: "Ritual Blessing Focus",
        type: "select",
        defaultValue: "Total Prana Harmonization & Space Sanctification",
        options: [
          { label: "Total Prana Harmonization & Space Sanctification", value: "Total Prana Harmonization & Space Sanctification" },
          { label: "Root Grounding & Deep Emotional Stability", value: "Root Grounding & Deep Emotional Stability" },
          { label: "Sacred Cleansing & Creative Fluidity", value: "Sacred Cleansing & Creative Fluidity" },
          { label: "Divine Courage & Energy Transformation", value: "Divine Courage & Energy Transformation" },
          { label: "Cosmic Stillness & Crown Meditation", value: "Cosmic Stillness & Crown Meditation" },
        ],
      },
      {
        id: "turtle_burner_addon",
        label: "Add Solid Cast Brass Turtle Burner (+₹699)",
        type: "radio",
        defaultValue: "None",
        options: [
          { label: "No brass burner (Incense sticks only)", value: "None", priceDelta: 0 },
          { label: "Include Moradabad Solid Brass Turtle Burner (+₹699)", value: "Include Turtle Burner", priceDelta: 699 },
        ],
      },
      {
        id: "gift_wrap",
        label: "Luxury Festive Gift Wrap",
        type: "radio",
        defaultValue: "Standard Wrap",
        options: [
          { label: "Standard Keepsake Band (Included)", value: "Standard Wrap", priceDelta: 0 },
          { label: "Imperial Emerald & Gold Zari (+₹149)", value: "Emerald Gold Wrap", priceDelta: 149 },
          { label: "Crimson Royal Deckle Wrap (+₹149)", value: "Crimson Wrap", priceDelta: 149 },
        ],
      },
      {
        id: "gift_note",
        label: "Handwritten Blessing / Gift Message",
        type: "text",
        placeholder: "May the sacred elements fill your sanctuary with peace...",
        description: "Inscribed on handmade deckle-edge scroll paper",
        maxLength: 120,
      },
    ],
  },

  // 3. Earth Fragrance Box
  {
    id: "fragrance-earth",
    name: "Earth Luxury Incense (The Essence of Earth)",
    subtitle: "Ground • Nourish • Belong",
    category: "Fragrances",
    price: 399,
    originalPrice: 499,
    image: "/images/product/earth-front.png",
    gallery: [
      "/images/product/earth-front.png",
      "/images/product/five-boxes-3d.png",
      "/images/product/turtle-holder-clean.png",
    ],
    badge: "Element: Earth",
    description:
      "A warm and woody blend that connects you to nature's stability. Earth soothes the mind, calms the senses, and brings a profound sense of balance and rootedness into your sanctuary.",
    details: [
      "27 Handcrafted luxury incense sticks",
      "Pure natural wood powder, essential oils, and natural resins",
      "100% Charcoal-free, zero toxic black smoke",
      "Burn time: 55-65 minutes per stick",
      "Handcrafted in India with certified eco-friendly packaging",
    ],
    elements: ["Earth"],
    customizationFields: [
      {
        id: "pack_size",
        label: "Pack Quantity",
        type: "radio",
        defaultValue: "Single Box (27 sticks)",
        options: [
          { label: "Single Box (27 sticks)", value: "Single Box (27 sticks)", priceDelta: 0 },
          { label: "Trio Pack (3x 27 sticks) - Save 10%", value: "Trio Pack (81 sticks)", priceDelta: 679 },
          { label: "5-Element Bundle (Earth, Water, Fire, Air, Space)", value: "5-Element Suite", priceDelta: 1399 },
        ],
      },
      {
        id: "gift_sleeve",
        label: "Personalized Gold Sleeve Name Band",
        type: "text",
        placeholder: "e.g. For Priyesh",
        description: "Custom slip-on band wrapping the fragrance box (up to 20 characters)",
        maxLength: 20,
      },
      {
        id: "ritual_intent",
        label: "Ritual Blessing Focus",
        type: "select",
        defaultValue: "Grounding & Emotional Balance",
        options: [
          { label: "Grounding & Emotional Balance", value: "Grounding & Emotional Balance" },
          { label: "Home Sanctification & Peace", value: "Home Sanctification & Peace" },
          { label: "Deep Meditation & Yoga", value: "Deep Meditation & Yoga" },
        ],
      },
    ],
  },

  // 4. Water Fragrance Box
  {
    id: "fragrance-water",
    name: "Water Luxury Incense (The Essence of Water)",
    subtitle: "Flow • Purify • Renew",
    category: "Fragrances",
    price: 399,
    originalPrice: 499,
    image: "/images/product/water-front.png",
    gallery: [
      "/images/product/water-front.png",
      "/images/product/five-boxes-3d.png",
      "/images/product/turtle-holder-clean.png",
    ],
    badge: "Element: Water",
    description:
      "A refreshing and tranquil blend inspired by sacred flowing waters. Water cleanses the mind, uplifts the spirit, and brings a serene sense of emotional clarity and peace.",
    details: [
      "27 Handcrafted luxury incense sticks",
      "Aquatic botanicals, cooling vetiver, and white floral essential oils",
      "100% Charcoal-free formulation with clean fragrant smoke",
      "Burn time: 55-65 minutes per stick",
      "Cruelty-free, eco-friendly, made with zero harmful chemicals",
    ],
    elements: ["Water"],
    customizationFields: [
      {
        id: "pack_size",
        label: "Pack Quantity",
        type: "radio",
        defaultValue: "Single Box (27 sticks)",
        options: [
          { label: "Single Box (27 sticks)", value: "Single Box (27 sticks)", priceDelta: 0 },
          { label: "Trio Pack (3x 27 sticks) - Save 10%", value: "Trio Pack (81 sticks)", priceDelta: 679 },
          { label: "5-Element Bundle (Earth, Water, Fire, Air, Space)", value: "5-Element Suite", priceDelta: 1399 },
        ],
      },
      {
        id: "gift_sleeve",
        label: "Personalized Gold Sleeve Name Band",
        type: "text",
        placeholder: "e.g. For Radhika",
        description: "Custom slip-on band wrapping the fragrance box (up to 20 characters)",
        maxLength: 20,
      },
      {
        id: "ritual_intent",
        label: "Ritual Blessing Focus",
        type: "select",
        defaultValue: "Purification & Emotional Renewal",
        options: [
          { label: "Purification & Emotional Renewal", value: "Purification & Emotional Renewal" },
          { label: "Stress Relief & Tranquility", value: "Stress Relief & Tranquility" },
          { label: "Evening Unwinding", value: "Evening Unwinding" },
        ],
      },
    ],
  },

  // 5. Fire Fragrance Box
  {
    id: "fragrance-fire",
    name: "Fire Luxury Incense (The Essence of Fire)",
    subtitle: "Energise • Transform • Inspire",
    category: "Fragrances",
    price: 399,
    originalPrice: 499,
    image: "/images/product/fire-front.png",
    gallery: [
      "/images/product/fire-front.png",
      "/images/product/five-boxes-3d.png",
      "/images/product/turtle-holder-clean.png",
    ],
    badge: "Element: Fire",
    description:
      "A rich, warm, and intense blend that awakens inner strength. Fire ignites positivity, dispels lethargy, and creates a vibrant atmosphere of warmth, courage, and inspiration.",
    details: [
      "27 Handcrafted luxury incense sticks",
      "Spiced amber, warm saffron, natural wood powder, and resins",
      "100% Charcoal-free, hand-rolled in India",
      "Burn time: 55-65 minutes per stick",
      "Safe for indoor rituals and daily morning prayer",
    ],
    elements: ["Fire"],
    customizationFields: [
      {
        id: "pack_size",
        label: "Pack Quantity",
        type: "radio",
        defaultValue: "Single Box (27 sticks)",
        options: [
          { label: "Single Box (27 sticks)", value: "Single Box (27 sticks)", priceDelta: 0 },
          { label: "Trio Pack (3x 27 sticks) - Save 10%", value: "Trio Pack (81 sticks)", priceDelta: 679 },
          { label: "5-Element Bundle (Earth, Water, Fire, Air, Space)", value: "5-Element Suite", priceDelta: 1399 },
        ],
      },
      {
        id: "gift_sleeve",
        label: "Personalized Gold Sleeve Name Band",
        type: "text",
        placeholder: "e.g. For Devendra",
        description: "Custom slip-on band wrapping the fragrance box (up to 20 characters)",
        maxLength: 20,
      },
      {
        id: "ritual_intent",
        label: "Ritual Blessing Focus",
        type: "select",
        defaultValue: "Vitality & Inner Transformation",
        options: [
          { label: "Vitality & Inner Transformation", value: "Vitality & Inner Transformation" },
          { label: "Morning Pooja & Auspicious Beginnings", value: "Morning Pooja & Auspicious Beginnings" },
          { label: "Creative Focus & Energy", value: "Creative Focus & Energy" },
        ],
      },
    ],
  },

  // 6. Air Fragrance Box
  {
    id: "fragrance-air",
    name: "Air Luxury Incense (The Essence of Air)",
    subtitle: "Breathe • Clarity • Uplift",
    category: "Fragrances",
    price: 399,
    originalPrice: 499,
    image: "/images/product/air-front.png",
    gallery: [
      "/images/product/air-front.png",
      "/images/product/five-boxes-3d.png",
      "/images/product/turtle-holder-clean.png",
    ],
    badge: "Element: Air",
    description:
      "A light, crisp, and airy blend that brings freshness and freedom. Air clears mental fatigue, uplifts the spirit, and fills your living spaces with openness and optimism.",
    details: [
      "27 Handcrafted luxury incense sticks",
      "Himalayan cedar, floral hints, and pure uplifting essential oils",
      "100% Charcoal-free with delicate, smooth aromatic diffusion",
      "Burn time: 55-65 minutes per stick",
      "Formulated without synthetic chemicals or toxic binders",
    ],
    elements: ["Air"],
    customizationFields: [
      {
        id: "pack_size",
        label: "Pack Quantity",
        type: "radio",
        defaultValue: "Single Box (27 sticks)",
        options: [
          { label: "Single Box (27 sticks)", value: "Single Box (27 sticks)", priceDelta: 0 },
          { label: "Trio Pack (3x 27 sticks) - Save 10%", value: "Trio Pack (81 sticks)", priceDelta: 679 },
          { label: "5-Element Bundle (Earth, Water, Fire, Air, Space)", value: "5-Element Suite", priceDelta: 1399 },
        ],
      },
      {
        id: "gift_sleeve",
        label: "Personalized Gold Sleeve Name Band",
        type: "text",
        placeholder: "e.g. For Sanjana",
        description: "Custom slip-on band wrapping the fragrance box (up to 20 characters)",
        maxLength: 20,
      },
      {
        id: "ritual_intent",
        label: "Ritual Blessing Focus",
        type: "select",
        defaultValue: "Mental Clarity & Breathwork",
        options: [
          { label: "Mental Clarity & Breathwork", value: "Mental Clarity & Breathwork" },
          { label: "Fresh Morning Sanctuary", value: "Fresh Morning Sanctuary" },
          { label: "Study & Deep Reading", value: "Study & Deep Reading" },
        ],
      },
    ],
  },

  // 7. Space Fragrance Box
  {
    id: "fragrance-space",
    name: "Space Luxury Incense (The Essence of Space)",
    subtitle: "Expand • Transcend • Align",
    category: "Fragrances",
    price: 399,
    originalPrice: 499,
    image: "/images/product/space-front.png",
    gallery: [
      "/images/product/space-front.png",
      "/images/product/five-boxes-3d.png",
      "/images/product/turtle-holder-clean.png",
    ],
    badge: "Element: Space",
    description:
      "A deep, cosmic, and mysterious blend that invites stillness and transcendent reflection. Space connects you to the infinite, heightening awareness and higher consciousness.",
    details: [
      "27 Handcrafted luxury incense sticks",
      "Sacred agarwood (oudh), rare frankincense, and myrrh resins",
      "100% Charcoal-free with mesmerizing slow burn",
      "Burn time: 55-65 minutes per stick",
      "Gold-embossed packaging with celestial orbit illustrations",
    ],
    elements: ["Space"],
    customizationFields: [
      {
        id: "pack_size",
        label: "Pack Quantity",
        type: "radio",
        defaultValue: "Single Box (27 sticks)",
        options: [
          { label: "Single Box (27 sticks)", value: "Single Box (27 sticks)", priceDelta: 0 },
          { label: "Trio Pack (3x 27 sticks) - Save 10%", value: "Trio Pack (81 sticks)", priceDelta: 679 },
          { label: "5-Element Bundle (Earth, Water, Fire, Air, Space)", value: "5-Element Suite", priceDelta: 1399 },
        ],
      },
      {
        id: "gift_sleeve",
        label: "Personalized Gold Sleeve Name Band",
        type: "text",
        placeholder: "e.g. For Siddharth",
        description: "Custom slip-on band wrapping the fragrance box (up to 20 characters)",
        maxLength: 20,
      },
      {
        id: "ritual_intent",
        label: "Ritual Blessing Focus",
        type: "select",
        defaultValue: "Cosmic Alignment & Meditation",
        options: [
          { label: "Cosmic Alignment & Meditation", value: "Cosmic Alignment & Meditation" },
          { label: "Spiritual Stillness & Introspection", value: "Spiritual Stillness & Introspection" },
          { label: "Sacred Pooja & Aarti", value: "Sacred Pooja & Aarti" },
        ],
      },
    ],
  },

  // 8. Turtle Incense Holder
  {
    id: "turtle-incense-holder",
    name: "Handcrafted Brass Turtle Incense Stand",
    subtitle: "Sacred Kurma Avatar • Single Hole Burner",
    category: "Sacred Accessories",
    price: 899,
    originalPrice: 1199,
    image: "/images/product/turtle-holder-clean.png",
    gallery: [
      "/images/product/turtle-holder-clean.png",
      "/images/product/image8.png",
      "/images/product/image7.png",
    ],
    badge: "Pure Solid Brass",
    description:
      "Heirloom incense burner forged in solid brass representing Kurma, the sacred tortoise of longevity and perseverance. Detailed with intricate paisley repoussé carvings and center burner aperture.",
    details: [
      "Heavy solid cast brass with antique hand-buffed patina",
      "Single center hole engineered for all luxury incense stick sizes",
      "Weighted base prevents tipping and protects surfaces",
      "Dimensions: 7.5cm length x 5.8cm width x 2.2cm height",
      "Tarnish-resistant clear protective coating",
    ],
    customizationFields: [
      {
        id: "finish_type",
        label: "Brass Finish Selection",
        type: "radio",
        defaultValue: "Antique Patina Brass",
        options: [
          { label: "Antique Burnished Patina", value: "Antique Patina Brass" },
          { label: "High-Lustre Polished Gold Brass", value: "Polished Gold Brass" },
        ],
      },
      {
        id: "base_engraving",
        label: "Underside Monogram Initials",
        type: "text",
        placeholder: "e.g. K.S. (up to 3 characters)",
        description: "Hand-chiseled initials on the polished brass base plate",
        maxLength: 3,
      },
      {
        id: "pouch_color",
        label: "Keepsake Velvet Pouch",
        type: "radio",
        defaultValue: "Deep Emerald Green",
        options: [
          { label: "Deep Emerald Green Velvet", value: "Deep Emerald Green" },
          { label: "Imperial Crimson Velvet", value: "Imperial Crimson" },
        ],
      },
    ],
  },

  // 9. Medallion
  {
    id: "medallion",
    name: "Keepsake Medallion (A Mark of Harmony)",
    subtitle: "The Five Sacred Elements Embodied",
    category: "Sacred Accessories",
    price: 649,
    originalPrice: 849,
    image: "/images/product/medallion-clean.png",
    gallery: [
      "/images/product/medallion-clean.png",
      "/images/product/image8.png",
      "/images/product/image7.png",
    ],
    badge: "Keepsake Talisman",
    description:
      "Substantial brass talisman token engraved with the Kurma turtle surrounded by the Five Elements: Earth, Water, Fire, Air, and Space. Serves as a meditation focal piece, altar anchor, or pocket token of harmony.",
    details: [
      "Solid dual-tone antique brass coin construction",
      "Front relief: Kurma turtle encircled by Earth, Water, Fire, Air, Space",
      "Beveled coin edge with smooth milled perimeter",
      "Diameter: 48mm; Thickness: 3.5mm; Weight: 55g",
      "Supplied in a magnetic presentation box",
    ],
    customizationFields: [
      {
        id: "back_engraving",
        label: "Reverse Side Inscription",
        type: "text",
        placeholder: "e.g. 18.04.2026 • Always in Harmony",
        description: "Precision diamond-drag engraving on reverse (up to 25 characters)",
        maxLength: 25,
      },
      {
        id: "carrying_style",
        label: "Display / Presentation Option",
        type: "radio",
        defaultValue: "Silk Cord Tassel",
        options: [
          { label: "Deep Green Silk Tassel Cord", value: "Silk Cord Tassel" },
          { label: "Hardwood Miniature Altar Easel", value: "Hardwood Easel" },
          { label: "Leather Pocket Slip", value: "Leather Slip" },
        ],
      },
    ],
  },

  // 10. Pashmina Pocket Square
  {
    id: "pashmina-pocket-square",
    name: "Pashmina Pocket Square (Gold Embroidered)",
    subtitle: "Artisanal Weave with Sacred Turtle Zari",
    category: "Sacred Accessories",
    price: 1199,
    originalPrice: 1499,
    image: "/images/product/pashmina-clean.png",
    gallery: [
      "/images/product/pashmina-clean.png",
      "/images/product/image.png",
    ],
    badge: "Pure Pashmina Blend",
    description:
      "Luxuriously soft dark forest green pashmina wool pocket square, finished with delicate hand-fringed eyelash borders and an exquisitely embroidered golden zari Kurma sacred turtle in the corner.",
    details: [
      "70% Fine Pashmina Cashmere Wool, 30% Mulberry Silk",
      "Metallic golden zari embroidery of the Kurma emblem",
      "Dimensions: 33cm x 33cm (13\" x 13\")",
      "Hand-finished edges with subtle fringe detailing",
      "Presented in a Kurma gold-embossed gift sleeve",
    ],
    customizationFields: [
      {
        id: "monogram_initials",
        label: "Monogram Embroidery (Initials)",
        type: "text",
        placeholder: "e.g. R.V.",
        description: "Hand-stitched metallic gold thread initials adjacent to the turtle (up to 3 letters)",
        maxLength: 3,
      },
      {
        id: "packaging_fold",
        label: "Gift Presentation Style",
        type: "radio",
        defaultValue: "Presidential Flat Fold",
        options: [
          { label: "Presidential Flat Fold in Gold Box", value: "Presidential Flat Fold" },
          { label: "Royal Crown Fold with Wax Seal", value: "Royal Crown Fold" },
        ],
      },
    ],
  },

  // 11. Empty Marble Box
  {
    id: "empty-marble-box",
    name: "Artisanal Empty Green Marble Keepsake Box",
    subtitle: "Heirloom Jewelry & Sacred Trunk (Without Inserts)",
    category: "Gift Boxes",
    price: 2499,
    originalPrice: 2999,
    image: "/images/product/empty-marble-clean.png",
    gallery: [
      "/images/product/empty-marble-clean.png",
      "/images/product/image9.png",
      "/images/product/image.png",
    ],
    badge: "Heirloom Keepsake",
    description:
      "The signature Kurma Green Marble trunk presented in an open, empty configuration. Lined with rich plush velvet, this box is crafted for personal jewelry, treasured prayer beads, gemstones, or precious heirlooms.",
    details: [
      "Artisanal green marble patterned rigid structure",
      "Solid antique brass clasp with floral latch motif",
      "Open interior compartment without foam cutouts",
      "Dimensions: 32cm length x 21cm width x 7.5cm depth",
      "Padded base prevents scratch marks on furniture",
    ],
    customizationFields: [
      {
        id: "interior_velvet",
        label: "Interior Velvet Lining",
        type: "radio",
        defaultValue: "Forest Emerald Velvet",
        options: [
          { label: "Forest Emerald Velvet", value: "Forest Emerald Velvet" },
          { label: "Midnight Sapphire Velvet", value: "Midnight Sapphire Velvet" },
          { label: "Regal Ruby Velvet", value: "Regal Ruby Velvet" },
        ],
      },
      {
        id: "clasp_style",
        label: "Hardware & Latch Style",
        type: "radio",
        defaultValue: "Antique Vintage Latch",
        options: [
          { label: "Antique Vintage Brass Latch", value: "Antique Vintage Latch" },
          { label: "Polished Gold Latch", value: "Polished Gold Latch" },
        ],
      },
      {
        id: "lid_plaque",
        label: "Personalized Brass Nameplate",
        type: "text",
        placeholder: "e.g. S. Karmakar Family Treasures",
        description: "Engraved brass plate affixed to the inside lid (up to 28 characters)",
        maxLength: 28,
      },
    ],
  },

  // 12. Bookmark
  {
    id: "bookmark",
    name: "Premium Textured Paper Bookmark & Silk Tassel",
    subtitle: "Five Essences • Scents Connect Worlds",
    category: "Sacred Accessories",
    price: 249,
    originalPrice: 349,
    image: "/images/product/bookmark-clean.png",
    gallery: [
      "/images/product/bookmark-clean.png",
      "/images/product/image6.png",
      "/images/product/image8.png",
    ],
    badge: "Eco-Textured Paper",
    description:
      "Exquisite thick textured kraft paper tag bookmark featuring the embossed Kurma tortoise, sacred elemental iconography (Earth, Water, Fire, Air, Space), mountain foil landscape, and handmade silk tassel.",
    details: [
      "Heavy 450 GSM FSC-certified textured kraft board",
      "Debossed metallic foil Kurma logo and 5 elements",
      "Handmade silken cord tassel in forest green",
      "Dimensions: 16.5cm x 4.5cm",
      "Water-resistant matte protective seal",
    ],
    customizationFields: [
      {
        id: "tassel_color",
        label: "Silk Tassel Color",
        type: "radio",
        defaultValue: "Forest Emerald",
        options: [
          { label: "Forest Emerald Tassel", value: "Forest Emerald" },
          { label: "Golden Amber Tassel", value: "Golden Amber" },
          { label: "Temple Ruby Tassel", value: "Temple Ruby" },
        ],
      },
      {
        id: "reverse_dedication",
        label: "Reverse Side Dedication / Name",
        type: "text",
        placeholder: "e.g. For Ananya • Read & Breathe",
        description: "Gold metallic stamping on the back (up to 30 characters)",
        maxLength: 30,
      },
    ],
  },
];

export function getProductById(id: string): ProductSKU | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductSKU["category"]): ProductSKU[] {
  return PRODUCTS.filter((p) => p.category === category);
}

let itemCounter = 0;
export function createCartItemId(prefix: string): string {
  itemCounter += 1;
  return `${prefix}-${itemCounter}`;
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
