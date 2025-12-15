import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import type { CreateOrderRequest } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `SQ${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.customer?.email || !body.customer?.phone || !body.customer?.name) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      );
    }

    if (!body.shipping?.address || !body.shipping?.wilaya || !body.shipping?.method) {
      return NextResponse.json(
        { error: "Missing shipping information" },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const total = subtotal + (body.shippingCost || 0);

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("online_orders")
      .insert({
        order_number: orderNumber,
        customer_email: body.customer.email,
        customer_phone: body.customer.phone,
        customer_name: body.customer.name,
        shipping_address: body.shipping.address,
        shipping_wilaya: body.shipping.wilaya,
        shipping_commune: body.shipping.commune || "",
        shipping_method: body.shipping.method,
        shipping_cost: body.shippingCost || 0,
        payment_method: body.payment?.method || "cod",
        subtotal,
        total,
        notes: body.notes || null,
        gift_message: body.giftMessage || null,
        is_gift: body.isGift || false,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order", details: orderError.message },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: item.productName,
      variant_name: item.variantName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("online_order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      // Order was created but items failed - log but don't fail
    }

    // Send confirmation email (non-blocking)
    try {
      const emailItems = body.items.map((item) => ({
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }));

      await resend.emails.send({
        from: EMAIL_FROM,
        to: body.customer.email,
        subject: `Commande ${orderNumber} confirmée - Suqya`,
        react: OrderConfirmationEmail({
          customerName: body.customer.name,
          orderNumber,
          items: emailItems,
          subtotal,
          shippingCost: body.shippingCost || 0,
          total,
          shippingAddress: body.shipping.address,
          shippingWilaya: body.shipping.wilaya,
          shippingMethod: body.shipping.method === "yalidine" ? "Yalidine Express" : "Point Relais",
          paymentMethod: body.payment?.method || "cod",
        }),
      });
      console.log("Order confirmation email sent to:", body.customer.email);
    } catch (emailError) {
      // Don't fail the order if email fails
      console.error("Failed to send order email:", emailError);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        total: order.total,
        paymentMethod: order.payment_method,
        shippingMethod: order.shipping_method,
      },
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
