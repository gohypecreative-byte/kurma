"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  Inbox,
  UsersRound,
  BadgePercent,
  ChartNoAxesCombined,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  Upload,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Plus,
  Trash2,
  Pencil,
  Check,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  ExternalLink,
  Tag,
  FolderTree,
  Boxes,
  Eye,
  X,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Menu,
  ShieldCheck,
  Gift,
  Award,
  Layers,
  ChevronLeft,
  Percent,
} from "lucide-react";
import { PRODUCTS, ProductSKU } from "@/lib/products";
import AdminAnalyticsDashboard from "@/components/admin/AdminAnalyticsDashboard";
import AdminDiscountsSection, { CURATED_MASTER_DISCOUNTS } from "@/components/admin/AdminDiscountsSection";

// ============================================================================
// DATA STRUCTURES & INTERFACES
// ============================================================================

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  date: string;
  boxTitle: string;
  boxImage: string;
  itemsCount: number;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "UPI" | "Card" | "Net Banking" | "Cash on Delivery";
  paymentStatus: "Paid" | "Pending";
  fulfillmentStatus: "Unfulfilled" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  channel: "Kurma Sanctuary" | "Direct Atelier" | "Corporate Concierge";
  courier: string;
  awb: string;
  personalization: {
    recipientName: string;
    senderName: string;
    giftNote: string;
    greetingCard: boolean;
    monogram?: string;
  };
  isDraft?: boolean;
  isAbandoned?: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  initials: string;
  location: string;
  ordersCount: number;
  amountSpent: number;
  subscription: "Subscribed" | "Not subscribed";
  tier: "Patron" | "Sovereign VIP" | "Heritage Circle";
  lastOrderDate: string;
}

export interface AdminDiscount {
  id: string;
  title: string;
  subtitle: string;
  status: "Active" | "Scheduled" | "Expired";
  method: "Code" | "Automatic";
  eligibility: "All customers" | "Specific patrons" | "VIP Tier" | "First-time patrons" | string;
  type: "Amount off product" | "Buy X get Y" | "Amount off order" | "Free shipping" | string;
  used: number;
  discountValue: string;
  minSpend?: number;
  expiryDate?: string;
  maxUses?: number;
}

export interface AdminCategory {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  productCount: number;
  visible: boolean;
  targetRevenue: number;
  salesProgress: number;
  description?: string;
  image?: string;
  badge?: string;
  channels?: string[];
}

export interface AdminCollection {
  id: string;
  title: string;
  slug: string;
  itemsCount: number;
  description: string;
  status: "Active" | "Draft";
  image: string;
}

// ============================================================================
// INITIAL DATA (Kurma Sacred Luxury Catalog & Store Records)
// ============================================================================

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-1048",
    orderNumber: "#KURMA-1048",
    customerName: "Priyesh Sharma",
    customerEmail: "priyesh.sharma@kurmaluxury.com",
    customerPhone: "+91 98201 44821",
    city: "Mumbai, MH",
    date: "Aug 04 at 4:55 pm",
    boxTitle: "The Celebration Box",
    boxImage: "/images/product/image.png",
    itemsCount: 4,
    items: [
      { sku: "mysore-chandan", name: "Royal Mysore Chandan Incense", quantity: 2, price: 650, image: "/images/product/image.png" },
      { sku: "brass-turtle", name: "Solid Brass Turtle Burner", quantity: 1, price: 1250, image: "/images/product/turtle-burner.png" },
      { sku: "scent-water", name: "Water (Jal) Luxury Scent Sticks", quantity: 1, price: 550, image: "/images/product/image.png" },
    ],
    totalAmount: 3840,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    channel: "Kurma Sanctuary",
    courier: "BlueDart Express",
    awb: "BLU-8842-MUM",
    personalization: {
      recipientName: "Riya & Dev",
      senderName: "The Sharma Family",
      giftNote: "May this Diwali bring boundless peace, prosperity, and divine radiance to your home sanctuary.",
      greetingCard: true,
      monogram: "Sharma Sanctum 2026",
    },
  },
  {
    id: "ord-1047",
    orderNumber: "#KURMA-1047",
    customerName: "Dr. Arvind Varma",
    customerEmail: "arvind.varma@heritagehealth.in",
    customerPhone: "+91 94120 77301",
    city: "Bengaluru, KA",
    date: "Aug 04 at 3:34 pm",
    boxTitle: "Elements in Harmony Marble Gift Box",
    boxImage: "/images/product/marble-box-clean.png",
    itemsCount: 5,
    items: [
      { sku: "pancha-5-elements", name: "5 Elements Luxury Incense Suite", quantity: 1, price: 2890, image: "/images/product/marble-box-clean.png" },
      { sku: "brass-turtle", name: "Handcrafted Solid Brass Turtle Stand", quantity: 1, price: 1250, image: "/images/product/turtle-burner.png" },
      { sku: "temple-urn", name: "Sacred Moradabad Dhoop Urn", quantity: 1, price: 1750, image: "/images/product/mdf-box-clean.png" },
    ],
    totalAmount: 5890,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    channel: "Kurma Sanctuary",
    courier: "Delhivery Air",
    awb: "DEL-9912-BLR",
    personalization: {
      recipientName: "Aditya Varma",
      senderName: "Dr. Arvind Varma",
      giftNote: "For your new clinic and spiritual haven. May the sacred turtle grant grounded stability and longevity.",
      greetingCard: true,
      monogram: "Dr. Varma Clinic",
    },
  },
  {
    id: "ord-1046",
    orderNumber: "#KURMA-1046",
    customerName: "Sunita Singhania",
    customerEmail: "sunita@singhaniaestates.com",
    customerPhone: "+91 98110 55490",
    city: "New Delhi, DL",
    date: "Aug 03 at 2:15 pm",
    boxTitle: "Kurma MDF Keepsake Gift Box",
    boxImage: "/images/product/mdf-box-clean.png",
    itemsCount: 6,
    items: [
      { sku: "scent-space", name: "Space (Akash) Cosmic Incense", quantity: 2, price: 650, image: "/images/product/mdf-box-clean.png" },
      { sku: "scent-earth", name: "Earth (Prithvi) Pure Sandalwood", quantity: 2, price: 650, image: "/images/product/image.png" },
      { sku: "brass-turtle", name: "Cast Brass Turtle Burner", quantity: 2, price: 1250, image: "/images/product/turtle-burner.png" },
    ],
    totalAmount: 7450,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    channel: "Corporate Concierge",
    courier: "BlueDart Express",
    awb: "BLU-5521-DEL",
    personalization: {
      recipientName: "Vikram Singhania",
      senderName: "Sunita",
      giftNote: "Celebrating 25 blissful years. Sacred fragrance to elevate each morning pooja.",
      greetingCard: true,
      monogram: "Singhania 25th",
    },
  },
  {
    id: "ord-1045",
    orderNumber: "#KURMA-1045",
    customerName: "Kavita Reddy",
    customerEmail: "kavita.reddy@hyderabadtech.org",
    customerPhone: "+91 97010 33811",
    city: "Hyderabad, TS",
    date: "Aug 03 at 11:20 am",
    boxTitle: "The Heritage Keepsake Box",
    boxImage: "/images/product/image.png",
    itemsCount: 3,
    items: [
      { sku: "scent-fire", name: "Fire (Agni) Spiced Clove Incense", quantity: 1, price: 550, image: "/images/product/image.png" },
      { sku: "temple-flora", name: "Temple Flora Agarbatti Suite", quantity: 2, price: 800, image: "/images/product/image.png" },
    ],
    totalAmount: 2150,
    paymentMethod: "Net Banking",
    paymentStatus: "Pending",
    fulfillmentStatus: "Unfulfilled",
    channel: "Kurma Sanctuary",
    courier: "DTDC Priority",
    awb: "DTD-3381-HYD",
    personalization: {
      recipientName: "Ananya Reddy",
      senderName: "Aunt Kavita",
      giftNote: "All our blessings on your housewarming ceremony in Jubilee Hills.",
      greetingCard: true,
      monogram: "Ananya Nest",
    },
  },
  {
    id: "ord-1044",
    orderNumber: "#KURMA-1044",
    customerName: "Mehul Parekh",
    customerEmail: "mehul.parekh@ahmedabadsilks.com",
    customerPhone: "+91 99040 11980",
    city: "Ahmedabad, GJ",
    date: "Aug 02 at 6:40 pm",
    boxTitle: "Kurma MDF Keepsake Gift Box",
    boxImage: "/images/product/mdf-box-clean.png",
    itemsCount: 4,
    items: [
      { sku: "scent-water", name: "Water (Jal) Scent Sticks", quantity: 2, price: 550, image: "/images/product/image.png" },
      { sku: "scent-air", name: "Air (Vayu) Camphor & Frankincense", quantity: 2, price: 650, image: "/images/product/image.png" },
    ],
    totalAmount: 2890,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    channel: "Kurma Sanctuary",
    courier: "Delhivery Surface",
    awb: "DEL-7740-AMD",
    personalization: {
      recipientName: "Nirav Parekh",
      senderName: "Mehul Parekh",
      giftNote: "Heartiest congratulations on your promotion. Pure calm for your workspace.",
      greetingCard: true,
    },
  },
  // Draft orders
  {
    id: "ord-draft-1",
    orderNumber: "#DRAFT-201",
    customerName: "Maharaja Heritage Hotels",
    customerEmail: "concierge@maharajaheritage.in",
    customerPhone: "+91 98290 12099",
    city: "Jaipur, RJ",
    date: "Aug 04 at 1:10 pm",
    boxTitle: "Custom Marble Trunks (x20 Suites)",
    boxImage: "/images/product/marble-box-clean.png",
    itemsCount: 20,
    items: [
      { sku: "marble-gift-box", name: "Elements in Harmony Marble Box", quantity: 20, price: 3499, image: "/images/product/marble-box-clean.png" },
    ],
    totalAmount: 69980,
    paymentMethod: "Net Banking",
    paymentStatus: "Pending",
    fulfillmentStatus: "Unfulfilled",
    channel: "Corporate Concierge",
    courier: "White Glove Logistics",
    awb: "PENDING-QUOTE",
    personalization: {
      recipientName: "VIP Presidential Suite Guests",
      senderName: "General Manager",
      giftNote: "Welcome to the Pink City sanctuary.",
      greetingCard: true,
      monogram: "Maharaja Seal 2026",
    },
    isDraft: true,
  },
  {
    id: "ord-draft-2",
    orderNumber: "#DRAFT-202",
    customerName: "Nisha Singhal",
    customerEmail: "nisha.singhal@weddingcurations.co",
    customerPhone: "+91 99880 77112",
    city: "Udaipur, RJ",
    date: "Aug 03 at 5:00 pm",
    boxTitle: "Bespoke Bridal Keepsake Hampers",
    boxImage: "/images/product/image.png",
    itemsCount: 15,
    items: [
      { sku: "mdf-gift-box", name: "Kurma MDF Keepsake Box", quantity: 15, price: 1899, image: "/images/product/mdf-box-clean.png" },
    ],
    totalAmount: 28485,
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    fulfillmentStatus: "Unfulfilled",
    channel: "Direct Atelier",
    courier: "BlueDart Express",
    awb: "PENDING-DEPOSIT",
    personalization: {
      recipientName: "Singhal & Kapoor Wedding Guests",
      senderName: "Singhal Family",
      giftNote: "With love and festive blessings.",
      greetingCard: true,
      monogram: "N & R 2026",
    },
    isDraft: true,
  },
  // Abandoned Checkouts
  {
    id: "ord-aband-1",
    orderNumber: "#CHECKOUT-981",
    customerName: "Rajeev Oberoi",
    customerEmail: "rajeev.oberoi@cloudtech.io",
    customerPhone: "+91 98450 66201",
    city: "Pune, MH",
    date: "Aug 04 at 10:14 am",
    boxTitle: "Elements in Harmony Marble Gift Box",
    boxImage: "/images/product/marble-box-clean.png",
    itemsCount: 2,
    items: [
      { sku: "marble-gift-box", name: "Marble Keepsake Trunk", quantity: 1, price: 3499, image: "/images/product/marble-box-clean.png" },
      { sku: "brass-turtle", name: "Solid Brass Turtle Burner", quantity: 1, price: 1250, image: "/images/product/turtle-burner.png" },
    ],
    totalAmount: 4749,
    paymentMethod: "Card",
    paymentStatus: "Pending",
    fulfillmentStatus: "Unfulfilled",
    channel: "Kurma Sanctuary",
    courier: "Standard Air",
    awb: "ABANDONED-STEP3",
    personalization: {
      recipientName: "Rajeev Oberoi",
      senderName: "Self",
      giftNote: "Sanctuary pooja setup.",
      greetingCard: false,
    },
    isAbandoned: true,
  },
];

const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: "cust-1",
    name: "Priyesh Sharma",
    email: "priyesh.sharma@kurmaluxury.com",
    initials: "PS",
    location: "Mumbai, MH",
    ordersCount: 8,
    amountSpent: 28450,
    subscription: "Subscribed",
    tier: "Sovereign VIP",
    lastOrderDate: "Aug 04, 2026",
  },
  {
    id: "cust-2",
    name: "Dr. Arvind Varma",
    email: "arvind.varma@heritagehealth.in",
    initials: "AV",
    location: "Bengaluru, KA",
    ordersCount: 6,
    amountSpent: 24890,
    subscription: "Subscribed",
    tier: "Sovereign VIP",
    lastOrderDate: "Aug 04, 2026",
  },
  {
    id: "cust-3",
    name: "Sunita Singhania",
    email: "sunita@singhaniaestates.com",
    initials: "SS",
    location: "New Delhi, DL",
    ordersCount: 5,
    amountSpent: 38900,
    subscription: "Subscribed",
    tier: "Heritage Circle",
    lastOrderDate: "Aug 03, 2026",
  },
  {
    id: "cust-4",
    name: "Kavita Reddy",
    email: "kavita.reddy@hyderabadtech.org",
    initials: "KR",
    location: "Hyderabad, TS",
    ordersCount: 3,
    amountSpent: 9450,
    subscription: "Subscribed",
    tier: "Patron",
    lastOrderDate: "Aug 03, 2026",
  },
  {
    id: "cust-5",
    name: "Mehul Parekh",
    email: "mehul.parekh@ahmedabadsilks.com",
    initials: "MP",
    location: "Ahmedabad, GJ",
    ordersCount: 4,
    amountSpent: 14200,
    subscription: "Not subscribed",
    tier: "Patron",
    lastOrderDate: "Aug 02, 2026",
  },
  {
    id: "cust-6",
    name: "Ananya Deshmukh",
    email: "ananya.d@mumbaiart.in",
    initials: "AD",
    location: "Pune, MH",
    ordersCount: 2,
    amountSpent: 6890,
    subscription: "Subscribed",
    tier: "Patron",
    lastOrderDate: "Jul 28, 2026",
  },
];

const INITIAL_DISCOUNTS: AdminDiscount[] = CURATED_MASTER_DISCOUNTS;

const INITIAL_CATEGORIES: AdminCategory[] = [
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

const INITIAL_COLLECTIONS: AdminCollection[] = [
  {
    id: "col-1",
    title: "Pancha Mahabhuta Elements Suite",
    slug: "five-elements",
    itemsCount: 5,
    description: "The cosmic alignment of Earth, Water, Fire, Air, and Space sacred incense.",
    status: "Active",
    image: "/images/product/image.png",
  },
  {
    id: "col-2",
    title: "The Royal Diwali Keepsake Suite",
    slug: "diwali-keepsake",
    itemsCount: 3,
    description: "Handcrafted marble trunks and gold foil brass burners for auspicious gifting.",
    status: "Active",
    image: "/images/product/marble-box-clean.png",
  },
  {
    id: "col-3",
    title: "Moradabad Brass Masters Collection",
    slug: "moradabad-brass",
    itemsCount: 4,
    description: "Heavy solid sand-cast brass turtle burners and ritual dhoop urns.",
    status: "Active",
    image: "/images/product/turtle-burner.png",
  },
  {
    id: "col-4",
    title: "Temple Serenity Poojas",
    slug: "temple-serenity",
    itemsCount: 3,
    description: "Bamboo-free organic flora and pure essential oils for morning pooja.",
    status: "Active",
    image: "/images/product/mdf-box-clean.png",
  },
];

export interface AdminCustomBox {
  id: string;
  title: string;
  size: string;
  capacity: number;
  price: number;
  image: string;
  description: string;
  active: boolean;
}

export const INITIAL_CUSTOM_BOXES: AdminCustomBox[] = [
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

const BOX_IMAGE_PRESETS = [
  { label: "Celebration", url: "/images/product/mdf-box-clean.png" },
  { label: "Heritage", url: "/images/product/image.png" },
  { label: "Wood Small", url: "/images/product/marble-box-clean.png" },
  { label: "Wood Large", url: "/images/product/suite-clean.png" },
  { label: "Rustic Basket", url: "/images/product/image9.png" },
  { label: "Jute Round", url: "/images/product/five-boxes-3d.png" },
  { label: "Cross Pattern", url: "/images/product/turtle-holder-clean.png" },
  { label: "Yellow Tray", url: "/images/product/image7.png" },
  { label: "Jute Tray", url: "/images/product/image8.png" },
];

// Sparkline SVG coordinates for Overview metric cards
const MINI_GRAPH_POINTS: Record<string, string> = {
  Sessions: "0,18 6,17 12,12 18,15 24,10 30,13 36,7 42,11 48,5 54,4",
  "Total sales": "0,18 6,16 12,14 18,9 24,11 30,6 36,8 42,3 48,4 54,2",
  Orders: "0,18 8,16 16,11 24,14 32,8 40,10 48,4 54,3",
  "Conversion rate": "0,18 7,16 14,13 21,11 28,12 35,7 42,9 49,5 54,4",
};

// Sales overview multi-point chart data
const SALES_CHART_DATA = [
  { date: "Jul 05", current: 8200, previous: 4100 },
  { date: "Jul 09", current: 14500, previous: 7300 },
  { date: "Jul 13", current: 11200, previous: 9800 },
  { date: "Jul 17", current: 19800, previous: 12400 },
  { date: "Jul 21", current: 28400, previous: 15600 },
  { date: "Jul 25", current: 24100, previous: 18200 },
  { date: "Jul 29", current: 36500, previous: 22100 },
  { date: "Aug 01", current: 42800, previous: 26400 },
  { date: "Aug 04", current: 51200, previous: 29800 },
];

// ============================================================================
// MAIN COMPONENT: ADMIN DASHBOARD
// ============================================================================

export default function AdminDashboardPage() {
  // Navigation State mirroring reference routes.ts:
  // "home" (overview) | "orders" | "products" | "customers" | "discounts" | "analytics"
  const [activeRoute, setActiveRoute] = useState<
    "home" | "orders" | "products" | "customers" | "discounts" | "analytics"
  >("home");

  // Sub-routes mirroring routes.ts
  const [ordersSubView, setOrdersSubView] = useState<"all" | "drafts" | "abandoned">("all");
  const [productsSubView, setProductsSubView] = useState<"all" | "customise" | "inventory" | "categories">("all");
  const [analyticsSubView, setAnalyticsSubView] = useState<"overview" | "reports">("overview");

  // Collapsible sidebar accordion states
  const [ordersExpanded, setOrdersExpanded] = useState(true);
  const [productsExpanded, setProductsExpanded] = useState(true);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Overview states (matching AdminOverview.tsx)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<"Sessions" | "Total sales" | "Orders" | "Conversion rate">("Total sales");
  const [dateRangeLabel, setDateRangeLabel] = useState("Last 30 days");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Interactive Data States
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_CATEGORIES);
  const [collections, setCollections] = useState<AdminCollection[]>(INITIAL_COLLECTIONS);
  const [discounts, setDiscounts] = useState<AdminDiscount[]>(INITIAL_DISCOUNTS);
  const [productsList, setProductsList] = useState<ProductSKU[]>(PRODUCTS);
  const router = useRouter();

  // Customise Boxes State (Managed exclusively by Admin)
  const [customBoxes, setCustomBoxes] = useState<AdminCustomBox[]>(INITIAL_CUSTOM_BOXES);
  const [editingCustomBox, setEditingCustomBox] = useState<AdminCustomBox | null>(null);
  const [isAddCustomBoxOpen, setIsAddCustomBoxOpen] = useState(false);
  const [customBoxSearch, setCustomBoxSearch] = useState("");
  const [newCustomBox, setNewCustomBox] = useState<Partial<AdminCustomBox>>({
    title: "",
    size: "8 x 8 x 4 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/mdf-box-clean.png",
    description: "Royal debossed Kurma emblem rigid wooden box with plush velvet lining.",
    active: true,
  });

  // Stock inventory tracking for Kurma SKUs
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>({
    "mdf-gift-box": 12,
    "marble-gift-box": 8,
    "brass-turtle-holder": 19,
    "fragrance-earth": 6,
    "fragrance-water": 42,
    "fragrance-fire": 31,
    "fragrance-air": 55,
    "fragrance-space": 24,
  });

  // Load persisted products & inventory & categories from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kurma_admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
        }
      } else {
        localStorage.setItem("kurma_admin_products", JSON.stringify(PRODUCTS));
      }

      const storedCats = localStorage.getItem("kurma_admin_categories");
      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      } else {
        localStorage.setItem("kurma_admin_categories", JSON.stringify(INITIAL_CATEGORIES));
      }

      const storedStock = localStorage.getItem("kurma_inventory_stock");
      if (storedStock) {
        setInventoryStock(JSON.parse(storedStock));
      } else {
        localStorage.setItem("kurma_inventory_stock", JSON.stringify({
          "mdf-gift-box": 12,
          "marble-gift-box": 8,
          "brass-turtle-holder": 19,
          "fragrance-earth": 6,
          "fragrance-water": 42,
          "fragrance-fire": 31,
          "fragrance-air": 55,
          "fragrance-space": 24,
        }));
      }

      // Hydrate custom boxes from localStorage
      const storedBoxes = localStorage.getItem("kurma_custom_boxes");
      if (storedBoxes) {
        const parsed = JSON.parse(storedBoxes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomBoxes(parsed);
        }
      } else {
        localStorage.setItem("kurma_custom_boxes", JSON.stringify(INITIAL_CUSTOM_BOXES));
      }

      // Hydrate discounts from localStorage
      const storedDiscounts = localStorage.getItem("kurma_admin_discounts");
      if (storedDiscounts) {
        try {
          const parsed = JSON.parse(storedDiscounts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDiscounts(parsed);
          }
        } catch {}
      } else {
        localStorage.setItem("kurma_admin_discounts", JSON.stringify(CURATED_MASTER_DISCOUNTS));
      }

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "kurma_custom_boxes" && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) setCustomBoxes(parsed);
          } catch {}
        }
        if (e.key === "kurma_admin_discounts" && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) setDiscounts(parsed);
          } catch {}
        }
      };
      window.addEventListener("storage", handleStorageChange);
      const handleCustomUpdate = () => {
        try {
          const stored = localStorage.getItem("kurma_custom_boxes");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) setCustomBoxes(parsed);
          }
        } catch {}
      };
      window.addEventListener("kurma_custom_boxes_updated", handleCustomUpdate);
      const handleDiscountsUpdate = () => {
        try {
          const stored = localStorage.getItem("kurma_admin_discounts");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) setDiscounts(parsed);
          }
        } catch {}
      };
      window.addEventListener("kurma_discounts_updated", handleDiscountsUpdate);

      // Check query parameters to activate specific sub-views (e.g. ?route=products&sub=categories)
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const r = params.get("route");
        const sub = params.get("sub");
        if (r === "products") {
          setActiveRoute("products");
          if (sub === "customise" || sub === "inventory" || sub === "categories") {
            setProductsSubView(sub as any);
          }
        } else if (r && ["home", "orders", "customers", "discounts", "analytics"].includes(r)) {
          setActiveRoute(r as any);
          if (r === "orders" && sub && ["all", "drafts", "abandoned"].includes(sub)) {
            setOrdersSubView(sub as any);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Search & Filter queries
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [discountSearchQuery, setDiscountSearchQuery] = useState("");

  // Modals
  const [inspectOrder, setInspectOrder] = useState<AdminOrder | null>(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isCreateDiscountOpen, setIsCreateDiscountOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // New Creation Form Data
  const [newProductData, setNewProductData] = useState({
    name: "",
    subtitle: "Handcrafted Luxury • Sacred Kurma Atelier",
    category: "Gift Boxes",
    price: 1899,
    originalPrice: 2499,
    stock: 25,
    image: "/images/product/image.png",
    description: "",
  });

  // Handler to add a new product to catalog
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name.trim()) return;

    const newId =
      newProductData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
      `sku-${Date.now()}`;

    const newProduct: ProductSKU = {
      id: newId,
      name: newProductData.name.trim(),
      subtitle: newProductData.subtitle.trim() || "Handcrafted Luxury • Sacred Kurma Atelier",
      category: (newProductData.category as any) || "Gift Boxes",
      price: Number(newProductData.price) || 1899,
      originalPrice: Number(newProductData.originalPrice) || Number(newProductData.price) * 1.25,
      image: newProductData.image || "/images/product/image.png",
      description:
        newProductData.description.trim() ||
        "Artisanal sacred creation handcrafted with organic essences and master craftsmanship.",
      details: [
        "Ethically sourced organic ingredients",
        "Hand-finished sacred artisan craftsmanship",
        "Complimentary deckle-edge calligraphy blessing",
      ],
      customizationFields: [],
    };

    const updatedList = [newProduct, ...productsList];
    setProductsList(updatedList);
    try {
      localStorage.setItem("kurma_admin_products", JSON.stringify(updatedList));
      const updatedStock = { ...inventoryStock, [newId]: Number(newProductData.stock) || 20 };
      setInventoryStock(updatedStock);
      localStorage.setItem("kurma_inventory_stock", JSON.stringify(updatedStock));
    } catch {
      // ignore
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.title.toLowerCase().includes(newProductData.category.toLowerCase()) ||
        cat.slug.toLowerCase().includes(newProductData.category.toLowerCase())
          ? { ...cat, productCount: cat.productCount + 1 }
          : cat
      )
    );

    // Reset form
    setNewProductData({
      name: "",
      subtitle: "Handcrafted Luxury • Sacred Kurma Atelier",
      category: "Gift Boxes",
      price: 1899,
      originalPrice: 2499,
      stock: 25,
      image: "/images/product/image.png",
      description: "",
    });

    setIsAddProductOpen(false);
    setActiveRoute("products");
    setProductsSubView("all");
    triggerNotification(`Creation "${newProduct.name}" added to Kurma catalog!`);
  };

  const deleteProduct = (id: string, name: string) => {
    const updatedList = productsList.filter((p) => p.id !== id);
    setProductsList(updatedList);
    try {
      localStorage.setItem("kurma_admin_products", JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    triggerNotification(`Product "${name}" removed from catalog.`);
  };

  const [newDiscountData, setNewDiscountData] = useState({
    code: "",
    type: "Amount off order" as AdminDiscount["type"],
    discountValue: "10%",
    method: "Code" as AdminDiscount["method"],
    subtitle: "10% off entire festive purchase",
    minSpend: 2500,
  });

  const [newCategoryData, setNewCategoryData] = useState({
    title: "",
    slug: "",
    targetRevenue: 50000,
  });

  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    location: "Mumbai, MH",
    tier: "Patron" as AdminCustomer["tier"],
  });

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Dynamic greeting based on current hour
  const currentHour = new Date().getHours();
  const greetingText =
    currentHour < 12 ? "Good Morning" : currentHour < 17 ? "Good Afternoon" : "Good Evening";

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Sub-view filtering
      if (ordersSubView === "drafts" && !ord.isDraft) return false;
      if (ordersSubView === "abandoned" && !ord.isAbandoned) return false;
      if (ordersSubView === "all" && (ord.isDraft || ord.isAbandoned)) return false;

      // Status filtering
      if (orderStatusFilter !== "All") {
        if (orderStatusFilter === "Paid" && ord.paymentStatus !== "Paid") return false;
        if (orderStatusFilter === "Pending" && ord.paymentStatus !== "Pending") return false;
        if (orderStatusFilter === "Processing" && ord.fulfillmentStatus !== "Processing") return false;
        if (orderStatusFilter === "Delivered" && ord.fulfillmentStatus !== "Delivered") return false;
      }

      // Search filtering
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchesNumber = ord.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = ord.customerName.toLowerCase().includes(q);
        const matchesCity = ord.city.toLowerCase().includes(q);
        return matchesNumber || matchesCustomer || matchesCity;
      }

      return true;
    });
  }, [orders, ordersSubView, orderStatusFilter, orderSearchQuery]);

  // Adjust stock counter
  const updateStock = (sku: string, delta: number) => {
    setInventoryStock((prev) => {
      const current = prev[sku] ?? 10;
      const next = Math.max(0, current + delta);
      return { ...prev, [sku]: next };
    });
    triggerNotification(`Inventory updated for SKU ${sku}`);
  };

  // Toggle Category Visibility
  const toggleCategoryVisibility = (id: string) => {
    setCategories((prev) => {
      const updated = prev.map((cat) => (cat.id === id ? { ...cat, visible: !cat.visible } : cat));
      try {
        localStorage.setItem("kurma_admin_categories", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    triggerNotification("Category visibility updated in sanctuary catalog");
  };

  // Format INR Currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filtered Customise Boxes
  const filteredCustomBoxes = useMemo(() => {
    if (!customBoxSearch.trim()) return customBoxes;
    const q = customBoxSearch.toLowerCase().trim();
    return customBoxes.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.size.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }, [customBoxes, customBoxSearch]);

  // Handle Box Image File Upload
  const handleCustomBoxImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isNew) {
        setNewCustomBox((prev) => ({ ...prev, image: base64 }));
      } else if (editingCustomBox) {
        setEditingCustomBox({ ...editingCustomBox, image: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  // Save edited customise box
  const handleSaveCustomBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomBox) return;

    const updated = customBoxes.map((b) => (b.id === editingCustomBox.id ? editingCustomBox : b));
    setCustomBoxes(updated);
    try {
      localStorage.setItem("kurma_custom_boxes", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_custom_boxes_updated"));
    } catch {}
    setEditingCustomBox(null);
    triggerNotification(`Saved changes to "${editingCustomBox.title}"! Changes are live on /elements.`);
  };

  // Add new customise box
  const handleAddCustomBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomBox.title) return;

    const created: AdminCustomBox = {
      id: `box-${Date.now()}`,
      title: newCustomBox.title,
      size: newCustomBox.size || "10 x 8 x 3 cm",
      capacity: Number(newCustomBox.capacity) || 4,
      price: Number(newCustomBox.price) || 650,
      image: newCustomBox.image || "/images/product/mdf-box-clean.png",
      description: newCustomBox.description || "Handcrafted bespoke Kurma luxury presentation keepsake.",
      active: newCustomBox.active ?? true,
    };

    const updated = [...customBoxes, created];
    setCustomBoxes(updated);
    try {
      localStorage.setItem("kurma_custom_boxes", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_custom_boxes_updated"));
    } catch {}
    setIsAddCustomBoxOpen(false);
    setNewCustomBox({
      title: "",
      size: "8 x 8 x 4 cm",
      capacity: 4,
      price: 650,
      image: "/images/product/mdf-box-clean.png",
      description: "Royal debossed Kurma emblem rigid wooden box with plush velvet lining.",
      active: true,
    });
    triggerNotification(`Created new bespoke box "${created.title}"!`);
  };

  // Toggle Custom Box Visibility
  const handleToggleCustomBoxActive = (boxId: string) => {
    const updated = customBoxes.map((b) => (b.id === boxId ? { ...b, active: !b.active } : b));
    setCustomBoxes(updated);
    try {
      localStorage.setItem("kurma_custom_boxes", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_custom_boxes_updated"));
    } catch {}
    triggerNotification("Box visibility updated on storefront customizer!");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A18] font-sans antialiased flex flex-col selection:bg-[#eed08e]/30 selection:text-[#072515]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#072515] text-[#eed08e] px-4 py-3 rounded-xl shadow-2xl border border-[#eed08e]/30 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="size-4 text-[#eed08e]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container: Desktop Side-by-Side without gaps */}
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-35 lg:hidden transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* ==================================================================== */}
        {/* SIDEBAR NAVIGATION (Matching admin-panel/components/app-sidebar.tsx) */}
        {/* ==================================================================== */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-white text-[#11110f] flex flex-col border-r border-black/10
            transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:sticky lg:top-0 lg:h-screen lg:shrink-0
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-black/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="size-9 rounded-xl bg-[#072515] text-[#eed08e] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <span className="text-[#eed08e] text-base font-serif font-bold">K</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold text-sm tracking-wider text-[#072515]">KURMA</span>
                <span className="text-[10px] text-black/55 font-medium tracking-wide">Atelier Administration</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-black/50 hover:text-black hover:bg-black/5"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Navigation Links (Mirrors routes.ts and nav-main.tsx with SVG branch connector) */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
            {/* 1. Home / Overview */}
            <button
              type="button"
              onClick={() => {
                setActiveRoute("home");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeRoute === "home"
                  ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                  : "text-black/70 hover:text-black hover:bg-black/[0.04]"
              }`}
            >
              <Home className={`size-4 ${activeRoute === "home" ? "text-black" : "text-black/55"}`} />
              <span className="flex-1 text-left">Home</span>
            </button>

            {/* 2. Orders Group (with collapsible children & SVG guide) */}
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRoute("orders");
                    setOrdersSubView("all");
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                    activeRoute === "orders" && ordersSubView === "all"
                      ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                      : "text-black/70 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  <Inbox className={`size-4 ${activeRoute === "orders" && ordersSubView === "all" ? "text-black" : "text-black/55"}`} />
                  <span className="text-left">Orders</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrdersExpanded(!ordersExpanded)}
                  className="p-2 text-black/45 hover:text-black"
                >
                  <ChevronRight className={`size-3.5 transition-transform duration-200 ${ordersExpanded ? "rotate-90" : ""}`} />
                </button>
              </div>

              {ordersExpanded && (
                <div className="relative ml-5 pl-4 mt-1 space-y-0.5">
                  {/* Real SVG Tree Connector Line matching nav-main.tsx */}
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 overflow-visible text-black/25"
                    width="16"
                    height="68"
                    viewBox="0 0 16 68"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 0 V48" />
                    <path d="M1 18 Q1 22 5 22 H12" />
                    <path d="M10 19 L13 22 L10 25" />
                    <path d="M1 44 Q1 48 5 48 H12" />
                    <path d="M10 45 L13 48 L10 51" />
                  </svg>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRoute("orders");
                      setOrdersSubView("drafts");
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                      activeRoute === "orders" && ordersSubView === "drafts"
                        ? "text-black font-semibold bg-black/5"
                        : "text-black/65 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <span>Drafts</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/5 text-black/70 font-medium">2</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRoute("orders");
                      setOrdersSubView("abandoned");
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                      activeRoute === "orders" && ordersSubView === "abandoned"
                        ? "text-black font-semibold bg-black/5"
                        : "text-black/65 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <span>Abandoned checkouts</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-medium">1</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Products Group (with collapsible children & SVG guide) */}
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRoute("products");
                    setProductsSubView("all");
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                    activeRoute === "products" && productsSubView === "all"
                      ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                      : "text-black/70 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  <Package className={`size-4 ${activeRoute === "products" && productsSubView === "all" ? "text-black" : "text-black/55"}`} />
                  <span className="text-left">Products</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProductsExpanded(!productsExpanded)}
                  className="p-2 text-black/45 hover:text-black"
                >
                  <ChevronRight className={`size-3.5 transition-transform duration-200 ${productsExpanded ? "rotate-90" : ""}`} />
                </button>
              </div>

              {productsExpanded && (
                <div className="relative ml-5 pl-4 mt-1 space-y-0.5">
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 overflow-visible text-black/25"
                    width="16"
                    height="68"
                    viewBox="0 0 16 68"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 0 V48" />
                    <path d="M1 18 Q1 22 5 22 H12" />
                    <path d="M10 19 L13 22 L10 25" />
                    <path d="M1 44 Q1 48 5 48 H12" />
                    <path d="M10 45 L13 48 L10 51" />
                  </svg>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRoute("products");
                      setProductsSubView("customise");
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                      activeRoute === "products" && productsSubView === "customise"
                        ? "text-black font-semibold bg-black/5"
                        : "text-black/65 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <span>Customise</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#072515]/10 text-[#072515] font-semibold">Bespoke</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRoute("products");
                      setProductsSubView("inventory");
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                      activeRoute === "products" && productsSubView === "inventory"
                        ? "text-black font-semibold bg-black/5"
                        : "text-black/65 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <span>Inventory</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">Live</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Customers */}
            <button
              type="button"
              onClick={() => {
                setActiveRoute("customers");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeRoute === "customers"
                  ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                  : "text-black/70 hover:text-black hover:bg-black/[0.04]"
              }`}
            >
              <UsersRound className={`size-4 ${activeRoute === "customers" ? "text-black" : "text-black/55"}`} />
              <span className="flex-1 text-left">Customers</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/5 text-black/70 font-medium">
                {customers.length}
              </span>
            </button>

            {/* 5. Discounts */}
            <button
              type="button"
              onClick={() => {
                setActiveRoute("discounts");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeRoute === "discounts"
                  ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                  : "text-black/70 hover:text-black hover:bg-black/[0.04]"
              }`}
            >
              <BadgePercent className={`size-4 ${activeRoute === "discounts" ? "text-black" : "text-black/55"}`} />
              <span className="flex-1 text-left">Discounts</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/5 text-black/70 font-medium">
                {discounts.length}
              </span>
            </button>

            {/* 6. Analytics (with Reports sub-item) */}
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRoute("analytics");
                    setAnalyticsSubView("overview");
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                    activeRoute === "analytics" && analyticsSubView === "overview"
                      ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                      : "text-black/70 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  <ChartNoAxesCombined className={`size-4 ${activeRoute === "analytics" && analyticsSubView === "overview" ? "text-black" : "text-black/55"}`} />
                  <span className="text-left">Analytics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
                  className="p-2 text-black/45 hover:text-black"
                >
                  <ChevronRight className={`size-3.5 transition-transform duration-200 ${analyticsExpanded ? "rotate-90" : ""}`} />
                </button>
              </div>

              {analyticsExpanded && (
                <div className="relative ml-5 pl-4 mt-1 space-y-0.5">
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 overflow-visible text-black/25"
                    width="16"
                    height="42"
                    viewBox="0 0 16 42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 0 V22" />
                    <path d="M1 18 Q1 22 5 22 H12" />
                    <path d="M10 19 L13 22 L10 25" />
                  </svg>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRoute("analytics");
                      setAnalyticsSubView("reports");
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                      activeRoute === "analytics" && analyticsSubView === "reports"
                        ? "text-black font-semibold bg-black/5"
                        : "text-black/65 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <span>Reports</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/5 text-black/70 font-medium">5</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* User Profile Footer (Matching nav-user.tsx) */}
          <div className="p-3 border-t border-black/10 bg-white">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-black/[0.03] border border-black/5 hover:bg-black/[0.05] transition-colors">
              <div className="size-8 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                KA
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-black truncate">Kurma Admin</p>
                <p className="text-[10px] text-black/50 truncate">admin@kurmaluxury.com</p>
              </div>
              <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-white shrink-0" title="Online Sanctuary Sync" />
            </div>
          </div>
        </aside>

        {/* ==================================================================== */}
        {/* MAIN CONTENT AREA */}
        {/* ==================================================================== */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar Navigation */}
          <header className="sticky top-0 z-30 h-16 bg-white border-b border-black/10 px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-black/70 hover:bg-black/5"
              >
                <Menu className="size-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-black/50 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-black/10 w-64 lg:w-80">
                <Search className="size-3.5 text-black/40" />
                <input
                  type="text"
                  placeholder="Search orders, creations, patrons... ⌘K"
                  className="bg-transparent outline-none w-full text-xs text-black placeholder:text-black/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 bg-white text-xs font-medium text-black/80 hover:bg-black/5 transition-colors"
              >
                <span>View Sanctuary</span>
                <ExternalLink className="size-3 text-black/50" />
              </Link>

              <button
                type="button"
                onClick={() => triggerNotification("No new unread atelier alerts.")}
                className="relative p-2 rounded-lg text-black/70 hover:bg-black/5 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#eed08e] ring-2 ring-white" />
              </button>
            </div>
          </header>

          {/* ================================================================== */}
          {/* ROUTE 1: HOME (OVERVIEW) — Faithful Re-creation of AdminOverview.tsx */}
          {/* ================================================================== */}
          {activeRoute === "home" && (
            <main className="flex-1 p-4 sm:p-6 space-y-5 bg-[#f6f5f1]">
              {/* Top Greeting & Date Range Picker */}
              <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-serif font-bold text-[#072515] tracking-tight">
                    {greetingText}, Admin
                  </h1>
                  <p className="mt-0.5 text-xs text-black/60">
                    Here&apos;s what&apos;s happening with your luxury Kurma sanctuary today.
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={isDatePickerOpen}
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/20 bg-white px-3 text-xs font-medium text-black/80 shadow-sm transition hover:bg-black/[0.03]"
                  >
                    <CalendarDays className="size-3.5 text-[#072515]" />
                    <span>{dateRangeLabel}</span>
                    <ChevronDown className="size-3.5 text-black/50" />
                  </button>

                  {/* Date Picker Popover */}
                  {isDatePickerOpen && (
                    <div className="absolute right-0 top-10 z-40 flex w-[min(580px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/15 bg-white shadow-xl animate-fade-in">
                      <div className="hidden sm:block w-36 border-r border-black/10 bg-[#FAF8F5] p-2">
                        {["Today", "Yesterday", "Last 7 days", "Last 30 days", "Quarter to date", "Custom range"].map(
                          (opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setDateRangeLabel(opt);
                                setIsDatePickerOpen(false);
                                triggerNotification(`Date range set to ${opt}`);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                opt === dateRangeLabel ? "bg-[#072515] text-[#eed08e] font-semibold" : "text-black/70 hover:bg-black/5"
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        )}
                      </div>
                      <div className="flex-1 p-4 text-xs">
                        <div className="flex items-center gap-2 pb-3 border-b border-black/10">
                          <span className="text-black/70">Show data for</span>
                          <span className="font-semibold text-[#072515]">{dateRangeLabel}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-black/5">
                            <p className="font-semibold text-black/80">Active Sanctuary Period</p>
                            <p className="mt-1 text-sm font-bold text-[#072515]">Jul 05 – Aug 04, 2026</p>
                          </div>
                          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-black/5">
                            <p className="font-semibold text-black/80">Comparison Period</p>
                            <p className="mt-1 text-sm font-bold text-black/60">Jun 05 – Jul 04, 2026</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsDatePickerOpen(false)}
                            className="px-3 py-1.5 rounded-md border border-black/20 text-xs font-medium hover:bg-black/5"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsDatePickerOpen(false)}
                            className="px-3 py-1.5 rounded-md bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90"
                          >
                            Apply Range
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive 4 Metric Cards + Expandable Sales Chart (Exact from AdminOverview.tsx) */}
              <section className="relative rounded-xl border border-black/10 bg-white p-3 sm:p-4 shadow-sm">
                <button
                  type="button"
                  aria-label={isOverviewExpanded ? "Collapse overview chart" : "Expand overview chart"}
                  onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                  className="absolute right-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md text-black/50 transition-colors hover:bg-black/5 hover:text-black"
                >
                  {isOverviewExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 gap-2 pr-8 sm:grid-cols-4">
                  {[
                    { label: "Sessions", value: "1,842", change: "↗ 14.8%" },
                    { label: "Total sales", value: "₹3,84,650", change: "↗ 22.4%" },
                    { label: "Orders", value: "48", change: "↗ 8.1%" },
                    { label: "Conversion rate", value: "4.12%", change: "↗ 1.05%" },
                  ].map((m) => {
                    const isSelected = selectedMetric === m.label;
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setSelectedMetric(m.label as any)}
                        className={`relative min-h-16 rounded-lg p-3 text-left transition-all ${
                          isSelected
                            ? "bg-[#072515]/5 border border-[#072515]/20 shadow-sm"
                            : "bg-white hover:bg-black/[0.02] border border-black/5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-medium text-black/70">{m.label}</span>
                          {isSelected && <span className="text-xs text-[#072515] font-bold">↗</span>}
                        </div>
                        <p className="mt-1 text-base font-bold text-[#072515]">
                          {m.value}{" "}
                          <span className="text-[11px] font-normal text-emerald-700 ml-1">{m.change}</span>
                        </p>
                        {/* Mini Sparkline when collapsed */}
                        {!isOverviewExpanded && (
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 54 20"
                            className="pointer-events-none absolute bottom-2 right-3 h-5 w-14"
                            preserveAspectRatio="none"
                          >
                            <polyline
                              points={MINI_GRAPH_POINTS[m.label] || "0,18 25,10 54,4"}
                              fill="none"
                              stroke="#c89e43"
                              strokeWidth="1.5"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Expanded Multi-Point Line Chart */}
                {isOverviewExpanded && (
                  <div className="mt-4 pt-3 border-t border-black/5">
                    <div className="flex items-center justify-between pb-2 text-xs text-black/60">
                      <span className="font-semibold text-black/80">{selectedMetric} Performance Over Time</span>
                      <div className="flex items-center gap-4 text-[11px]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-[#072515]" /> Jul 05–Aug 04, 2026 (Current)
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-[#eed08e] border border-black/20" /> Jun 05–Jul 04, 2026 (Previous)
                        </span>
                      </div>
                    </div>

                    <div className="relative h-56 w-full pt-4">
                      {/* Grid Lines */}
                      <div className="absolute inset-x-0 top-6 border-b border-dashed border-black/10" />
                      <div className="absolute inset-x-0 top-24 border-b border-dashed border-black/10" />
                      <div className="absolute inset-x-0 top-40 border-b border-dashed border-black/10" />

                      {/* SVG Multi-curve */}
                      <svg
                        className="w-full h-44 overflow-visible"
                        viewBox="0 0 900 160"
                        preserveAspectRatio="none"
                      >
                        {/* Previous period line (dashed gold) */}
                        <path
                          d="M 20 140 Q 120 130 220 115 T 440 90 T 660 65 T 880 40"
                          fill="none"
                          stroke="#eed08e"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        {/* Current period line (solid deep green) */}
                        <path
                          d="M 20 135 Q 120 100 220 110 T 440 60 T 660 40 T 880 15"
                          fill="none"
                          stroke="#072515"
                          strokeWidth="2.5"
                        />

                        {/* Interactive Data points */}
                        {[
                          [20, 135],
                          [125, 115],
                          [235, 105],
                          [345, 80],
                          [455, 60],
                          [565, 48],
                          [675, 40],
                          [785, 25],
                          [880, 15],
                        ].map(([cx, cy], idx) => (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r="4"
                            className="fill-[#eed08e] stroke-[#072515] stroke-2 hover:r-6 cursor-pointer transition-all"
                          />
                        ))}
                      </svg>

                      {/* X-Axis dates */}
                      <div className="flex justify-between text-[11px] text-black/50 pt-2 px-1">
                        {SALES_CHART_DATA.map((pt) => (
                          <span key={pt.date}>{pt.date}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Atelier Tasks Action Badges (from AdminOverview.tsx) */}
              <div className="grid gap-2.5 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRoute("orders");
                    setOrderStatusFilter("Processing");
                  }}
                  className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#072515] shadow-sm hover:border-[#072515]/30 transition-all text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span>4 orders to fulfil</span>
                  </span>
                  <span className="text-black/40 text-[11px]">View queue →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRoute("orders");
                    setOrderStatusFilter("Pending");
                  }}
                  className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#072515] shadow-sm hover:border-[#072515]/30 transition-all text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span>1 payment to capture</span>
                  </span>
                  <span className="text-black/40 text-[11px]">Capture →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRoute("orders");
                    triggerNotification("Filtering custom monogram personalization orders.");
                  }}
                  className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#072515] shadow-sm hover:border-[#072515]/30 transition-all text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#c89e43]" />
                    <span>3 monograms in laser chisel</span>
                  </span>
                  <span className="text-black/40 text-[11px]">Inspect →</span>
                </button>
              </div>

              {/* 3-Column Middle Section (Exact from AdminOverview.tsx) */}
              <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
                {/* Column 1: Recent Orders */}
                <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-[#072515]">Recent orders</h2>
                      <button
                        type="button"
                        onClick={() => setActiveRoute("orders")}
                        className="text-xs text-[#072515] font-medium underline underline-offset-2 hover:opacity-80"
                      >
                        View all
                      </button>
                    </div>

                    <div className="mt-3 divide-y divide-black/5">
                      {orders.slice(0, 3).map((ord) => (
                        <div
                          key={ord.id}
                          className="flex items-center justify-between gap-3 py-2.5 text-xs hover:bg-black/[0.02] transition-colors rounded-lg px-1.5"
                        >
                          <div>
                            <span className="font-semibold text-[#072515]">{ord.orderNumber}</span>
                            <p className="text-[11px] text-black/50">{ord.customerName}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              ord.fulfillmentStatus === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.fulfillmentStatus}
                          </span>
                          <div className="text-right">
                            <span className="font-semibold text-[#072515]">{formatINR(ord.totalAmount)}</span>
                            <button
                              type="button"
                              onClick={() => setInspectOrder(ord)}
                              className="block text-[10px] text-black/50 hover:text-[#072515] underline"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Column 2: Top Products */}
                <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#072515]">Top products</h2>
                    <div className="mt-3 space-y-3">
                      {[
                        { name: "Elements in Harmony Marble Box", sales: "28 sold", img: "/images/product/marble-box-clean.png" },
                        { name: "Solid Brass Turtle Burner", sales: "24 sold", img: "/images/product/turtle-burner.png" },
                        { name: "Royal Mysore Chandan Agarbatti", sales: "19 sold", img: "/images/product/image.png" },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative size-8 rounded border border-black/10 overflow-hidden shrink-0 bg-[#FAF8F5]">
                              <Image src={item.img} alt={item.name} fill className="object-cover" />
                            </div>
                            <span className="truncate font-medium text-black/80">{item.name}</span>
                          </div>
                          <span className="shrink-0 font-semibold text-[#072515]">{item.sales}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Column 3: Quick Actions */}
                <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#072515]">Quick actions</h2>
                    <div className="mt-3 grid gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(true)}
                        className="rounded-lg border border-black/15 px-3 py-2 text-left text-xs font-medium transition hover:bg-[#072515] hover:text-[#eed08e] flex items-center justify-between"
                      >
                        <span>Add creation / SKU</span>
                        <Plus className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveRoute("products");
                          setProductsSubView("categories");
                        }}
                        className="rounded-lg border border-black/15 px-3 py-2 text-left text-xs font-medium transition hover:bg-[#072515] hover:text-[#eed08e] flex items-center justify-between"
                      >
                        <span>Manage categories</span>
                        <FolderTree className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveRoute("customers")}
                        className="rounded-lg border border-black/15 px-3 py-2 text-left text-xs font-medium transition hover:bg-[#072515] hover:text-[#eed08e] flex items-center justify-between"
                      >
                        <span>View patrons directory</span>
                        <UsersRound className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreateDiscountOpen(true)}
                        className="rounded-lg border border-black/15 px-3 py-2 text-left text-xs font-medium transition hover:bg-[#072515] hover:text-[#eed08e] flex items-center justify-between"
                      >
                        <span>Create festive discount</span>
                        <BadgePercent className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* 4 Bottom Snapshot Cards (Exact from AdminOverview.tsx) */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* 1. Store health */}
                <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#072515]">Store health</h2>
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="mt-2 text-2xl font-bold font-serif text-[#072515]">99%</p>
                  <p className="mt-0.5 text-xs text-black/55">All sanctuary systems operational</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10">
                    <div className="h-full w-[99%] rounded-full bg-emerald-600" />
                  </div>
                </section>

                {/* 2. Traffic sources */}
                <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                  <h2 className="text-sm font-semibold text-[#072515]">Traffic sources</h2>
                  <div className="mt-3 space-y-2 text-xs">
                    {[
                      ["Direct Atelier", "48%"],
                      ["Instagram Gifting", "32%"],
                      ["Organic Poojas", "20%"],
                    ].map(([source, val]) => (
                      <div key={source}>
                        <div className="flex justify-between text-black/70">
                          <span>{source}</span>
                          <span className="font-semibold text-black">{val}</span>
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-black/10">
                          <div className="h-full rounded-full bg-[#072515]" style={{ width: val }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Inventory alerts */}
                <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                  <h2 className="text-sm font-semibold text-[#072515]">Inventory alerts</h2>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-black/70">Low stock</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">3 items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/70">Out of stock</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">0 items</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRoute("products");
                        setProductsSubView("inventory");
                      }}
                      className="pt-1 text-[#072515] underline underline-offset-2 hover:opacity-80 block"
                    >
                      Review inventory matrix →
                    </button>
                  </div>
                </section>

                {/* 4. Customer snapshot */}
                <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                  <h2 className="text-sm font-semibold text-[#072515]">Customer snapshot</h2>
                  <p className="mt-2 text-2xl font-bold font-serif text-[#072515]">1,284</p>
                  <p className="mt-0.5 text-xs text-black/55">Total registered patrons</p>
                  <p className="mt-2 text-xs font-semibold text-emerald-700">↗ 12.4% this period</p>
                </section>
              </div>
            </main>
          )}

          {/* ================================================================== */}
          {/* ROUTE 2: ORDERS (All Orders, Drafts, Abandoned Checkouts)           */}
          {/* ================================================================== */}
          {activeRoute === "orders" && (
            <main className="flex-1 p-4 sm:p-6 bg-[#f6f5f1] space-y-4">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h1 className="flex items-center gap-2 text-lg font-semibold text-[#072515]">
                    <Inbox className="size-4 text-[#c89e43]" />
                    <span>
                      {ordersSubView === "all"
                        ? "Orders"
                        : ordersSubView === "drafts"
                        ? "Draft Orders"
                        : "Abandoned Checkouts"}
                    </span>
                  </h1>
                  <div className="flex items-center rounded-lg bg-black/5 p-0.5 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setOrdersSubView("all")}
                      className={`px-2.5 py-1 rounded-md transition ${ordersSubView === "all" ? "bg-white text-[#072515] shadow-xs" : "text-black/60"}`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrdersSubView("drafts")}
                      className={`px-2.5 py-1 rounded-md transition ${ordersSubView === "drafts" ? "bg-white text-[#072515] shadow-xs" : "text-black/60"}`}
                    >
                      Drafts
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrdersSubView("abandoned")}
                      className={`px-2.5 py-1 rounded-md transition ${ordersSubView === "abandoned" ? "bg-white text-[#072515] shadow-xs" : "text-black/60"}`}
                    >
                      Abandoned
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerNotification("Exported orders CSV successfully.")}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white border border-black/15 px-3 text-xs font-medium text-black hover:bg-black/5"
                  >
                    <Download className="size-3.5" /> Export
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateOrderOpen(true)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#072515] px-3 text-xs font-medium text-[#eed08e] hover:bg-[#072515]/90"
                  >
                    <Plus className="size-3.5" /> Create order
                  </button>
                </div>
              </div>

              {/* Summary Strip (from admin-panel/screens/orders/page.tsx) */}
              <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="grid grid-cols-2 divide-x divide-y divide-black/10 sm:grid-cols-3 lg:grid-cols-7 lg:divide-y-0">
                  <div className="flex items-center gap-2 px-4 py-3.5 text-xs font-semibold text-[#072515]">
                    <CalendarDays className="size-4 text-[#c89e43]" /> Today
                  </div>
                  {[
                    ["Orders", "6"],
                    ["Items ordered", "18"],
                    ["Returns", "₹0"],
                    ["Orders fulfilled", "4"],
                    ["Orders delivered", "2"],
                    ["Fulfillment time", "1.4 days"],
                  ].map(([label, val]) => (
                    <div key={label} className="px-4 py-3">
                      <p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">{label}</p>
                      <p className="mt-1 text-sm font-bold text-[#072515]">{val}</p>
                      <div className="mt-2 h-0.5 w-10 bg-[#c89e43]" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Filter & Search Bar */}
              <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="flex flex-wrap items-center gap-3 border-b border-black/10 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-black/75">
                    <span>Status:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="bg-transparent border border-black/15 rounded-md px-2 py-1 text-xs outline-none"
                    >
                      <option value="All">All statuses</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Payment pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div className="flex min-w-52 flex-1 items-center gap-2 text-xs text-black/50">
                    <Search className="size-3.5 text-black/40" />
                    <input
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search order #, patron name, or city..."
                      className="w-full bg-transparent outline-none placeholder:text-black/40 text-black text-xs"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] border-collapse text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-black/70">
                      <tr>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Order</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Date</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Customer</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Channel</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium text-right">Total</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Payment status</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Fulfillment</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Items</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Courier</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-4 py-12 text-center text-black/50">
                            No orders found matching the criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-black/[0.015] transition-colors">
                            <td className="px-3 py-2.5 font-bold text-[#072515]">{ord.orderNumber}</td>
                            <td className="px-3 py-2.5 text-black/60">{ord.date}</td>
                            <td className="px-3 py-2.5 font-medium">
                              <div>{ord.customerName}</div>
                              <div className="text-[10px] text-black/45">{ord.city}</div>
                            </td>
                            <td className="px-3 py-2.5 text-black/65">{ord.channel}</td>
                            <td className="px-3 py-2.5 text-right font-bold text-[#072515]">{formatINR(ord.totalAmount)}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  ord.paymentStatus === "Paid"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  ord.fulfillmentStatus === "Delivered"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : ord.fulfillmentStatus === "Shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : ord.fulfillmentStatus === "Processing"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {ord.fulfillmentStatus}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-black/65">{ord.itemsCount} items</td>
                            <td className="px-3 py-2.5 text-black/65">{ord.courier}</td>
                            <td className="px-3 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => setInspectOrder(ord)}
                                className="px-2.5 py-1 rounded bg-[#072515]/5 hover:bg-[#072515] hover:text-[#eed08e] text-[#072515] font-semibold text-[11px] transition"
                              >
                                Inspect Hamper
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </main>
          )}

          {/* ================================================================== */}
          {/* ROUTE 3: PRODUCTS (All Products, Collections, Categories, Inventory) */}
          {/* ================================================================== */}
          {activeRoute === "products" && (
            <main className="flex-1 p-4 sm:p-6 bg-[#f6f5f1] space-y-4">
              {/* Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h1 className="flex items-center gap-2 text-lg font-semibold text-[#072515]">
                    <Tag className="size-4 text-[#c89e43]" />
                    <span>
                      {productsSubView === "all"
                        ? "Products"
                        : productsSubView === "customise"
                        ? "Customise Studio"
                        : productsSubView === "inventory"
                        ? "Inventory"
                        : "Categories"}
                    </span>
                  </h1>

                  <div className="flex items-center rounded-lg bg-black/5 p-0.5 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setProductsSubView("all")}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${productsSubView === "all" ? "bg-white text-[#072515] shadow-xs" : "text-black/60"}`}
                    >
                      Products
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductsSubView("customise")}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${productsSubView === "customise" ? "bg-white text-[#072515] shadow-xs" : "text-black/60"}`}
                    >
                      Customise
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductsSubView("inventory")}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${productsSubView === "inventory" ? "bg-white text-[#072515] shadow-xs" : "text-black/60"}`}
                    >
                      Inventory
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {productsSubView === "all" && (
                    <button
                      type="button"
                      onClick={() => setIsAddProductOpen(true)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#072515] px-3 text-xs font-medium text-[#eed08e] hover:bg-[#072515]/90"
                    >
                      <Plus className="size-3.5" /> Add product
                    </button>
                  )}
                  {productsSubView === "customise" && (
                    <button
                      type="button"
                      onClick={() => router.push("/admin/customise")}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#072515] px-3 text-xs font-medium text-[#eed08e] hover:bg-[#072515]/90 transition cursor-pointer"
                    >
                      <SlidersHorizontal className="size-3.5" /> Open Full Studio
                    </button>
                  )}
                </div>
              </div>

              {/* VIEW 3A: ALL PRODUCTS */}
              {productsSubView === "all" && (
                <>
                  {/* Summary Bar */}
                  <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                    <div className="grid grid-cols-2 divide-x divide-y divide-black/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0">
                      <div className="flex items-center gap-2 px-4 py-3.5 text-xs font-semibold text-[#072515]">
                        <CalendarDays className="size-4 text-[#c89e43]" /> 30 days
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">Sell-through rate</p>
                        <p className="mt-1 text-sm font-bold text-[#072515]">0.08%</p>
                        <div className="mt-2 h-0.5 w-10 bg-[#c89e43]" />
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">Days inventory remaining</p>
                        <p className="mt-1 text-sm font-bold text-[#072515]">42 days avg</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">ABC luxury analysis</p>
                        <p className="mt-1 text-sm font-bold text-[#072515]">Grade A (Sacred Heritage)</p>
                      </div>
                    </div>
                  </section>

                  {/* Products Table */}
                  <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
                      <Search className="size-3.5 text-black/40" />
                      <input
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        placeholder="Search product creation, notes, or SKU..."
                        className="w-full bg-transparent outline-none text-xs text-black placeholder:text-black/40"
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                        <thead className="bg-[#FAF8F5] text-black/70">
                          <tr>
                            <th className="border-b border-black/10 px-4 py-2.5 font-medium">Product</th>
                            <th className="border-b border-black/10 px-3 py-2.5 font-medium">Status</th>
                            <th className="border-b border-black/10 px-3 py-2.5 font-medium">Inventory</th>
                            <th className="border-b border-black/10 px-3 py-2.5 font-medium">Category</th>
                            <th className="border-b border-black/10 px-3 py-2.5 font-medium">Channels</th>
                            <th className="border-b border-black/10 px-3 py-2.5 font-medium text-right">Price</th>
                            <th className="border-b border-black/10 px-3 py-2.5 font-medium text-center">Stock & Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                          {productsList.filter((p) => p.name.toLowerCase().includes(productSearchQuery.toLowerCase())).map((prod) => {
                            const stockCount = inventoryStock[prod.id] ?? 12;
                            return (
                              <tr key={prod.id} className="hover:bg-black/[0.015] transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="relative size-10 rounded-lg overflow-hidden border border-black/10 bg-[#FAF8F5] shrink-0">
                                      <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                      <button
                                        type="button"
                                        onClick={() => router.push(`/admin/products/edit?id=${encodeURIComponent(prod.id)}`)}
                                        className="font-semibold text-[#072515] hover:underline text-left block"
                                        title="Click to edit product on dedicated page"
                                      >
                                        {prod.name}
                                      </button>
                                      <p className="text-[10px] text-black/50">{prod.subtitle || prod.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                    Active
                                  </span>
                                </td>
                                <td className="px-3 py-3 font-medium">
                                  <span className={stockCount < 10 ? "text-amber-700 font-bold" : "text-black/80"}>
                                    {stockCount} in stock
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-black/65">{prod.category}</td>
                                <td className="px-3 py-3 text-black/65">Kurma Online</td>
                                <td className="px-3 py-3 text-right font-bold text-[#072515]">{formatINR(prod.price)}</td>
                                <td className="px-3 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <div className="inline-flex items-center gap-1 border border-black/15 rounded-lg px-2 py-0.5 bg-white">
                                      <button
                                        type="button"
                                        onClick={() => updateStock(prod.id, -1)}
                                        className="size-5 rounded hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                                        title="Decrease stock"
                                      >
                                        -
                                      </button>
                                      <span className="w-6 text-center font-semibold text-xs">{stockCount}</span>
                                      <button
                                        type="button"
                                        onClick={() => updateStock(prod.id, 1)}
                                        className="size-5 rounded hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                                        title="Increase stock"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => router.push(`/admin/products/edit?id=${encodeURIComponent(prod.id)}`)}
                                      className="p-1.5 rounded-md text-black/50 hover:text-[#072515] hover:bg-black/5 transition"
                                      title="Edit creation on dedicated page"
                                    >
                                      <Pencil className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteProduct(prod.id, prod.name)}
                                      className="p-1.5 rounded-md text-black/40 hover:text-red-600 hover:bg-red-50 transition"
                                      title="Delete creation"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}

              {/* VIEW 3B: CUSTOMISE STUDIO (Bespoke Hampers & Packaging from /elements) */}
              {productsSubView === "customise" && (
                <section className="space-y-4">
                  {/* Hero Banner linking to full dedicated page */}
                  <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-xs sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#072515] text-[#eed08e]">
                          Bespoke Studio
                        </span>
                        <span className="text-xs text-black/50 font-medium">Powering /elements frontend</span>
                      </div>
                      <h2 className="text-base font-bold text-[#072515] font-serif">
                        Customise Gift Studio &amp; Keepsake Packaging
                      </h2>
                      <p className="text-xs text-black/60 max-w-xl">
                        Only administrators can edit packaging boxes, adjust slot capacities, update base prices, and manage storefront catalog visibility.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                      <a
                        href="/elements"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-xs font-semibold text-[#072515] transition shadow-2xs"
                      >
                        <span>Preview Live (/elements)</span>
                        <ExternalLink className="size-3 text-[#c89e43]" />
                      </a>
                      <button
                        type="button"
                        onClick={() => router.push("/admin/customise/edit?id=new")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Bespoke Box</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/admin/customise")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-bold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer"
                      >
                        <SlidersHorizontal className="size-3.5" />
                        <span>Launch Full Studio</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Studio Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-xl bg-white border border-black/10 shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-black/45 tracking-wider block">
                        Bespoke Trunks &amp; Boxes
                      </span>
                      <span className="text-lg font-serif font-bold text-[#072515] mt-1 block">
                        {customBoxes.length} Trunks ({customBoxes.filter((b) => b.active !== false).length} Active)
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                        Editable Exclusively by Admin
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-black/10 shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-black/45 tracking-wider block">
                        Curated Goodies Library
                      </span>
                      <span className="text-lg font-serif font-bold text-[#072515] mt-1 block">14 Items</span>
                      <span className="text-[11px] text-black/55 mt-0.5 block">Candles, Flora, Brass &amp; Silk</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-black/10 shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-black/45 tracking-wider block">
                        Brass Plaque Monogram
                      </span>
                      <span className="text-lg font-serif font-bold text-[#072515] mt-1 block">Active (+₹350)</span>
                      <span className="text-[11px] text-[#c89e43] font-semibold mt-0.5 block">Max 24 Characters</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-black/10 shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-black/45 tracking-wider block">
                        Storefront Status
                      </span>
                      <span className="text-lg font-serif font-bold text-emerald-800 mt-1 block">Live on /elements</span>
                      <span className="text-[11px] text-black/55 mt-0.5 block">Synchronized with Admin Edits</span>
                    </div>
                  </div>

                  {/* Table of Customise Boxes with Edit Feature */}
                  <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs">
                    <div className="p-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#072515]">
                            Customise Gift Trunks &amp; Packaging ({filteredCustomBoxes.length})
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eed08e]/20 text-[#072515]">
                            Admin Editable
                          </span>
                        </div>
                        <p className="text-[11px] text-black/55 mt-0.5">
                          Click &quot;Edit Box&quot; to change prices, slot capacities, title, dimensions, or upload images.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40" />
                          <input
                            type="text"
                            placeholder="Search boxes..."
                            value={customBoxSearch}
                            onChange={(e) => setCustomBoxSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-lg border border-black/15 text-xs outline-none focus:border-[#072515] w-36 sm:w-48 bg-stone-50/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => router.push("/admin/customise/edit?id=new")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition shadow-2xs cursor-pointer"
                        >
                          <Plus className="size-3" />
                          <span>Add Box</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#FAF8F5] text-black/70 border-b border-black/10">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">Trunk / Box</th>
                            <th className="px-3 py-2.5 font-medium">Dimensions</th>
                            <th className="px-3 py-2.5 font-medium">Slot Capacity</th>
                            <th className="px-3 py-2.5 font-medium">Base Price</th>
                            <th className="px-3 py-2.5 font-medium">Store Visibility</th>
                            <th className="px-3 py-2.5 font-medium text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                          {filteredCustomBoxes.map((b) => (
                            <tr key={b.id} className="hover:bg-black/[0.015] transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative size-11 rounded-lg overflow-hidden border border-black/10 bg-[#FAF8F5] shrink-0">
                                    <Image src={b.image} alt={b.title} fill className="object-contain p-0.5" unoptimized />
                                  </div>
                                  <div className="min-w-0 max-w-xs">
                                    <span className="font-bold text-[#072515] block truncate">{b.title}</span>
                                    <span className="text-[11px] text-black/50 line-clamp-1 block">{b.description}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-3 text-black/60 font-mono text-[11px] whitespace-nowrap">{b.size}</td>
                              <td className="px-3 py-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#072515]/10 text-[#072515]">
                                  {b.capacity} Slots
                                </span>
                              </td>
                              <td className="px-3 py-3 font-bold text-[#072515] whitespace-nowrap">{formatINR(b.price)}</td>
                              <td className="px-3 py-3 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCustomBoxActive(b.id)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                                    b.active !== false
                                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                      : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                                  }`}
                                  title="Click to toggle storefront visibility"
                                >
                                  <span className={`size-1.5 rounded-full ${b.active !== false ? "bg-emerald-600" : "bg-stone-500"}`} />
                                  <span>{b.active !== false ? "Active" : "Hidden"}</span>
                                </button>
                              </td>
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => router.push(`/admin/customise/edit?id=${b.id}`)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition shadow-2xs cursor-pointer"
                                    title={`Edit ${b.title} on dedicated page`}
                                  >
                                    <Pencil className="size-3" />
                                    <span>Edit Box</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => router.push(`/admin/customise/edit?id=${b.id}`)}
                                    className="p-1.5 rounded-lg hover:bg-black/5 text-black/40 hover:text-black transition cursor-pointer"
                                    title="Open Dedicated Edit Box Page"
                                  >
                                    <ExternalLink className="size-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* VIEW 3D: INVENTORY MATRIX */}
              {productsSubView === "inventory" && (
                <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-[#072515]">Live Atelier Inventory Matrix</h2>
                      <p className="text-xs text-black/55">Real-time stock quantities across Delhi Central & Moradabad ateliers.</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {productsList.map((prod) => {
                      const stockCount = inventoryStock[prod.id] ?? 12;
                      const isLow = stockCount < 10;
                      return (
                        <div
                          key={prod.id}
                          className="p-3.5 rounded-xl border border-black/10 bg-[#FAF8F5] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-black/50">{prod.id}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  isLow ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {isLow ? "Low Stock" : "Healthy"}
                              </span>
                            </div>
                            <h4 className="mt-1 font-semibold text-xs text-[#072515] line-clamp-1">{prod.name}</h4>
                            <p className="text-[11px] text-black/50">{prod.category}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-[#072515]">{stockCount} units</span>
                            <div className="inline-flex items-center gap-1 border border-black/15 rounded-lg px-2 py-0.5 bg-white">
                              <button
                                type="button"
                                onClick={() => updateStock(prod.id, -1)}
                                className="size-5 rounded hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-xs font-semibold">{stockCount}</span>
                              <button
                                type="button"
                                onClick={() => updateStock(prod.id, 1)}
                                className="size-5 rounded hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </main>
          )}

          {/* ================================================================== */}
          {/* ROUTE 4: CUSTOMERS (Patrons Directory)                            */}
          {/* ================================================================== */}
          {activeRoute === "customers" && (
            <main className="flex-1 p-4 sm:p-6 bg-[#f6f5f1] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="flex items-center gap-2 text-lg font-semibold text-[#072515]">
                  <UsersRound className="size-4 text-[#c89e43]" />
                  <span>Patrons & Clients</span>
                </h1>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerNotification("Exported customer patrons directory.")}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white border border-black/15 px-3 text-xs font-medium text-black hover:bg-black/5"
                  >
                    <Download className="size-3.5" /> Export
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCustomerOpen(true)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#072515] px-3 text-xs font-medium text-[#eed08e] hover:bg-[#072515]/90"
                  >
                    <Plus className="size-3.5" /> Add patron
                  </button>
                </div>
              </div>

              <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
                  <Search className="size-3.5 text-black/40" />
                  <input
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    placeholder="Search patrons by name, email, or city..."
                    className="w-full bg-transparent outline-none text-xs text-black placeholder:text-black/40"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] border-collapse text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-black/70">
                      <tr>
                        <th className="border-b border-black/10 px-4 py-2.5 font-medium">Customer name</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Email subscription</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium">Location</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium text-center">Orders</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium text-right">Amount spent</th>
                        <th className="border-b border-black/10 px-3 py-2.5 font-medium text-center">Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {customers
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                            c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                            c.location.toLowerCase().includes(customerSearchQuery.toLowerCase())
                        )
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-black/[0.015]">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="size-8 rounded-full bg-[#072515]/10 text-[#072515] font-bold flex items-center justify-center text-xs">
                                  {c.initials}
                                </div>
                                <div>
                                  <p className="font-semibold text-[#072515]">{c.name}</p>
                                  <p className="text-[10px] text-black/50">{c.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                                {c.subscription}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-black/70 font-medium">{c.location}</td>
                            <td className="px-3 py-3 text-center font-bold text-[#072515]">{c.ordersCount}</td>
                            <td className="px-3 py-3 text-right font-bold text-[#072515]">{formatINR(c.amountSpent)}</td>
                            <td className="px-3 py-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#eed08e]/30 text-[#072515] font-semibold border border-[#c89e43]/30">
                                {c.tier}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </main>
          )}

          {/* ================================================================== */}
          {/* ROUTE 5: DISCOUNTS & FESTIVE VOUCHERS                              */}
          {/* ================================================================== */}
          {activeRoute === "discounts" && (
            <AdminDiscountsSection
              discounts={discounts}
              setDiscounts={setDiscounts}
              triggerNotification={triggerNotification}
            />
          )}

          {/* ================================================================== */}
          {/* ROUTE 6: ANALYTICS & REPORTS (Comprehensive Interactive Intelligence) */}
          {/* ================================================================== */}
          {activeRoute === "analytics" && (
            <AdminAnalyticsDashboard
              orders={orders}
              productsList={productsList}
              inventoryStock={inventoryStock}
              customBoxes={customBoxes}
              categories={categories}
              customers={customers}
              triggerNotification={triggerNotification}
              onNavigateToTab={(route, subView) => {
                setActiveRoute(route as any);
                if (subView && route === "products") setProductsSubView(subView as any);
                if (subView && route === "orders") setOrdersSubView(subView as any);
              }}
            />
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: INSPECT HAMPER PERSONALIZATION DETAILS                       */}
      {/* ==================================================================== */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#eed08e]/30 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#eed08e]">{inspectOrder.orderNumber}</span>
                <h3 className="font-serif font-bold text-base text-white">{inspectOrder.boxTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectOrder(null)}
                className="p-1 rounded-md text-white/70 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Personalization Card Styling */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#c89e43]/30">
                <span className="text-[10px] font-bold text-[#c89e43] uppercase tracking-wider block mb-1">
                  Deckle-Edge Gift Card Message
                </span>
                <p className="text-sm font-serif italic text-[#072515]">
                  &ldquo;{inspectOrder.personalization.giftNote}&rdquo;
                </p>
                <div className="mt-3 flex justify-between text-xs text-black/60 pt-2 border-t border-black/10">
                  <span>To: <strong>{inspectOrder.personalization.recipientName}</strong></span>
                  <span>From: <strong>{inspectOrder.personalization.senderName}</strong></span>
                </div>
                {inspectOrder.personalization.monogram && (
                  <div className="mt-2 text-xs font-semibold text-[#072515]">
                    Laser Monogram: &ldquo;{inspectOrder.personalization.monogram}&rdquo;
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-semibold text-xs text-[#072515] mb-2">Curated Items Included:</h4>
                <div className="divide-y divide-black/5 border border-black/10 rounded-xl overflow-hidden bg-white">
                  {inspectOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-9 rounded overflow-hidden border border-black/10 bg-[#FAF8F5]">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-black/80">{item.name}</p>
                          <p className="text-[10px] text-black/45">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#072515]">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Logistics */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-black/[0.02] rounded-xl border border-black/10">
                <div>
                  <span className="text-[10px] text-black/50 block">Courier Tracking:</span>
                  <span className="font-semibold text-[#072515]">{inspectOrder.courier}</span>
                  <span className="block font-mono text-[11px] text-black/60">{inspectOrder.awb}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black/50 block">Payment Method:</span>
                  <span className="font-semibold text-[#072515]">{inspectOrder.paymentMethod}</span>
                  <span className="block text-[11px] text-emerald-700 font-bold">{inspectOrder.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border-t border-black/10 flex items-center justify-between">
              <span className="font-bold text-sm text-[#072515]">Total: {formatINR(inspectOrder.totalAmount)}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrders((prev) =>
                      prev.map((o) =>
                        o.id === inspectOrder.id ? { ...o, fulfillmentStatus: "Shipped" } : o
                      )
                    );
                    setInspectOrder(null);
                    triggerNotification(`Order ${inspectOrder.orderNumber} marked as Shipped via ${inspectOrder.courier}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90"
                >
                  Mark as Shipped
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: ADD PRODUCT MODAL                                           */}
      {/* ==================================================================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/15 flex flex-col max-h-[92vh]">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#eed08e]">Atelier Product Composer</span>
                <h3 className="font-serif font-bold text-base text-white">Add Sacred Creation to Catalog</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-md text-white/70 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            <form
              onSubmit={handleAddProduct}
              className="p-5 overflow-y-auto space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-black/75 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Moradabad Lotus Dhoop Burner"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-black/75 mb-1">Subtitle / Craftsmanship Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Hand-Cast Brass • Moradabad Heritage Craft"
                  value={newProductData.subtitle}
                  onChange={(e) => setNewProductData({ ...newProductData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black/75 mb-1">Category</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white text-xs"
                  >
                    <option value="Gift Boxes">Gift Boxes</option>
                    <option value="Fragrances">Fragrances</option>
                    <option value="Sacred Accessories">Sacred Accessories</option>
                    <option value="Royal Mysore Chandan">Royal Mysore Chandan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-black/75 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black/75 mb-1">Compare-at MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newProductData.originalPrice}
                    onChange={(e) => setNewProductData({ ...newProductData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/75 mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={newProductData.stock}
                    onChange={(e) => setNewProductData({ ...newProductData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515] text-xs"
                  />
                </div>
              </div>

              {/* Product Image Visual Selector */}
              <div>
                <label className="block font-semibold text-black/75 mb-1.5">Select Atelier Image Thumbnail</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { label: "Celebration Box", path: "/images/product/image.png" },
                    { label: "Marble Trunk", path: "/images/product/marble-box-clean.png" },
                    { label: "Turtle Burner", path: "/images/product/turtle-burner.png" },
                    { label: "MDF Keepsake", path: "/images/product/mdf-box-clean.png" },
                  ].map((imgItem) => (
                    <button
                      key={imgItem.path}
                      type="button"
                      onClick={() => setNewProductData({ ...newProductData, image: imgItem.path })}
                      className={`relative p-1 rounded-xl border flex flex-col items-center gap-1 transition ${
                        newProductData.image === imgItem.path
                          ? "border-[#072515] ring-2 ring-[#072515]/20 bg-[#FAF8F5]"
                          : "border-black/10 hover:border-black/30 bg-white"
                      }`}
                    >
                      <div className="relative size-12 rounded-lg overflow-hidden border border-black/10 bg-[#FAF8F5]">
                        <Image src={imgItem.path} alt={imgItem.label} fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-[10px] font-medium text-black/70 truncate w-full text-center">
                        {imgItem.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom image path (e.g. /images/product/custom.png)"
                  value={newProductData.image}
                  onChange={(e) => setNewProductData({ ...newProductData, image: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-black/20 outline-none focus:border-[#072515] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-black/75 mb-1">Fragrance Notes & Materials</label>
                <textarea
                  rows={2}
                  placeholder="Hand-poured pure mysore sandalwood, natural temple resins, heavy sand-cast brass..."
                  value={newProductData.description}
                  onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515] resize-none text-xs"
                />
              </div>

              <div className="pt-3 border-t border-black/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-black/20 text-xs font-medium hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" /> Save Creation & Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ==================================================================== */}
      {/* MODAL 4: ADD CATEGORY MODAL                                          */}
      {/* ==================================================================== */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/15">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#eed08e]">Add Sanctuary Category</h3>
              <button type="button" onClick={() => setIsAddCategoryOpen(false)} className="text-white/60 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCategories((prev) => [
                  ...prev,
                  {
                    id: `cat-${Date.now()}`,
                    title: newCategoryData.title,
                    slug: newCategoryData.slug || newCategoryData.title.toLowerCase().replace(/\s+/g, "-"),
                    parentId: null,
                    productCount: 0,
                    visible: true,
                    targetRevenue: newCategoryData.targetRevenue,
                    salesProgress: 0,
                  },
                ]);
                setIsAddCategoryOpen(false);
                triggerNotification(`Category "${newCategoryData.title}" created.`);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-black/75 mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sacred Ritual Dhoop"
                  value={newCategoryData.title}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-black/75 mb-1">Target Revenue (₹)</label>
                <input
                  type="number"
                  required
                  value={newCategoryData.targetRevenue}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, targetRevenue: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-black/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-black/20 text-xs font-medium hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: ADD PATRON CUSTOMER MODAL                                   */}
      {/* ==================================================================== */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/15">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#eed08e]">Enroll New Sanctuary Patron</h3>
              <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="text-white/60 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const initials = newCustomerData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                setCustomers((prev) => [
                  {
                    id: `cust-${Date.now()}`,
                    name: newCustomerData.name,
                    email: newCustomerData.email,
                    initials: initials || "KP",
                    location: newCustomerData.location,
                    ordersCount: 0,
                    amountSpent: 0,
                    subscription: "Subscribed",
                    tier: newCustomerData.tier,
                    lastOrderDate: "New Patron",
                  },
                  ...prev,
                ]);
                setIsAddCustomerOpen(false);
                triggerNotification(`Patron "${newCustomerData.name}" enrolled.`);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-black/75 mb-1">Patron Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Khurana"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-black/75 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh.khurana@luxury.in"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black/75 mb-1">City / State</label>
                  <input
                    type="text"
                    required
                    value={newCustomerData.location}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/75 mb-1">Patron Tier</label>
                  <select
                    value={newCustomerData.tier}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white"
                  >
                    <option>Patron</option>
                    <option>Sovereign VIP</option>
                    <option>Heritage Circle</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-black/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-black/20 text-xs font-medium hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90"
                >
                  Enroll Patron
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: CREATE ORDER MODAL                                          */}
      {/* ==================================================================== */}
      {isCreateOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/15">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#eed08e]">Compose Custom Atelier Order</h3>
              <button type="button" onClick={() => setIsCreateOrderOpen(false)} className="text-white/60 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCreateOrderOpen(false);
                triggerNotification("New order created and added to fulfillment queue.");
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-black/75 mb-1">Select Patron</label>
                <select className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white">
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-black/75 mb-1">Select Gift Suite</label>
                <select className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white">
                  <option>Elements in Harmony Marble Gift Box (₹3,499)</option>
                  <option>The Celebration Box (₹1,899)</option>
                  <option>Kurma MDF Keepsake Box (₹1,899)</option>
                  <option>Handcrafted Solid Brass Turtle Burner (₹1,250)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-black/75 mb-1">Custom Deckle-Edge Card Message</label>
                <textarea
                  rows={2}
                  placeholder="May this festive light illuminate your home sanctuary..."
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black/75 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Recipient"
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/75 mb-1">Payment Method</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white">
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Net Banking</option>
                    <option>Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-black/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-black/20 text-xs font-medium hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90"
                >
                  Confirm & Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* EDIT CUSTOMISE BOX MODAL (ONLY ADMIN CAN EDIT) */}
      {editingCustomBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#eed08e]/20 border border-[#eed08e]/30 flex items-center justify-center text-[#eed08e]">
                  <Pencil className="size-3.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#eed08e]">Edit Customise Box</h3>
                  <p className="text-[10px] text-white/60">ID: {editingCustomBox.id} • Admin Only Configuration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomBox(null)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCustomBox} className="p-5 space-y-4 text-xs overflow-y-auto">
              {/* Customer Step 1 Preview Card */}
              <div className="bg-[#FAF8F5] rounded-xl p-3 border border-black/10 flex items-center gap-3">
                <div className="relative size-16 rounded-lg overflow-hidden bg-white border border-black/10 shrink-0">
                  <Image src={editingCustomBox.image} alt={editingCustomBox.title} fill className="object-contain p-1" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#c89e43] tracking-wider block">Customer Step 1 Preview</span>
                  <h4 className="font-serif font-bold text-sm text-[#072515] truncate">{editingCustomBox.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-black/60">
                    <span>Size: {editingCustomBox.size}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800">{editingCustomBox.capacity} items max</span>
                    <span>•</span>
                    <span className="font-bold text-[#072515]">{formatINR(editingCustomBox.price)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black/80 mb-1">Trunk / Box Title</label>
                <input
                  type="text"
                  required
                  value={editingCustomBox.title}
                  onChange={(e) => setEditingCustomBox({ ...editingCustomBox, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editingCustomBox.size}
                    onChange={(e) => setEditingCustomBox({ ...editingCustomBox, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Slot Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={editingCustomBox.capacity}
                    onChange={(e) => setEditingCustomBox({ ...editingCustomBox, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                  <span className="text-[10px] text-black/45 mt-0.5 block">Max goodies allowed</span>
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={editingCustomBox.price}
                    onChange={(e) => setEditingCustomBox({ ...editingCustomBox, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                  <span className="text-[10px] text-black/45 mt-0.5 block">Empty box price</span>
                </div>
              </div>

              {/* Box Image Upload & Presets */}
              <div className="space-y-2">
                <label className="block font-semibold text-black/80">Box Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingCustomBox.image}
                    onChange={(e) => setEditingCustomBox({ ...editingCustomBox, image: e.target.value })}
                    placeholder="/images/product/mdf-box-clean.png or data URL"
                    className="flex-1 px-3 py-2 rounded-lg border border-black/20 outline-none text-[11px] font-mono focus:border-[#072515]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold cursor-pointer shrink-0">
                    <Upload className="size-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCustomBoxImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Chips */}
                <div>
                  <span className="text-[10px] text-black/50 block mb-1">Or choose an atelier packaging preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {BOX_IMAGE_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.url}
                        onClick={() => setEditingCustomBox({ ...editingCustomBox, image: p.url })}
                        className={`px-2 py-1 rounded-md text-[10px] border transition cursor-pointer ${
                          editingCustomBox.image === p.url
                            ? "bg-[#072515] text-[#eed08e] border-[#072515] font-bold"
                            : "bg-white text-black/70 border-black/15 hover:border-black/40"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black/80 mb-1">Editorial Description</label>
                <textarea
                  rows={2}
                  value={editingCustomBox.description}
                  onChange={(e) => setEditingCustomBox({ ...editingCustomBox, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none resize-none focus:border-[#072515]"
                />
              </div>

              {/* Storefront Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-semibold text-[#072515] block">Storefront Visibility</span>
                  <span className="text-[11px] text-stone-500">Patrons on /elements can view &amp; customize this packaging</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCustomBox.active !== false}
                    onChange={(e) => setEditingCustomBox({ ...editingCustomBox, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#072515]"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditingCustomBox(null)}
                  className="px-3.5 py-2 rounded-lg border border-black/15 font-medium hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] font-semibold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Save Box Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOMISE BOX MODAL (ADMIN ONLY) */}
      {isAddCustomBoxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#eed08e]/20 border border-[#eed08e]/30 flex items-center justify-center text-[#eed08e]">
                  <Plus className="size-4" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#eed08e]">Add New Bespoke Trunk</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustomBoxOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomBox} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-black/80 mb-1">Trunk / Box Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mysore Teakwood Casket"
                  value={newCustomBox.title}
                  onChange={(e) => setNewCustomBox({ ...newCustomBox, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="12 x 10 x 4 cm"
                    value={newCustomBox.size}
                    onChange={(e) => setNewCustomBox({ ...newCustomBox, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Slot Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newCustomBox.capacity}
                    onChange={(e) => setNewCustomBox({ ...newCustomBox, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={newCustomBox.price}
                    onChange={(e) => setNewCustomBox({ ...newCustomBox, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
              </div>

              {/* Image Selection & Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-black/80">Box Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCustomBox.image}
                    onChange={(e) => setNewCustomBox({ ...newCustomBox, image: e.target.value })}
                    placeholder="/images/product/mdf-box-clean.png or data URL"
                    className="flex-1 px-3 py-2 rounded-lg border border-black/20 outline-none text-[11px] font-mono focus:border-[#072515]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold cursor-pointer shrink-0">
                    <Upload className="size-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCustomBoxImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {BOX_IMAGE_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.url}
                      onClick={() => setNewCustomBox({ ...newCustomBox, image: p.url })}
                      className={`px-2 py-1 rounded-md text-[10px] border transition cursor-pointer ${
                        newCustomBox.image === p.url
                          ? "bg-[#072515] text-[#eed08e] border-[#072515] font-bold"
                          : "bg-white text-black/70 border-black/15 hover:border-black/40"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black/80 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the artisan wood craftsmanship, velvet bedding, or brass accents..."
                  value={newCustomBox.description}
                  onChange={(e) => setNewCustomBox({ ...newCustomBox, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none resize-none focus:border-[#072515]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsAddCustomBoxOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-black/15 font-medium hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] font-semibold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Create Bespoke Trunk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
