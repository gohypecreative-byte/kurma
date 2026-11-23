export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initials?: string;
  location: string;
  ordersCount: number;
  amountSpent: number;
  subscription: "Subscribed" | "Unsubscribed" | "Not subscribed";
  tier: "Patron" | "Sovereign VIP" | "Heritage Circle";
  lastOrderDate: string;
  memberSince?: string;
  notes?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: "cust-1",
    name: "Priyesh Sharma",
    email: "priyesh.sharma@kurmaluxury.com",
    phone: "+91 98201 44821",
    initials: "PS",
    location: "Mumbai, MH",
    ordersCount: 8,
    amountSpent: 28450,
    subscription: "Subscribed",
    tier: "Sovereign VIP",
    lastOrderDate: "Aug 04, 2026",
    memberSince: "Nov 2024",
    notes: "Prefers evening deliveries. Dedicated collector of Royal Mysore Chandan and Brass Turtle Incense Burners.",
    shippingAddress: {
      fullName: "Priyesh Sharma",
      phone: "+91 98201 44821",
      street: "702, Sea Green Enclave, Worli Sea Face",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400018",
      country: "India",
    },
  },
  {
    id: "cust-2",
    name: "Dr. Arvind Varma",
    email: "arvind.varma@heritagehealth.in",
    phone: "+91 94120 77301",
    initials: "AV",
    location: "Bengaluru, KA",
    ordersCount: 6,
    amountSpent: 24890,
    subscription: "Subscribed",
    tier: "Sovereign VIP",
    lastOrderDate: "Aug 04, 2026",
    memberSince: "Jan 2025",
    notes: "Frequently orders Marble Gift Box Suites for festive gifting to medical faculty.",
    shippingAddress: {
      fullName: "Dr. Arvind Varma",
      phone: "+91 94120 77301",
      street: "Villa 14, Palm Meadows, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560066",
      country: "India",
    },
  },
  {
    id: "cust-3",
    name: "Sunita Singhania",
    email: "sunita@singhaniaestates.com",
    phone: "+91 98110 52390",
    initials: "SS",
    location: "New Delhi, DL",
    ordersCount: 5,
    amountSpent: 38900,
    subscription: "Subscribed",
    tier: "Heritage Circle",
    lastOrderDate: "Aug 03, 2026",
    memberSince: "Sep 2024",
    notes: "Patron of bespoke gold-foil debossed chests with personalized deckle-edge wax-sealed notes.",
    shippingAddress: {
      fullName: "Sunita Singhania",
      phone: "+91 98110 52390",
      street: "32, Amrita Shergill Marg",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110003",
      country: "India",
    },
  },
  {
    id: "cust-4",
    name: "Kavita Reddy",
    email: "kavita.reddy@hyderabadtech.org",
    phone: "+91 97014 88312",
    initials: "KR",
    location: "Hyderabad, TS",
    ordersCount: 3,
    amountSpent: 9450,
    subscription: "Subscribed",
    tier: "Patron",
    lastOrderDate: "Aug 03, 2026",
    memberSince: "Mar 2025",
    notes: "Enjoys natural Agni and Jal elemental blends.",
    shippingAddress: {
      fullName: "Kavita Reddy",
      phone: "+91 97014 88312",
      street: "Road No. 45, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500033",
      country: "India",
    },
  },
  {
    id: "cust-5",
    name: "Mehul Parekh",
    email: "mehul.parekh@ahmedabadsilks.com",
    phone: "+91 98250 19348",
    initials: "MP",
    location: "Ahmedabad, GJ",
    ordersCount: 4,
    amountSpent: 14200,
    subscription: "Not subscribed",
    tier: "Patron",
    lastOrderDate: "Aug 02, 2026",
    memberSince: "Feb 2025",
    notes: "Bespoke packaging inquiries for festive corporate hampers.",
    shippingAddress: {
      fullName: "Mehul Parekh",
      phone: "+91 98250 19348",
      street: "8B, Shivalik High Street, Judges Bungalow Rd, Bodakdev",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380054",
      country: "India",
    },
  },
  {
    id: "cust-6",
    name: "Ananya Deshmukh",
    email: "ananya.d@mumbaiart.in",
    phone: "+91 98205 61129",
    initials: "AD",
    location: "Pune, MH",
    ordersCount: 2,
    amountSpent: 6890,
    subscription: "Subscribed",
    tier: "Patron",
    lastOrderDate: "Jul 28, 2026",
    memberSince: "Apr 2025",
    notes: "Prefers eco-friendly packaging and recyclable cotton ribbons.",
    shippingAddress: {
      fullName: "Ananya Deshmukh",
      phone: "+91 98205 61129",
      street: "Flat 402, Rohan Tarang, Wakad",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411057",
      country: "India",
    },
  },
];
