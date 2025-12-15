import { CheckoutClient } from "./checkout-client";

// Prevent static prerendering - checkout requires client context (useToast)
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return <CheckoutClient />;
}
