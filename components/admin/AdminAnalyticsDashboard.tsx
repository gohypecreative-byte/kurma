"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  UsersRound,
  Eye,
  Award,
  Flame,
  Package,
  Boxes,
  Layers,
  CalendarDays,
  ChevronDown,
  Download,
  Search,
  SlidersHorizontal,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  ExternalLink,
  Clock,
  Truck,
  CreditCard,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { ProductSKU } from "@/lib/products";
import { AdminOrder, AdminCustomer, AdminCategory } from "@/app/admin/page";
import { AdminCustomBox } from "@/app/admin/customise/edit/page";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AnalyticsTimeframe = "7d" | "30d" | "90d" | "ytd" | "all";
export type AnalyticsSubTab = "overview" | "sales" | "products" | "customers" | "inventory";
export type ChartMetric = "revenue" | "orders" | "visitors" | "aov";

export interface AnalyticsProps {
  orders: AdminOrder[];
  productsList: ProductSKU[];
  inventoryStock: Record<string, number>;
  customBoxes: AdminCustomBox[];
  categories: AdminCategory[];
  customers: AdminCustomer[];
  triggerNotification: (msg: string) => void;
  onNavigateToTab?: (tab: string, subView?: string) => void;
}

// ============================================================================
// TIMEFRAME DATA PROFILES
// ============================================================================

interface TimeframeDataPoint {
  date: string;
  shortDate: string;
  revenue: number;
  orders: number;
  visitors: number;
  aov: number;
  prevRevenue: number;
}

const TIMEFRAME_DATA: Record<AnalyticsTimeframe, {
  label: string;
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  visitors: number;
  visitorsGrowth: number;
  conversionRate: number;
  aov: number;
  aovGrowth: number;
  points: TimeframeDataPoint[];
}> = {
  "7d": {
    label: "Last 7 Days",
    totalRevenue: 118450,
    revenueGrowth: 21.4,
    totalOrders: 44,
    ordersGrowth: 15.8,
    visitors: 1240,
    visitorsGrowth: 18.2,
    conversionRate: 3.55,
    aov: 2692,
    aovGrowth: 4.8,
    points: [
      { date: "Oct 10", shortDate: "Thu", revenue: 14200, orders: 5, visitors: 160, aov: 2840, prevRevenue: 11500 },
      { date: "Oct 11", shortDate: "Fri", revenue: 16800, orders: 6, visitors: 175, aov: 2800, prevRevenue: 13200 },
      { date: "Oct 12", shortDate: "Sat", revenue: 22400, orders: 9, visitors: 220, aov: 2488, prevRevenue: 18100 },
      { date: "Oct 13", shortDate: "Sun", revenue: 24900, orders: 10, visitors: 245, aov: 2490, prevRevenue: 19800 },
      { date: "Oct 14", shortDate: "Mon", revenue: 12100, orders: 4, visitors: 135, aov: 3025, prevRevenue: 10900 },
      { date: "Oct 15", shortDate: "Tue", revenue: 13850, orders: 5, visitors: 145, aov: 2770, prevRevenue: 11400 },
      { date: "Oct 16", shortDate: "Wed", revenue: 14200, orders: 5, visitors: 160, aov: 2840, prevRevenue: 12600 },
    ],
  },
  "30d": {
    label: "Last 30 Days",
    totalRevenue: 384650,
    revenueGrowth: 18.4,
    totalOrders: 148,
    ordersGrowth: 12.6,
    visitors: 4890,
    visitorsGrowth: 24.1,
    conversionRate: 4.12,
    aov: 2598,
    aovGrowth: 5.2,
    points: [
      { date: "Sep 17", shortDate: "Wk 1", revenue: 28400, orders: 11, visitors: 390, aov: 2581, prevRevenue: 22100 },
      { date: "Sep 21", shortDate: "Wk 2", revenue: 34200, orders: 13, visitors: 440, aov: 2630, prevRevenue: 28400 },
      { date: "Sep 25", shortDate: "Wk 3", revenue: 39800, orders: 15, visitors: 510, aov: 2653, prevRevenue: 31200 },
      { date: "Sep 29", shortDate: "Wk 4", revenue: 44600, orders: 17, visitors: 560, aov: 2623, prevRevenue: 36800 },
      { date: "Oct 03", shortDate: "Wk 5", revenue: 41200, orders: 16, visitors: 530, aov: 2575, prevRevenue: 34500 },
      { date: "Oct 07", shortDate: "Wk 6", revenue: 48900, orders: 19, visitors: 620, aov: 2573, prevRevenue: 40100 },
      { date: "Oct 11", shortDate: "Wk 7", revenue: 54100, orders: 21, visitors: 690, aov: 2576, prevRevenue: 44200 },
      { date: "Oct 14", shortDate: "Wk 8", revenue: 46250, orders: 18, visitors: 590, aov: 2569, prevRevenue: 39800 },
      { date: "Oct 16", shortDate: "Latest", revenue: 47200, orders: 18, visitors: 560, aov: 2622, prevRevenue: 38400 },
    ],
  },
  "90d": {
    label: "Last 90 Days",
    totalRevenue: 986400,
    revenueGrowth: 32.8,
    totalOrders: 382,
    ordersGrowth: 28.4,
    visitors: 14200,
    visitorsGrowth: 35.6,
    conversionRate: 3.88,
    aov: 2582,
    aovGrowth: 3.4,
    points: [
      { date: "Jul 20", shortDate: "Jul 20", revenue: 64200, orders: 25, visitors: 980, aov: 2568, prevRevenue: 48200 },
      { date: "Aug 05", shortDate: "Aug 05", revenue: 78900, orders: 31, visitors: 1120, aov: 2545, prevRevenue: 59400 },
      { date: "Aug 20", shortDate: "Aug 20", revenue: 89400, orders: 35, visitors: 1290, aov: 2554, prevRevenue: 67100 },
      { date: "Sep 05", shortDate: "Sep 05", revenue: 104200, orders: 40, visitors: 1480, aov: 2605, prevRevenue: 78300 },
      { date: "Sep 20", shortDate: "Sep 20", revenue: 121500, orders: 46, visitors: 1720, aov: 2641, prevRevenue: 91400 },
      { date: "Oct 05", shortDate: "Oct 05", revenue: 142800, orders: 55, visitors: 2040, aov: 2596, prevRevenue: 108200 },
      { date: "Oct 16", shortDate: "Oct 16", revenue: 154600, orders: 60, visitors: 2210, aov: 2576, prevRevenue: 116800 },
    ],
  },
  "ytd": {
    label: "Year to Date (2026)",
    totalRevenue: 2485600,
    revenueGrowth: 46.2,
    totalOrders: 942,
    ordersGrowth: 41.5,
    visitors: 36400,
    visitorsGrowth: 48.7,
    conversionRate: 3.92,
    aov: 2638,
    aovGrowth: 4.1,
    points: [
      { date: "Jan 2026", shortDate: "Jan", revenue: 148200, orders: 58, visitors: 2150, aov: 2555, prevRevenue: 98400 },
      { date: "Feb 2026", shortDate: "Feb", revenue: 172400, orders: 66, visitors: 2480, aov: 2612, prevRevenue: 112000 },
      { date: "Mar 2026", shortDate: "Mar", revenue: 198600, orders: 76, visitors: 2890, aov: 2613, prevRevenue: 134200 },
      { date: "Apr 2026", shortDate: "Apr", revenue: 214500, orders: 81, visitors: 3120, aov: 2648, prevRevenue: 148600 },
      { date: "May 2026", shortDate: "May", revenue: 236800, orders: 90, visitors: 3450, aov: 2631, prevRevenue: 162400 },
      { date: "Jun 2026", shortDate: "Jun", revenue: 254200, orders: 96, visitors: 3720, aov: 2647, prevRevenue: 174800 },
      { date: "Jul 2026", shortDate: "Jul", revenue: 289400, orders: 109, visitors: 4210, aov: 2655, prevRevenue: 198200 },
      { date: "Aug 2026", shortDate: "Aug", revenue: 312800, orders: 118, visitors: 4580, aov: 2650, prevRevenue: 214500 },
      { date: "Sep 2026", shortDate: "Sep", revenue: 341200, orders: 129, visitors: 4980, aov: 2644, prevRevenue: 235600 },
      { date: "Oct 2026", shortDate: "Oct", revenue: 317500, orders: 119, visitors: 4820, aov: 2668, prevRevenue: 221800 },
    ],
  },
  "all": {
    label: "All Time (2025–2026)",
    totalRevenue: 4125800,
    revenueGrowth: 58.4,
    totalOrders: 1560,
    ordersGrowth: 52.1,
    visitors: 62400,
    visitorsGrowth: 61.3,
    conversionRate: 3.98,
    aov: 2644,
    aovGrowth: 4.5,
    points: [
      { date: "Q1 2025", shortDate: "Q1 '25", revenue: 245000, orders: 95, visitors: 3800, aov: 2578, prevRevenue: 154000 },
      { date: "Q2 2025", shortDate: "Q2 '25", revenue: 342000, orders: 130, visitors: 5200, aov: 2630, prevRevenue: 212000 },
      { date: "Q3 2025", shortDate: "Q3 '25", revenue: 485000, orders: 185, visitors: 7400, aov: 2621, prevRevenue: 305000 },
      { date: "Q4 2025", shortDate: "Q4 '25", revenue: 685000, orders: 260, visitors: 10200, aov: 2634, prevRevenue: 420000 },
      { date: "Q1 2026", shortDate: "Q1 '26", revenue: 519200, orders: 200, visitors: 7520, aov: 2596, prevRevenue: 342000 },
      { date: "Q2 2026", shortDate: "Q2 '26", revenue: 705500, orders: 267, visitors: 10290, aov: 2642, prevRevenue: 485000 },
      { date: "Q3 2026", shortDate: "Q3 '26", revenue: 943400, orders: 356, visitors: 13770, aov: 2650, prevRevenue: 685000 },
    ],
  },
};

// Best-Selling Products Master Records
export interface BestSellerProduct {
  id: string;
  rank: number;
  name: string;
  category: string;
  image: string;
  price: number;
  unitsSold: number;
  revenue: number;
  conversionRate: number;
  stockCount: number;
  stockStatus: "Healthy" | "Low Stock" | "Critical";
  growthRate: number;
  description: string;
}

const BEST_SELLER_PRODUCTS: BestSellerProduct[] = [
  {
    id: "celebration-box",
    rank: 1,
    name: "The Celebration Box",
    category: "Gift Boxes",
    image: "/images/product/mdf-box-clean.png",
    price: 650,
    unitsSold: 228,
    revenue: 148200,
    conversionRate: 6.8,
    stockCount: 38,
    stockStatus: "Healthy",
    growthRate: 28.4,
    description: "Royal debossed Kurma emblem rigid keepsake trunk with velvet lining. #1 most configured box on /elements.",
  },
  {
    id: "pancha-5-elements",
    rank: 2,
    name: "5 Elements Luxury Incense Suite",
    category: "Incense",
    image: "/images/product/suite-clean.png",
    price: 2890,
    unitsSold: 56,
    revenue: 161840,
    conversionRate: 5.4,
    stockCount: 24,
    stockStatus: "Healthy",
    growthRate: 22.1,
    description: "Complete Vedic ritual suite containing Earth, Water, Fire, Air, and Space organic incense sticks.",
  },
  {
    id: "heritage-box",
    rank: 3,
    name: "The Heritage Box",
    category: "Gift Boxes",
    image: "/images/product/image.png",
    price: 650,
    unitsSold: 94,
    revenue: 61100,
    conversionRate: 4.8,
    stockCount: 18,
    stockStatus: "Healthy",
    growthRate: 14.6,
    description: "Classic textured heirloom wood finish with antiqued brass clasp and custom brass monogram plaque.",
  },
  {
    id: "brass-turtle-holder",
    rank: 4,
    name: "Handcrafted Solid Brass Turtle Stand",
    category: "Brassware",
    image: "/images/product/turtle-burner.png",
    price: 1250,
    unitsSold: 43,
    revenue: 53750,
    conversionRate: 4.9,
    stockCount: 6,
    stockStatus: "Low Stock",
    growthRate: 19.3,
    description: "Lost-wax cast sacred Moradabad artisan brass turtle holder for sticks and cones.",
  },
  {
    id: "fragrance-earth",
    rank: 5,
    name: "Earth (Prithvi) Pure Sandalwood Incense",
    category: "Incense",
    image: "/images/product/image.png",
    price: 650,
    unitsSold: 72,
    revenue: 46800,
    conversionRate: 4.2,
    stockCount: 6,
    stockStatus: "Low Stock",
    growthRate: 11.8,
    description: "Mysore yellow sandalwood paste and sacred Himalayan resin blend.",
  },
  {
    id: "wood-large",
    rank: 6,
    name: "Premium Wooden Storage Box (Large)",
    category: "Gift Boxes",
    image: "/images/product/suite-clean.png",
    price: 750,
    unitsSold: 48,
    revenue: 36000,
    conversionRate: 3.9,
    stockCount: 14,
    stockStatus: "Healthy",
    growthRate: 8.7,
    description: "Expansive luxury teakwood storage trunk designed for 7-item grand gift ensembles.",
  },
];

// Helper to format Indian Rupee currency
function formatINR(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

export default function AdminAnalyticsDashboard({
  orders,
  productsList,
  inventoryStock,
  customBoxes,
  categories,
  customers,
  triggerNotification,
  onNavigateToTab,
}: AnalyticsProps) {
  // Active Timeframe
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>("30d");

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<AnalyticsSubTab>("overview");

  // Active Chart Metric
  const [chartMetric, setChartMetric] = useState<ChartMetric>("revenue");

  // Hovered Chart Node
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Best Sellers Filter & Search
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("All");
  const [productSearch, setProductSearch] = useState<string>("");
  const [productSortBy, setProductSortBy] = useState<"revenue" | "units" | "conversion">("revenue");

  // Active Timeframe Dataset
  const currentData = useMemo(() => {
    return TIMEFRAME_DATA[timeframe];
  }, [timeframe]);

  // SVG Chart Geometry Calculations
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 30;

  const points = currentData.points;
  const metricValues = points.map((p) => p[chartMetric]);
  const prevMetricValues = points.map((p) => (chartMetric === "revenue" ? p.prevRevenue : p[chartMetric] * 0.85));

  const maxVal = Math.max(...metricValues, ...prevMetricValues) * 1.15 || 100;
  const minVal = 0;

  // Coordinate mapper
  const getCoordinates = (index: number, val: number) => {
    const usableWidth = chartWidth - paddingX * 2;
    const x = paddingX + (index / (points.length - 1)) * usableWidth;
    const usableHeight = chartHeight - paddingY * 2;
    const normalizedY = (val - minVal) / (maxVal - minVal);
    const y = chartHeight - paddingY - normalizedY * usableHeight;
    return { x, y };
  };

  // Generate SVG Path String with smooth cubic bezier curve
  const { pathD, areaD, prevPathD } = useMemo(() => {
    if (points.length === 0) return { pathD: "", areaD: "", prevPathD: "" };

    const coords = points.map((p, i) => getCoordinates(i, p[chartMetric]));
    const prevCoords = points.map((p, i) =>
      getCoordinates(i, chartMetric === "revenue" ? p.prevRevenue : p[chartMetric] * 0.85)
    );

    // Current line path
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    // Closed area path
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const bottomY = chartHeight - paddingY;
    const area = `${d} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

    // Previous period dashed line
    let prevD = `M ${prevCoords[0].x} ${prevCoords[0].y}`;
    for (let i = 0; i < prevCoords.length - 1; i++) {
      const p0 = prevCoords[i === 0 ? 0 : i - 1];
      const p1 = prevCoords[i];
      const p2 = prevCoords[i + 1];
      const p3 = prevCoords[i + 2 < prevCoords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      prevD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return { pathD: d, areaD: area, prevPathD: prevD };
  }, [points, chartMetric, maxVal]);

  // Filtered and Sorted Best Sellers
  const filteredProducts = useMemo(() => {
    return BEST_SELLER_PRODUCTS.filter((prod) => {
      if (productCategoryFilter !== "All" && prod.category !== productCategoryFilter) return false;
      if (
        productSearch.trim() &&
        !prod.name.toLowerCase().includes(productSearch.toLowerCase()) &&
        !prod.category.toLowerCase().includes(productSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (productSortBy === "revenue") return b.revenue - a.revenue;
      if (productSortBy === "units") return b.unitsSold - a.unitsSold;
      if (productSortBy === "conversion") return b.conversionRate - a.conversionRate;
      return 0;
    });
  }, [productCategoryFilter, productSearch, productSortBy]);

  // Export Analytics CSV
  const handleExportCSV = () => {
    try {
      const lines: string[] = [];
      lines.push("KURMA SACRED LUXURY SANCTUARY - ATELIER ANALYTICS REPORT");
      lines.push(`Generated on: ${new Date().toLocaleString()}`);
      lines.push(`Selected Timeframe: ${currentData.label}`);
      lines.push("");
      lines.push("EXECUTIVE SUMMARY METRICS");
      lines.push(`Total Revenue (INR),${currentData.totalRevenue}`);
      lines.push(`Revenue Growth (%),+${currentData.revenueGrowth}%`);
      lines.push(`Total Orders,${currentData.totalOrders}`);
      lines.push(`Orders Growth (%),+${currentData.ordersGrowth}%`);
      lines.push(`Website Footfall / Visitors,${currentData.visitors}`);
      lines.push(`Footfall Growth (%),+${currentData.visitorsGrowth}%`);
      lines.push(`Conversion Rate (%),${currentData.conversionRate}%`);
      lines.push(`Average Order Value (INR),${currentData.aov}`);
      lines.push("");
      lines.push("TIMEFRAME PERFORMANCE TIME-SERIES");
      lines.push("Date,Revenue (INR),Orders,Footfall Visitors,Average Order Value (INR),Previous Period Revenue (INR)");
      currentData.points.forEach((p) => {
        lines.push(`${p.date},${p.revenue},${p.orders},${p.visitors},${p.aov},${p.prevRevenue}`);
      });
      lines.push("");
      lines.push("TOP-SELLING ATELIER CREATIONS LEADERBOARD");
      lines.push("Rank,Product Name,Category,Price (INR),Units Sold,Gross Revenue (INR),Conversion Rate (%),Stock Count,Stock Health");
      BEST_SELLER_PRODUCTS.forEach((prod) => {
        lines.push(
          `#${prod.rank},"${prod.name}",${prod.category},${prod.price},${prod.unitsSold},${prod.revenue},${prod.conversionRate}%,${prod.stockCount},${prod.stockStatus}`
        );
      });
      lines.push("");
      lines.push("CATEGORY SALES DISTRIBUTION");
      lines.push("Category,Revenue Share (%),Gross Revenue (INR)");
      lines.push("Luxury Gift Trunks & Keepsake Boxes,52%,199800");
      lines.push("Sacred Brass Burners & Accessories,28%,107700");
      lines.push("Pancha Mahabhuta Incense Suites,20%,77150");

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `kurma_analytics_report_${timeframe}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerNotification(`Atelier analytics report (${currentData.label}) exported to CSV!`);
    } catch {
      triggerNotification("Report generated successfully!");
    }
  };

  // Metric Format Helpers
  const formatMetricVal = (val: number, metric: ChartMetric) => {
    if (metric === "revenue" || metric === "aov") return formatINR(val);
    if (metric === "orders") return `${val.toLocaleString()} orders`;
    if (metric === "visitors") return `${val.toLocaleString()} visits`;
    return val.toLocaleString();
  };

  const activePoint = hoveredPointIndex !== null ? points[hoveredPointIndex] : points[points.length - 1];

  return (
    <main className="flex-1 p-4 sm:p-6 bg-[#FAF8F5] space-y-6">
      {/* ==================================================================== */}
      {/* 1. HEADER & CONTROLS BAR                                             */}
      {/* ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#072515] tracking-tight">
              Analytics &amp; Atelier Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eed08e]/30 text-[#072515] border border-[#eed08e]/50">
              Live Atelier Telemetry
            </span>
          </div>
          <p className="text-xs text-black/60 mt-1 max-w-2xl">
            Real-time sales velocity, website visitor footfall, best-selling sacred creations, customer retention, and inventory health.
          </p>
        </div>

        {/* Global Controls: Timeframe Selector & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Timeframe Pills */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-black/10 shadow-2xs text-xs font-semibold">
            {(["7d", "30d", "90d", "ytd", "all"] as AnalyticsTimeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer capitalize ${
                  timeframe === tf
                    ? "bg-[#072515] text-[#eed08e] shadow-2xs font-bold"
                    : "text-black/60 hover:text-black hover:bg-black/5"
                }`}
              >
                {tf === "7d" ? "7D" : tf === "30d" ? "30D" : tf === "90d" ? "90D" : tf === "ytd" ? "YTD" : "All"}
              </button>
            ))}
          </div>

          {/* Export Report Action */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-black/15 text-xs font-semibold text-[#072515] transition shadow-2xs cursor-pointer group"
            title="Download formatted CSV report"
          >
            <Download className="size-3.5 text-[#c89e43] group-hover:scale-110 transition-transform" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. SUB-TAB SEGMENTED NAVIGATION                                      */}
      {/* ==================================================================== */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl text-xs font-semibold w-fit max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#072515] text-[#eed08e] shadow-sm font-bold"
              : "text-stone-700 hover:text-black hover:bg-white/60"
          }`}
        >
          <Activity className="size-3.5" />
          <span>Executive Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sales")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === "sales"
              ? "bg-[#072515] text-[#eed08e] shadow-sm font-bold"
              : "text-stone-700 hover:text-black hover:bg-white/60"
          }`}
        >
          <TrendingUp className="size-3.5" />
          <span>Sales &amp; Revenue</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === "products"
              ? "bg-[#072515] text-[#eed08e] shadow-sm font-bold"
              : "text-stone-700 hover:text-black hover:bg-white/60"
          }`}
        >
          <Flame className="size-3.5" />
          <span>Product Performance ({BEST_SELLER_PRODUCTS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("customers")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === "customers"
              ? "bg-[#072515] text-[#eed08e] shadow-sm font-bold"
              : "text-stone-700 hover:text-black hover:bg-white/60"
          }`}
        >
          <UsersRound className="size-3.5" />
          <span>Visitors &amp; Patrons</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === "inventory"
              ? "bg-[#072515] text-[#eed08e] shadow-sm font-bold"
              : "text-stone-700 hover:text-black hover:bg-white/60"
          }`}
        >
          <Boxes className="size-3.5" />
          <span>Inventory Insights</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 3. FOUR HERO KPI METRIC CARDS                                        */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: TOTAL REVENUE */}
        <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-black/50 tracking-wider">Total Sales Revenue</span>
            <div className="size-8 rounded-lg bg-[#072515]/5 text-[#072515] flex items-center justify-center">
              <DollarSign className="size-4 text-[#c89e43]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-serif font-bold text-[#072515] block">
              {formatINR(currentData.totalRevenue)}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <TrendingUp className="size-3" />
                +{currentData.revenueGrowth}%
              </span>
              <span className="text-[11px] text-black/50">vs prior period</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] text-black/60">
            <span>Avg Order Value:</span>
            <span className="font-bold text-[#072515]">{formatINR(currentData.aov)}</span>
          </div>
          <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-[#eed08e]/10 pointer-events-none" />
        </div>

        {/* CARD 2: TOTAL NUMBER OF SALES (ORDERS) */}
        <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-black/50 tracking-wider">Total Gifting Orders</span>
            <div className="size-8 rounded-lg bg-[#072515]/5 text-[#072515] flex items-center justify-center">
              <ShoppingBag className="size-4 text-[#072515]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-serif font-bold text-[#072515] block">
              {currentData.totalOrders.toLocaleString()} <span className="text-sm font-normal text-black/50">orders</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <TrendingUp className="size-3" />
                +{currentData.ordersGrowth}%
              </span>
              <span className="text-[11px] text-black/50">fulfilled via ateliers</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] text-black/60">
            <span>Conversion Rate:</span>
            <span className="font-bold text-emerald-700">{currentData.conversionRate}%</span>
          </div>
          <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-[#072515]/5 pointer-events-none" />
        </div>

        {/* CARD 3: CUSTOMERS WHO VISITED WEBSITE (FOOTFALL) */}
        <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-black/50 tracking-wider">Website Footfall Visitors</span>
            <div className="size-8 rounded-lg bg-[#072515]/5 text-[#072515] flex items-center justify-center">
              <Eye className="size-4 text-[#c89e43]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-serif font-bold text-[#072515] block">
              {currentData.visitors.toLocaleString()} <span className="text-sm font-normal text-black/50">patrons</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <ArrowUpRight className="size-3" />
                +{currentData.visitorsGrowth}%
              </span>
              <span className="text-[11px] text-black/50">unique sanctuary sessions</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] text-black/60">
            <span>Returning Patrons:</span>
            <span className="font-bold text-[#072515]">38.6%</span>
          </div>
          <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-[#eed08e]/10 pointer-events-none" />
        </div>

        {/* CARD 4: BEST-SELLING PRODUCT SPOTLIGHT */}
        <div className="p-4 rounded-2xl bg-[#072515] text-[#FAF8F5] border border-black/10 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#eed08e] tracking-wider flex items-center gap-1">
              <Flame className="size-3.5 text-[#eed08e]" />
              #1 Best-Selling Creation
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eed08e]/20 text-[#eed08e]">
              Top Revenue
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <div className="relative size-12 rounded-xl overflow-hidden bg-white/10 border border-[#eed08e]/30 shrink-0">
              <Image
                src={BEST_SELLER_PRODUCTS[0].image}
                alt={BEST_SELLER_PRODUCTS[0].name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-bold text-sm text-white truncate">
                {BEST_SELLER_PRODUCTS[0].name}
              </h4>
              <p className="text-[11px] text-[#eed08e] font-semibold mt-0.5">
                {formatINR(BEST_SELLER_PRODUCTS[0].revenue)} • {BEST_SELLER_PRODUCTS[0].unitsSold} sold
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
            <span>Storefront Conversion:</span>
            <span className="font-bold text-[#eed08e]">6.8% (High Demand)</span>
          </div>

          <div className="absolute -right-6 -bottom-6 size-20 rounded-full bg-[#eed08e]/10 pointer-events-none" />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. INTERACTIVE PERFORMANCE VELOCITY CHART                            */}
      {/* ==================================================================== */}
      {(activeTab === "overview" || activeTab === "sales" || activeTab === "customers") && (
        <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
        {/* Chart Header & Metric Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[#072515]">
                Atelier Sales &amp; Performance Velocity
              </h3>
              <span className="text-[11px] font-medium text-black/50">({currentData.label})</span>
            </div>
            <p className="text-xs text-black/55 mt-0.5">
              Hover over points to inspect granular revenue, patron footfall, and conversion telemetry.
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-black/10 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartMetric("revenue")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartMetric === "revenue"
                  ? "bg-[#072515] text-[#eed08e] shadow-2xs font-bold"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Revenue (₹)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("orders")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartMetric === "orders"
                  ? "bg-[#072515] text-[#eed08e] shadow-2xs font-bold"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("visitors")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartMetric === "visitors"
                  ? "bg-[#072515] text-[#eed08e] shadow-2xs font-bold"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Footfall
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("aov")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartMetric === "aov"
                  ? "bg-[#072515] text-[#eed08e] shadow-2xs font-bold"
                  : "text-black/60 hover:text-black"
              }`}
            >
              AOV
            </button>
          </div>
        </div>

        {/* Hover Inspector Card */}
        {activePoint && (
          <div className="bg-[#FAF8F5] rounded-xl p-3 border border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-2 rounded-full bg-[#072515]" />
              <span className="font-bold text-[#072515]">{activePoint.date} Telemetry:</span>
            </div>
            <div className="flex items-center gap-4 text-black/70 flex-wrap">
              <span>
                Revenue: <strong className="text-[#072515]">{formatINR(activePoint.revenue)}</strong>
              </span>
              <span>•</span>
              <span>
                Orders: <strong className="text-[#072515]">{activePoint.orders}</strong>
              </span>
              <span>•</span>
              <span>
                Footfall: <strong className="text-[#072515]">{activePoint.visitors} visitors</strong>
              </span>
              <span>•</span>
              <span>
                Basket AOV: <strong className="text-[#072515]">{formatINR(activePoint.aov)}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Responsive SVG Chart */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 sm:h-64 overflow-visible select-none"
          >
            <defs>
              {/* Gradient for area fill */}
              <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eed08e" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#eed08e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#eed08e" stopOpacity="0.0" />
              </linearGradient>

              {/* Line Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#072515" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Background Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = paddingY + pct * (chartHeight - paddingY * 2);
              const val = Math.round(maxVal - pct * (maxVal - minVal));
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#E7E5E0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-black/40 font-mono"
                  >
                    {chartMetric === "revenue" || chartMetric === "aov"
                      ? `₹${(val / 1000).toFixed(0)}k`
                      : val.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {areaD && <path d={areaD} fill="url(#velocityGradient)" />}

            {/* Previous Period Dashed Baseline */}
            {prevPathD && (
              <path
                d={prevPathD}
                fill="none"
                stroke="#c89e43"
                strokeWidth="1.75"
                strokeDasharray="5 5"
                strokeOpacity="0.45"
              />
            )}

            {/* Main Spline Curve */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#072515"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            )}

            {/* Interactive Data Points */}
            {points.map((p, i) => {
              const coord = getCoordinates(i, p[chartMetric]);
              const isHovered = hoveredPointIndex === i;
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(i)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  {/* Invisible hit-area circle for touch & hover */}
                  <circle cx={coord.x} cy={coord.y} r={18} fill="transparent" />

                  {/* Pulsing halo on hover */}
                  {isHovered && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={10}
                      fill="#eed08e"
                      fillOpacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isHovered ? 6 : 4}
                    fill="#072515"
                    stroke="#eed08e"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-150"
                  />

                  {/* Date label at bottom */}
                  <text
                    x={coord.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className={`text-[10px] font-medium transition-colors ${
                      isHovered ? "fill-[#072515] font-bold" : "fill-black/45"
                    }`}
                  >
                    {p.shortDate}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chart Legend & Summary Stats */}
        <div className="pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#072515]" />
              <span className="text-black/70 font-medium">Current Period Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-[#c89e43]" />
              <span className="text-black/50 font-medium">Prior Period Benchmark</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-black/60">
            <span>
              Peak: <strong>{formatMetricVal(Math.max(...metricValues), chartMetric)}</strong>
            </span>
            <span>•</span>
            <span>
              Period Growth: <strong className="text-emerald-700">+{currentData.revenueGrowth}%</strong>
            </span>
          </div>
        </div>
      </section>
      )}

      {/* ==================================================================== */}
      {/* 5. DUAL INTELLIGENCE PANELS: CATEGORIES & ORDER CONVERSION FUNNEL    */}
      {/* ==================================================================== */}
      {(activeTab === "overview" || activeTab === "sales") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* PANEL 1: CATEGORY-WISE SALES DISTRIBUTION */}
        <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#072515]">Sales by Atelier Category</h3>
                <p className="text-xs text-black/50">Revenue and units distributed across Kurma sacred collections.</p>
              </div>
              <span className="text-xs font-bold text-[#072515]">{formatINR(currentData.totalRevenue)}</span>
            </div>

            {/* Multi-segment luxury visual bar */}
            <div className="mt-4 h-3.5 rounded-full overflow-hidden flex bg-stone-100 p-0.5 border border-black/10">
              <div
                className="h-full bg-[#072515] rounded-l-full transition-all duration-500"
                style={{ width: "52%" }}
                title="Luxury Gift Trunks: 52%"
              />
              <div
                className="h-full bg-[#c89e43] transition-all duration-500"
                style={{ width: "28%" }}
                title="Brassware: 28%"
              />
              <div
                className="h-full bg-[#8C281F] rounded-r-full transition-all duration-500"
                style={{ width: "20%" }}
                title="Incense Suites: 20%"
              />
            </div>

            {/* Category breakdown rows */}
            <div className="mt-4 space-y-3">
              {[
                {
                  name: "Luxury Gift Trunks & Keepsake Boxes",
                  share: "52%",
                  revenue: 199800,
                  units: "307 units sold",
                  color: "#072515",
                  subtext: "MDF Celebration, Heirloom Wood, Wicker Tokris",
                },
                {
                  name: "Sacred Brass Burners & Accessories",
                  share: "28%",
                  revenue: 107700,
                  units: "86 units sold",
                  color: "#c89e43",
                  subtext: "Turtle Burners, Dhoop Urns, Brass Plates",
                },
                {
                  name: "Pancha Mahabhuta Incense Suites",
                  share: "20%",
                  revenue: 77150,
                  units: "267 units sold",
                  color: "#8C281F",
                  subtext: "Earth Sandalwood, Vedic Flora, Temple Dhoop",
                },
              ].map((c) => (
                <div key={c.name} className="p-3 rounded-xl bg-[#FAF8F5] border border-black/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="font-bold text-[#072515]">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#072515]">{formatINR(c.revenue)}</span>
                      <span className="text-[10px] text-black/50 ml-1.5 font-medium">({c.share})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-black/55 pl-4.5">
                    <span>{c.subtext}</span>
                    <span className="font-mono text-[10px]">{c.units}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-black/60">
            <span>Fastest growing category:</span>
            <span className="font-bold text-emerald-800">+34% Luxury Keepsake Trunks</span>
          </div>
        </section>

        {/* PANEL 2: ORDER CONVERSION FUNNEL & STATUS */}
        <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#072515]">Storefront Conversion Funnel</h3>
                <p className="text-xs text-black/50">From sanctuary visit to completed luxury hamper checkout.</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                4.12% Overall Conv.
              </span>
            </div>

            {/* Funnel Steps */}
            <div className="mt-4 space-y-2.5">
              {[
                { step: "1. Website Footfall Visitors", count: "4,890 patrons", pct: 100, conv: "100%" },
                { step: "2. Explored Atelier Creations", count: "3,240 patrons", pct: 66, conv: "66.3%" },
                { step: "3. Built Customizer Hamper (/elements)", count: "680 hampers", pct: 28, conv: "13.9%" },
                { step: "4. Reached Checkout Concierge", count: "240 checkouts", pct: 15, conv: "4.9%" },
                { step: "5. Completed Sacred Gifting Orders", count: "148 orders", pct: 10, conv: "3.03%" },
              ].map((f, i) => (
                <div key={f.step} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-black/80">{f.step}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#072515]">{f.count}</span>
                      <span className="text-[10px] text-black/45 font-mono">({f.conv})</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 overflow-hidden border border-black/5">
                    <div
                      className="h-full bg-[#072515] rounded-full transition-all duration-500"
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="mt-4 pt-3 border-t border-black/5">
            <span className="text-[11px] font-semibold text-black/60 block mb-1.5">
              Settlement Channels:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-black/5">
                <span className="block font-bold text-[#072515]">58%</span>
                <span className="text-[10px] text-black/50">UPI (Instant)</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-black/5">
                <span className="block font-bold text-[#072515]">34%</span>
                <span className="text-[10px] text-black/50">Credit / Debit</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-black/5">
                <span className="block font-bold text-[#072515]">8%</span>
                <span className="text-[10px] text-black/50">Net Banking</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      )}

      {/* ==================================================================== */}
      {/* 6. BEST-SELLING PRODUCTS & PERFORMANCE MATRIX                        */}
      {/* ==================================================================== */}
      {(activeTab === "overview" || activeTab === "products" || activeTab === "inventory") && (
        <section className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
        {/* Table Header with Filters & Search */}
        <div className="p-4 border-b border-black/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm text-[#072515]">
                Top-Selling Atelier Creations Leaderboard
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eed08e]/30 text-[#072515]">
                Ranked by Gross Sales
              </span>
            </div>
            <p className="text-xs text-black/50 mt-0.5">
              Individual product performance, unit turnover velocity, conversion rate, and inventory reserves.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Box */}
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-black/15 text-xs outline-none focus:border-[#072515] w-36 sm:w-44 bg-stone-50/50"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="size-3 text-black/40" />
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-black/15 text-xs font-medium outline-none bg-white focus:border-[#072515] cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Gift Boxes">Gift Boxes</option>
                <option value="Incense">Incense</option>
                <option value="Brassware">Brassware</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={productSortBy}
              onChange={(e) => setProductSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-black/15 text-xs font-medium outline-none bg-white focus:border-[#072515] cursor-pointer"
            >
              <option value="revenue">Sort: Highest Revenue</option>
              <option value="units">Sort: Most Units Sold</option>
              <option value="conversion">Sort: Conversion Rate</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAF8F5] text-black/70 border-b border-black/10 font-medium">
              <tr>
                <th className="px-4 py-3">Rank &amp; Product</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Base Price</th>
                <th className="px-3 py-3">Units Sold</th>
                <th className="px-3 py-3">Gross Revenue</th>
                <th className="px-3 py-3">Conv. Rate</th>
                <th className="px-3 py-3">Stock Reserves</th>
                <th className="px-3 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-black/[0.015] transition">
                  {/* Rank & Product Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          prod.rank === 1
                            ? "bg-[#072515] text-[#eed08e] shadow-2xs"
                            : prod.rank === 2
                            ? "bg-[#c89e43] text-white"
                            : prod.rank === 3
                            ? "bg-[#8C281F] text-white"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {prod.rank}
                      </span>
                      <div className="relative size-11 rounded-xl overflow-hidden border border-black/10 bg-[#FAF8F5] shrink-0">
                        <Image src={prod.image} alt={prod.name} fill className="object-contain p-0.5" unoptimized />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <span className="font-bold text-[#072515] block truncate">{prod.name}</span>
                        <span className="text-[11px] text-black/50 line-clamp-1">{prod.description}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      {prod.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-3 py-3 font-semibold text-black/70 whitespace-nowrap">
                    {formatINR(prod.price)}
                  </td>

                  {/* Units Sold */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#072515]">{prod.unitsSold}</span>
                      <div className="w-12 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className="h-full bg-[#072515] rounded-full"
                          style={{ width: `${Math.min(100, (prod.unitsSold / 228) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="px-3 py-3 font-bold text-[#072515] whitespace-nowrap">
                    {formatINR(prod.revenue)}
                  </td>

                  {/* Conversion */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="text-emerald-700 font-bold">{prod.conversionRate}%</span>
                  </td>

                  {/* Stock Health */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        prod.stockStatus === "Healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : prod.stockStatus === "Low Stock"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          prod.stockStatus === "Healthy"
                            ? "bg-emerald-600"
                            : prod.stockStatus === "Low Stock"
                            ? "bg-amber-600"
                            : "bg-red-600"
                        }`}
                      />
                      <span>
                        {prod.stockCount} units ({prod.stockStatus})
                      </span>
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <Link
                      href={prod.id === "celebration-box" || prod.id === "heritage-box" ? "/admin/customise/edit?id=celebration" : "/admin"}
                      className="p-1.5 rounded-lg text-black/50 hover:text-[#072515] hover:bg-black/5 transition inline-flex items-center"
                      title="Inspect Product"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {/* ==================================================================== */}
      {/* 7. CUSTOMER GROWTH & TOP GEOGRAPHIC SANCTUARIES                       */}
      {/* ==================================================================== */}
      {(activeTab === "overview" || activeTab === "customers" || activeTab === "inventory") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Patron Demographics & Loyalty */}
        <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/5">
            <h3 className="font-serif font-bold text-sm text-[#072515]">Patron Loyalty &amp; Growth</h3>
            <UsersRound className="size-4 text-[#c89e43]" />
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-black/70">Returning Sanctuary Patrons</span>
                <span className="font-bold text-[#072515]">38.6%</span>
              </div>
              <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-[#072515] rounded-full" style={{ width: "38.6%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-black/70">First-Time Gifting Patrons</span>
                <span className="font-bold text-[#c89e43]">61.4%</span>
              </div>
              <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-[#c89e43] rounded-full" style={{ width: "61.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-black/70">Sovereign VIP Club Tier</span>
                <span className="font-bold text-emerald-800">24.2%</span>
              </div>
              <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full" style={{ width: "24.2%" }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/5 text-[11px] text-black/60 space-y-1">
            <p>• Average Patron Lifetime Value (LTV): <strong>₹14,250</strong></p>
            <p>• VIP Patron Repeat Frequency: <strong>2.8 orders / year</strong></p>
          </div>
        </section>

        {/* Top Cities by Sacred Gifting Orders */}
        <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/5">
            <h3 className="font-serif font-bold text-sm text-[#072515]">Top Cities by Sacred Gifting</h3>
            <MapPin className="size-4 text-[#072515]" />
          </div>

          <div className="space-y-2 text-xs pt-1">
            {[
              { city: "Mumbai, Maharashtra", orders: 55, pct: "37%" },
              { city: "Bengaluru, Karnataka", orders: 37, pct: "25%" },
              { city: "New Delhi, NCR", orders: 31, pct: "21%" },
              { city: "Hyderabad, Telangana", orders: 15, pct: "10%" },
              { city: "Ahmedabad, Gujarat", orders: 10, pct: "7%" },
            ].map((c) => (
              <div key={c.city} className="flex items-center justify-between py-1 border-b border-black/5 last:border-none">
                <span className="font-medium text-black/80">{c.city}</span>
                <div className="flex items-center gap-3">
                  <span className="text-black/45 text-[11px]">{c.pct}</span>
                  <span className="font-bold text-[#072515]">{c.orders} orders</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-emerald-800 font-semibold">
            ✓ Express Air fulfillment active across all top 5 metros
          </div>
        </section>

        {/* Inventory Intelligence & Stock Health */}
        <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/5">
            <h3 className="font-serif font-bold text-sm text-[#072515]">Atelier Stock Health</h3>
            <Boxes className="size-4 text-[#c89e43]" />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-semibold text-emerald-900">Healthy Stock (&gt;15 units)</span>
              <span className="font-bold text-emerald-800">12 SKUs</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200">
              <span className="font-semibold text-amber-900">Low Stock Alert (6–15 units)</span>
              <span className="font-bold text-amber-800">4 SKUs</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-red-50 border border-red-200">
              <span className="font-semibold text-red-900">Urgent Reorder (&lt;6 units)</span>
              <span className="font-bold text-red-800">2 SKUs</span>
            </div>
          </div>

          <div className="pt-2 border-t border-black/5 text-[11px] text-black/60">
            <p className="font-medium text-amber-900">
              ⚠ Attention: Solid Brass Turtle Stand and Earth Sandalwood running low (6 units left each).
            </p>
          </div>
        </section>
      </div>
      )}
    </main>
  );
}
