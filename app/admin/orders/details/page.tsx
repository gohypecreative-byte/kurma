import { Suspense } from "react";
import OrderDetailsPage from "../[id]/page";
import { Loader2 } from "lucide-react";

export default function OrderDetailsAliasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#28513B]" />
        </div>
      }
    >
      <OrderDetailsPage params={Promise.resolve({ id: "" })} />
    </Suspense>
  );
}
