import { redirect } from "next/navigation";

export default function ReturnsExchangeRedirect() {
  redirect("/refund-policy");
}
