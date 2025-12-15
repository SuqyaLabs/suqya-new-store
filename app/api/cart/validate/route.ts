import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface CartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
}

interface ValidatedItem extends CartItem {
  available: boolean;
  availableQty: number;
  productName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ valid: true, items: [] });
    }

    const validatedItems: ValidatedItem[] = [];
    let allValid = true;

    for (const item of items) {
      // Check inventory levels
      const { data: inventory, error } = await supabase
        .from("inventory_levels")
        .select("qty_available, qty_on_hand")
        .eq(item.variantId ? "variant_id" : "product_id", item.variantId || item.productId)
        .single();

      if (error || !inventory) {
        // No inventory tracking - assume available
        validatedItems.push({
          ...item,
          available: true,
          availableQty: 999,
        });
        continue;
      }

      const availableQty = inventory.qty_available || inventory.qty_on_hand || 0;
      const isAvailable = availableQty >= item.quantity;

      if (!isAvailable) {
        allValid = false;
      }

      validatedItems.push({
        ...item,
        available: isAvailable,
        availableQty,
      });
    }

    return NextResponse.json({
      valid: allValid,
      items: validatedItems,
    });
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate cart" },
      { status: 500 }
    );
  }
}
