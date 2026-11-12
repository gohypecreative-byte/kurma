import "dotenv/config";
import { prisma } from "../lib/prisma";
import { PRODUCTS } from "../lib/products";

async function main() {
  console.log("Starting comprehensive seed to Neon database...");

  // 1. Seed Products with initial stock
  const stockMap: Record<string, number> = {
    "mdf-gift-box": 12,
    "marble-gift-box": 8,
    "turtle-incense-holder": 19,
    "5-elements-suite": 14,
    "fragrance-earth": 6,
    "fragrance-water": 42,
    "fragrance-fire": 31,
    "fragrance-air": 55,
    "fragrance-space": 24,
  };

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        subtitle: product.subtitle,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        stock: stockMap[product.id] ?? 25,
        image: product.image,
        gallery: product.gallery ?? [],
        badge: product.badge ?? null,
        description: product.description,
        details: product.details ?? [],
        elements: product.elements ?? [],
        inStock: true,
      },
      create: {
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        stock: stockMap[product.id] ?? 25,
        image: product.image,
        gallery: product.gallery ?? [],
        badge: product.badge ?? null,
        description: product.description,
        details: product.details ?? [],
        elements: product.elements ?? [],
        inStock: true,
        rating: 5.0,
        reviewCount: 14,
      },
    });
  }

  // 2. Seed Categories
  const categories = [
    {
      id: "cat-1",
      title: "Luxury Gift Trunks & Boxes",
      slug: "gift-trunks",
      parentId: null,
      productCount: 2,
      visible: true,
      targetRevenue: 150000,
      salesProgress: 84,
      description: "Curated heirloom keepsake chests, gold-foil debossed trunks, and festive celebration caskets crafted for memorable gifting.",
      image: "/images/product/marble-box-clean.png",
      badge: "Best Seller",
      channels: ["Online Storefront", "Corporate Concierge"],
    },
    {
      id: "cat-2",
      title: "Pancha Mahabhuta Incense",
      slug: "five-elements",
      parentId: null,
      productCount: 5,
      visible: true,
      targetRevenue: 90000,
      salesProgress: 68,
      description: "Sacred elemental aromatics honoring Earth (Prithvi), Water (Jal), Fire (Agni), Air (Vayu), and Space (Akasha) with natural flora extracts.",
      image: "/images/product/image.png",
      badge: "Heritage Series",
      channels: ["Online Storefront", "Private Atelier"],
    },
    {
      id: "cat-3",
      title: "Sacred Brass Heirlooms",
      slug: "sacred-accessories",
      parentId: null,
      productCount: 3,
      visible: true,
      targetRevenue: 65000,
      salesProgress: 72,
      description: "Authentic Moradabad solid brass ritual turtle burners, sacred bell chimers, and antique-finished dhoop accessories.",
      image: "/images/product/turtle-burner.png",
      badge: "Artisan Heirloom",
      channels: ["Online Storefront", "Corporate Concierge", "Private Atelier"],
    },
    {
      id: "cat-4",
      title: "Royal Mysore Chandan",
      slug: "mysore-chandan",
      parentId: "cat-2",
      productCount: 2,
      visible: true,
      targetRevenue: 45000,
      salesProgress: 91,
      description: "Pure Karnataka sandalwood sticks infused with slow-burning organic resins and sacred temple extracts.",
      image: "/images/products/agarbatti-sandalwood.jpg",
      badge: "Temple Grade",
      channels: ["Online Storefront"],
    },
    {
      id: "cat-5",
      title: "Bespoke Personalization",
      slug: "personalization",
      parentId: null,
      productCount: 2,
      visible: true,
      targetRevenue: 30000,
      salesProgress: 56,
      description: "Custom engraved brass plaques, hand-lettered deckle-edge scrolls, and wax-sealed benedictions.",
      image: "/images/product/mdf-box-clean.png",
      badge: "Bespoke",
      channels: ["Online Storefront", "Corporate Concierge"],
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 3. Seed Custom Boxes
  const customBoxes = [
    {
      id: "celebration",
      title: "The Celebration Box",
      size: "8 x 8 x 4 cm",
      capacity: 4,
      price: 650,
      image: "/images/product/mdf-box-clean.png",
      description: "Royal debossed Kurma emblem rigid wooden box with plush velvet lining.",
      active: true,
    },
    {
      id: "heritage",
      title: "The Heritage Box",
      size: "8 x 8 x 4 cm",
      capacity: 4,
      price: 650,
      image: "/images/product/image.png",
      description: "Classic textured heirloom wood finish with antiqued brass clasp.",
      active: true,
    },
    {
      id: "wood-small",
      title: "Premium Wooden Storage Box (Small)",
      size: "9 x 7 x 2.5 cm",
      capacity: 3,
      price: 550,
      image: "/images/product/marble-box-clean.png",
      description: "Solid natural pine wood keepsake box with brass hinged lid.",
      active: true,
    },
    {
      id: "wood-large",
      title: "Premium Wooden Storage Box (Large)",
      size: "12 x 10 x 4 cm",
      capacity: 7,
      price: 750,
      image: "/images/product/suite-clean.png",
      description: "Expansive luxury teakwood storage trunk for grand gift ensembles.",
      active: true,
    },
    {
      id: "rustic-basket",
      title: "Premium Rustic Weave Basket",
      size: "10.5 x 8.5 x 5.5 cm",
      capacity: 9,
      price: 1500,
      image: "/images/product/image9.png",
      description: "Handcrafted natural wicker weave tokri with dual bamboo handles.",
      active: true,
    },
    {
      id: "jute-natural",
      title: "Natural Colour Jute Basket",
      size: "12 x 12 x 3 cm",
      capacity: 4,
      price: 650,
      image: "/images/product/five-boxes-3d.png",
      description: "Eco-elegant hand-braided jute round basket with cotton liner.",
      active: true,
    },
    {
      id: "jute-cross",
      title: "Natural Beige Cross Pattern Basket",
      size: "13 x 7 x 3 cm",
      capacity: 5,
      price: 950,
      image: "/images/product/turtle-holder-clean.png",
      description: "Artisan cross-weave jute & burlap tokri with satin ribbon trim.",
      active: true,
    },
    {
      id: "cardboard-printed",
      title: "Premium Cardboard Printed Box",
      size: "10.25 x 8.25 x 3.25 cm",
      capacity: 6,
      price: 450,
      image: "/images/product/image.png",
      description: "Heavyweight rigid board wrapped in gold mandala motif paper.",
      active: true,
    },
    {
      id: "jute-yellow",
      title: "Butter Yellow Jute Tray",
      size: "15 x 11.5 x 3.25 cm",
      capacity: 7,
      price: 850,
      image: "/images/product/image7.png",
      description: "Vibrant yellow dye handwoven jute platter tray.",
      active: true,
    },
    {
      id: "jute-premium",
      title: "Premium Jute Tray",
      size: "15 x 11.5 x 3.25 cm",
      capacity: 7,
      price: 850,
      image: "/images/product/image8.png",
      description: "Sturdy braided jute vanity gift tray with golden handles.",
      active: true,
    },
    {
      id: "pink-small",
      title: "Pink Striped Mailer Box (Small)",
      size: "8 x 6 x 2 cm",
      capacity: 4,
      price: 350,
      image: "/images/product/image7.png",
      description: "Chic festive striped gift mailer with gold foil branding.",
      active: true,
    },
    {
      id: "pink-large",
      title: "Pink Striped Mailer Box (Large)",
      size: "12 x 9 x 3 cm",
      capacity: 6,
      price: 450,
      image: "/images/product/image8.png",
      description: "Spacious festive mailer crafted for curated multi-item gifting.",
      active: true,
    },
  ];

  for (const box of customBoxes) {
    await prisma.customBox.upsert({
      where: { id: box.id },
      update: box,
      create: box,
    });
  }

  // 4. Seed Patrons / Customers
  const patrons = [
    {
      name: "Priyesh Sharma",
      email: "priyesh.sharma@kurmaluxury.com",
      phone: "+91 98201 44821",
      city: "Mumbai, MH",
      role: "PATRON" as const,
      memberSince: "Nov 2024",
      tier: "Sovereign VIP",
    },
    {
      name: "Dr. Arvind Varma",
      email: "arvind.varma@heritagehealth.in",
      phone: "+91 94120 77301",
      city: "Bengaluru, KA",
      role: "PATRON" as const,
      memberSince: "Jan 2025",
      tier: "Sovereign VIP",
    },
    {
      name: "Sunita Singhania",
      email: "sunita@singhaniaestates.com",
      phone: "+91 98110 55490",
      city: "New Delhi, DL",
      role: "PATRON" as const,
      memberSince: "Mar 2025",
      tier: "Heritage Circle",
    },
    {
      name: "Kavita Reddy",
      email: "kavita.reddy@hyderabadtech.org",
      phone: "+91 97010 33811",
      city: "Hyderabad, TS",
      role: "PATRON" as const,
      memberSince: "Apr 2025",
      tier: "Patron",
    },
    {
      name: "Mehul Parekh",
      email: "mehul.parekh@ahmedabadsilks.com",
      phone: "+91 99040 11980",
      city: "Ahmedabad, GJ",
      role: "PATRON" as const,
      memberSince: "Jun 2025",
      tier: "Patron",
    },
  ];

  for (const p of patrons) {
    await prisma.user.upsert({
      where: { email: p.email },
      update: p,
      create: p,
    });
  }

  // 5. Seed Discounts
  const discounts = [
    {
      id: "disc-diwali",
      title: "DIWALI2026",
      subtitle: "15% off festive orders over ₹2,499",
      status: "Active",
      method: "Code",
      eligibility: "All customers",
      type: "Amount off order",
      used: 48,
      discountValue: "15%",
      minSpend: 2499,
      expiryDate: "Nov 15, 2026",
      maxUses: 500,
    },
    {
      id: "disc-vip",
      title: "ATELIERVIP",
      subtitle: "18% off bespoke luxury orders for VIP patrons",
      status: "Active",
      method: "Code",
      eligibility: "VIP Tier",
      type: "Amount off order",
      used: 19,
      discountValue: "18%",
      minSpend: 4999,
      expiryDate: "Dec 31, 2026",
      maxUses: 100,
    },
    {
      id: "disc-welcome",
      title: "KURMAWELCOME",
      subtitle: "₹300 off your maiden sacred ritual creation",
      status: "Active",
      method: "Code",
      eligibility: "First-time patrons",
      type: "Amount off order",
      used: 142,
      discountValue: "₹300",
      minSpend: 1500,
      expiryDate: "Ongoing",
    },
    {
      id: "disc-freeship",
      title: "ROYALSHIP",
      subtitle: "Complimentary pan-India insured express delivery",
      status: "Active",
      method: "Automatic",
      eligibility: "All customers",
      type: "Free shipping",
      used: 312,
      discountValue: "Free",
      minSpend: 999,
    },
  ];

  for (const d of discounts) {
    await prisma.discount.upsert({
      where: { id: d.id },
      update: d,
      create: d,
    });
  }

  // 6. Seed Initial Orders
  const initialOrders = [
    {
      id: "ord-1048",
      orderNumber: "#KURMA-1048",
      customerName: "Priyesh Sharma",
      customerEmail: "priyesh.sharma@kurmaluxury.com",
      customerPhone: "+91 98201 44821",
      city: "Mumbai, MH",
      dateFormatted: "Aug 04 at 4:55 pm",
      boxTitle: "The Celebration Box",
      boxImage: "/images/product/image.png",
      totalAmount: 3840,
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      fulfillmentStatus: "Processing",
      channel: "Kurma Sanctuary",
      carrier: "BlueDart Express",
      trackingNumber: "BLU-8842-MUM",
      personalization: {
        recipientName: "Riya & Dev",
        senderName: "The Sharma Family",
        giftNote: "May this Diwali bring boundless peace, prosperity, and divine radiance to your home sanctuary.",
        greetingCard: true,
        monogram: "Sharma Sanctum 2026",
      },
      items: [
        { sku: "mysore-chandan", name: "Royal Mysore Chandan Incense", quantity: 2, price: 650, image: "/images/product/image.png" },
        { sku: "brass-turtle", name: "Solid Brass Turtle Burner", quantity: 1, price: 1250, image: "/images/product/turtle-burner.png" },
        { sku: "scent-water", name: "Water (Jal) Luxury Scent Sticks", quantity: 1, price: 550, image: "/images/product/image.png" },
      ],
    },
    {
      id: "ord-1047",
      orderNumber: "#KURMA-1047",
      customerName: "Dr. Arvind Varma",
      customerEmail: "arvind.varma@heritagehealth.in",
      customerPhone: "+91 94120 77301",
      city: "Bengaluru, KA",
      dateFormatted: "Aug 04 at 3:34 pm",
      boxTitle: "Elements in Harmony Marble Gift Box",
      boxImage: "/images/product/marble-box-clean.png",
      totalAmount: 5890,
      paymentMethod: "Card",
      paymentStatus: "Paid",
      fulfillmentStatus: "Processing",
      channel: "Kurma Sanctuary",
      carrier: "Delhivery Air",
      trackingNumber: "DEL-9912-BLR",
      personalization: {
        recipientName: "Aditya Varma",
        senderName: "Dr. Arvind Varma",
        giftNote: "For your new clinic and spiritual haven. May the sacred turtle grant grounded stability and longevity.",
        greetingCard: true,
        monogram: "Dr. Varma Clinic",
      },
      items: [
        { sku: "pancha-5-elements", name: "5 Elements Luxury Incense Suite", quantity: 1, price: 2890, image: "/images/product/marble-box-clean.png" },
        { sku: "brass-turtle", name: "Handcrafted Solid Brass Turtle Stand", quantity: 1, price: 1250, image: "/images/product/turtle-burner.png" },
      ],
    },
    {
      id: "ord-1046",
      orderNumber: "#KURMA-1046",
      customerName: "Sunita Singhania",
      customerEmail: "sunita@singhaniaestates.com",
      customerPhone: "+91 98110 55490",
      city: "New Delhi, DL",
      dateFormatted: "Aug 03 at 2:15 pm",
      boxTitle: "Kurma MDF Keepsake Gift Box",
      boxImage: "/images/product/mdf-box-clean.png",
      totalAmount: 7450,
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      channel: "Corporate Concierge",
      carrier: "BlueDart Express",
      trackingNumber: "BLU-5521-DEL",
      personalization: {
        recipientName: "Vikram Singhania",
        senderName: "Sunita",
        giftNote: "Celebrating 25 blissful years. Sacred fragrance to elevate each morning pooja.",
        greetingCard: true,
        monogram: "Singhania 25th",
      },
      items: [
        { sku: "scent-space", name: "Space (Akash) Cosmic Incense", quantity: 2, price: 650, image: "/images/product/mdf-box-clean.png" },
        { sku: "scent-earth", name: "Earth (Prithvi) Pure Sandalwood", quantity: 2, price: 650, image: "/images/product/image.png" },
      ],
    },
    {
      id: "ord-1045",
      orderNumber: "#KURMA-1045",
      customerName: "Kavita Reddy",
      customerEmail: "kavita.reddy@hyderabadtech.org",
      customerPhone: "+91 97010 33811",
      city: "Hyderabad, TS",
      dateFormatted: "Aug 03 at 11:20 am",
      boxTitle: "The Heritage Keepsake Box",
      boxImage: "/images/product/image.png",
      totalAmount: 2150,
      paymentMethod: "Net Banking",
      paymentStatus: "Pending",
      fulfillmentStatus: "Unfulfilled",
      channel: "Kurma Sanctuary",
      carrier: "DTDC Priority",
      trackingNumber: "DTD-3381-HYD",
      personalization: {
        recipientName: "Ananya Reddy",
        senderName: "Aunt Kavita",
        giftNote: "All our blessings on your housewarming ceremony in Jubilee Hills.",
        greetingCard: true,
        monogram: "Ananya Nest",
      },
      items: [
        { sku: "scent-fire", name: "Fire (Agni) Spiced Clove Incense", quantity: 1, price: 550, image: "/images/product/image.png" },
      ],
    },
    {
      id: "ord-1044",
      orderNumber: "#KURMA-1044",
      customerName: "Mehul Parekh",
      customerEmail: "mehul.parekh@ahmedabadsilks.com",
      customerPhone: "+91 99040 11980",
      city: "Ahmedabad, GJ",
      dateFormatted: "Aug 02 at 6:40 pm",
      boxTitle: "Kurma MDF Keepsake Gift Box",
      boxImage: "/images/product/mdf-box-clean.png",
      totalAmount: 2890,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      channel: "Kurma Sanctuary",
      carrier: "Delhivery Surface",
      trackingNumber: "DEL-7740-AMD",
      personalization: {
        recipientName: "Nirav Parekh",
        senderName: "Mehul Parekh",
        giftNote: "Heartiest congratulations on your promotion. Pure calm for your workspace.",
        greetingCard: true,
      },
      items: [
        { sku: "scent-water", name: "Water (Jal) Scent Sticks", quantity: 2, price: 550, image: "/images/product/image.png" },
      ],
    },
    {
      id: "ord-draft-1",
      orderNumber: "#DRAFT-201",
      customerName: "Maharaja Heritage Hotels",
      customerEmail: "concierge@maharajaheritage.in",
      customerPhone: "+91 98290 12099",
      city: "Jaipur, RJ",
      dateFormatted: "Aug 04 at 1:10 pm",
      boxTitle: "Custom Marble Trunks (x20 Suites)",
      boxImage: "/images/product/marble-box-clean.png",
      totalAmount: 69980,
      paymentMethod: "Net Banking",
      paymentStatus: "Pending",
      fulfillmentStatus: "Unfulfilled",
      channel: "Corporate Concierge",
      carrier: "White Glove Logistics",
      trackingNumber: "PENDING-QUOTE",
      isDraft: true,
      personalization: {
        recipientName: "VIP Presidential Suite Guests",
        senderName: "General Manager",
        giftNote: "Welcome to the Pink City sanctuary.",
        greetingCard: true,
        monogram: "Maharaja Seal 2026",
      },
      items: [
        { sku: "marble-gift-box", name: "Elements in Harmony Marble Box", quantity: 20, price: 3499, image: "/images/product/marble-box-clean.png" },
      ],
    },
    {
      id: "ord-aband-1",
      orderNumber: "#CHECKOUT-981",
      customerName: "Rajeev Oberoi",
      customerEmail: "rajeev.oberoi@cloudtech.io",
      customerPhone: "+91 98450 66201",
      city: "Pune, MH",
      dateFormatted: "Aug 04 at 10:14 am",
      boxTitle: "Elements in Harmony Marble Gift Box",
      boxImage: "/images/product/marble-box-clean.png",
      totalAmount: 4749,
      paymentMethod: "Card",
      paymentStatus: "Pending",
      fulfillmentStatus: "Unfulfilled",
      channel: "Kurma Sanctuary",
      carrier: "Standard Air",
      trackingNumber: "ABANDONED-STEP3",
      isAbandoned: true,
      personalization: {
        recipientName: "Rajeev Oberoi",
        senderName: "Self",
        giftNote: "Sanctuary pooja setup.",
        greetingCard: false,
      },
      items: [
        { sku: "marble-gift-box", name: "Marble Keepsake Trunk", quantity: 1, price: 3499, image: "/images/product/marble-box-clean.png" },
      ],
    },
  ];

  for (const o of initialOrders) {
    const { items, ...orderData } = o;
    const existing = await prisma.order.findUnique({
      where: { orderNumber: o.orderNumber },
    });

    if (!existing) {
      await prisma.order.create({
        data: {
          ...orderData,
          items: {
            create: items.map((it) => ({
              productId: it.sku,
              sku: it.sku,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              image: it.image,
            })),
          },
        },
      });
    }
  }

  console.log("All catalog, categories, custom boxes, patrons, and orders seeded to Neon successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
