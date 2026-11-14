export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderFulfillmentStatus =
  | "Unfulfilled"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type OrderPaymentStatus = "Paid" | "Pending" | "Refunded";

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
  paymentMethod: "UPI" | "Card" | "Net Banking" | "Cash on Delivery" | string;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  channel: "Kurma Sanctuary" | "Direct Atelier" | "Corporate Concierge" | string;
  courier: string;
  awb: string;
  estimatedDate?: string;
  notes?: string;
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

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-1048",
    orderNumber: "#KURMA-1048",
    customerName: "Priyesh Sharma",
    customerEmail: "priyesh.sharma@kurmaluxury.com",
    customerPhone: "+91 98201 44821",
    city: "Mumbai, MH",
    date: "Aug 04 at 4:55 pm",
    boxTitle: "The Celebration Box",
    boxImage: "/images/product/suite-clean.png",
    itemsCount: 4,
    items: [
      {
        sku: "mysore-chandan",
        name: "Royal Mysore Chandan Incense",
        quantity: 2,
        price: 650,
        image: "/images/product/earth-front.png",
      },
      {
        sku: "brass-turtle",
        name: "Solid Brass Turtle Burner",
        quantity: 1,
        price: 1250,
        image: "/images/product/turtle-holder-clean.png",
      },
      {
        sku: "scent-water",
        name: "Water (Jal) Luxury Scent Sticks",
        quantity: 1,
        price: 550,
        image: "/images/product/water-front.png",
      },
    ],
    totalAmount: 3840,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    channel: "Kurma Sanctuary",
    courier: "BlueDart Express",
    awb: "BLU-8842-MUM",
    estimatedDate: "16 Nov 2026 (Before 4:00 PM)",
    notes: "Consignment dispatched from Kurma Central Atelier, Mumbai Hub.",
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
      {
        sku: "pancha-5-elements",
        name: "5 Elements Luxury Incense Suite",
        quantity: 1,
        price: 2890,
        image: "/images/product/marble-box-clean.png",
      },
      {
        sku: "brass-tortoise-deluxe",
        name: "Cast Brass Turtle Stand",
        quantity: 1,
        price: 1450,
        image: "/images/product/turtle-holder-clean.png",
      },
    ],
    totalAmount: 4340,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    fulfillmentStatus: "Out for Delivery",
    channel: "Direct Atelier",
    courier: "Delhivery Surface",
    awb: "DEL-4109-BLR",
    estimatedDate: "Today (By 7:00 PM)",
    notes: "Out for delivery with rider (Devendra K).",
    personalization: {
      recipientName: "Dr. & Mrs. Varma",
      senderName: "Varma Healthcare Board",
      giftNote: "In deep appreciation of your visionary healing leadership.",
      greetingCard: true,
      monogram: "Dr. A. Varma",
    },
  },
  {
    id: "ord-1046",
    orderNumber: "#KURMA-1046",
    customerName: "Sunita Singhania",
    customerEmail: "sunita@singhaniaestates.com",
    customerPhone: "+91 98112 00921",
    city: "New Delhi, DL",
    date: "Aug 04 at 2:10 pm",
    boxTitle: "MDF Slatted Trunk with Custom Brass Seal",
    boxImage: "/images/product/mdf-box-clean.png",
    itemsCount: 3,
    items: [
      {
        sku: "custom-trunk-large",
        name: "Grand Slatted Trunk (Emerald)",
        quantity: 1,
        price: 3200,
        image: "/images/product/mdf-box-clean.png",
      },
      {
        sku: "brass-seal",
        name: "Engraved Brass Insignia Seal",
        quantity: 1,
        price: 950,
        image: "/images/product/medallion-clean.png",
      },
    ],
    totalAmount: 4150,
    paymentMethod: "Net Banking",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    channel: "Corporate Concierge",
    courier: "BlueDart Express",
    awb: "BLU-9921-DEL",
    estimatedDate: "Delivered on 04 Aug 2026",
    notes: "Consignment successfully delivered and signed by patron.",
    personalization: {
      recipientName: "Singhania Family",
      senderName: "Atelier Kurma Concierge",
      giftNote: "With warm greetings from the sacred hills of Uttarakhand.",
      greetingCard: true,
      monogram: "Singhania • 2026",
    },
  },
  {
    id: "ord-1045",
    orderNumber: "#KURMA-1045",
    customerName: "Kavita Reddy",
    customerEmail: "kavita.reddy@hyderabadtech.org",
    customerPhone: "+91 97010 33812",
    city: "Hyderabad, TS",
    date: "Aug 04 at 11:20 am",
    boxTitle: "Sacred Elemental Incense Assortment",
    boxImage: "/images/product/five-boxes-3d.png",
    itemsCount: 2,
    items: [
      {
        sku: "water-fire-duo",
        name: "Water & Fire Fragrance Duo",
        quantity: 2,
        price: 890,
        image: "/images/product/water-front.png",
      },
    ],
    totalAmount: 1780,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    channel: "Kurma Sanctuary",
    courier: "Delhivery Air",
    awb: "DEL-7731-HYD",
    estimatedDate: "17 Nov 2026",
    notes: "Being handcrafted and blessed in Kurma atelier packaging room.",
    personalization: {
      recipientName: "Kavita Reddy",
      senderName: "Self Order",
      giftNote: "",
      greetingCard: false,
    },
  },
  {
    id: "ord-1044",
    orderNumber: "#KURMA-1044",
    customerName: "Mehul Parekh",
    customerEmail: "mehul.parekh@ahmedabadsilks.com",
    customerPhone: "+91 98980 12345",
    city: "Ahmedabad, GJ",
    date: "Aug 03 at 7:15 pm",
    boxTitle: "Executive Heritage Hamper",
    boxImage: "/images/product/image.png",
    itemsCount: 6,
    items: [
      {
        sku: "pure-dhoop",
        name: "Organic Botanical Dhoop Cones",
        quantity: 4,
        price: 450,
        image: "/images/product/image.png",
      },
      {
        sku: "brass-diya",
        name: "Artisan Moradabad Oil Diya",
        quantity: 2,
        price: 800,
        image: "/images/product/turtle-holder-clean.png",
      },
    ],
    totalAmount: 3400,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    fulfillmentStatus: "Confirmed",
    channel: "Kurma Sanctuary",
    courier: "BlueDart Express",
    awb: "BLU-5521-AMD",
    estimatedDate: "18 Nov 2026",
    notes: "Order confirmed by patron. Ready for artisanal assembly.",
    personalization: {
      recipientName: "Mehul & Anita",
      senderName: "Parekh Textiles",
      giftNote: "Wishing our team tranquility and prosperity.",
      greetingCard: true,
      monogram: "Parekh • Shanti",
    },
  },
];

export interface TrackingStep {
  title: string;
  description: string;
  date?: string;
  status: "completed" | "current" | "upcoming";
}

export function computeOrderTrackingTimeline(order: AdminOrder): TrackingStep[] {
  const status = (order.fulfillmentStatus || "Processing").toLowerCase();

  const isConfirmed =
    status === "confirmed" ||
    status === "processing" ||
    status === "shipped" ||
    status === "out for delivery" ||
    status === "delivered";

  const isProcessing =
    status === "processing" ||
    status === "shipped" ||
    status === "out for delivery" ||
    status === "delivered";

  const isShipped =
    status === "shipped" ||
    status === "out for delivery" ||
    status === "delivered";

  const isOutForDelivery =
    status === "out for delivery" || status === "delivered";

  const isDelivered = status === "delivered";

  return [
    {
      title: "Order Placed & Payment Verified",
      description: `Payment received via ${order.paymentMethod} (${order.paymentStatus}). Order logged in Atelier system.`,
      date: order.date,
      status: "completed",
    },
    {
      title: "Consignment Confirmed & Chiseled",
      description: order.personalization?.monogram
        ? `Custom monogram "${order.personalization.monogram}" verified by Kurma artisans.`
        : "Order verified for botanical purity and sacred packaging.",
      date: order.date,
      status: isConfirmed ? "completed" : "current",
    },
    {
      title: "Crafting & Packing in Atelier",
      description: "Charcoal-free incense suites hand-inspected and sealed in tamper-proof silk wrap.",
      date: isProcessing ? "In Progress" : undefined,
      status: isProcessing
        ? (isShipped ? "completed" : "current")
        : (isConfirmed ? "upcoming" : "upcoming"),
    },
    {
      title: `Dispatched via ${order.courier || "Express Carrier"}`,
      description: order.awb
        ? `Air Waybill: ${order.awb}. Consignment handed over for insured priority transit.`
        : "Courier consignment generation in progress.",
      date: order.awb ? (isShipped ? "Dispatched" : undefined) : undefined,
      status: isShipped
        ? (isOutForDelivery ? "completed" : "current")
        : (isProcessing ? "upcoming" : "upcoming"),
    },
    {
      title: "Out for Final Delivery",
      description: `Dispatched with local courier courier in ${order.city || "your destination"}.`,
      date: order.estimatedDate || "Estimated: 2-4 days",
      status: isOutForDelivery
        ? (isDelivered ? "completed" : "current")
        : "upcoming",
    },
    {
      title: "Delivered to Sanctuary",
      description: "Package delivered safely into patron hands. May sacred aromas bless your space.",
      date: isDelivered ? (order.estimatedDate || "Delivered") : undefined,
      status: isDelivered ? "completed" : "upcoming",
    },
  ];
}

export function cleanOrderNumber(input: string): string {
  return input.trim().replace(/^#+/, "").trim();
}

