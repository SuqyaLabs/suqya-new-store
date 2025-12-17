import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('online_orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_wilaya,
        shipping_commune,
        shipping_method,
        shipping_cost,
        shipping_status,
        tracking_number,
        payment_method,
        payment_status,
        subtotal,
        total,
        created_at,
        online_order_items (
          id,
          product_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by phone or email
    if (phone) {
      query = query.eq('customer_phone', phone);
    } else if (email) {
      query = query.ilike('customer_email', email);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Transform data to match expected format
    const transformedOrders = orders?.map(order => ({
      ...order,
      items: order.online_order_items || []
    })) || [];

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Error in orders lookup API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
