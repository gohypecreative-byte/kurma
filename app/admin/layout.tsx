import type { Metadata } from "next";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Kurma Atelier — Administration Console",
  description: "Secure sovereign administrative management for Kurma Luxury Atelier.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}

