import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { OrdersClient } from "./orders-client";

export const metadata: Metadata = {
  title: "Commandes - Admin Suqya",
  description: "Gérer les commandes Suqya",
};

export const revalidate = 0; // Always fresh data

async function getOrders() {
  const { data, error } = await supabase
    .from("online_orders")
    .select(`
      id,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      shipping_wilaya,
      shipping_status,
      payment_method,
      payment_status,
      total,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }

  return data || [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-warm-900">Commandes</h1>
            <p className="text-warm-500 mt-1">
              {orders.length} commande{orders.length !== 1 ? "s" : ""} au total
            </p>
          </div>
        </div>

        <OrdersClient initialOrders={orders} />
      </div>
    </div>
  );
}
