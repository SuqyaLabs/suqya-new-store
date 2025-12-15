import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        short_description,
        categories!products_category_id_fkey (
          name
        )
      `)
      .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
      .eq("is_available", true)
      .limit(10);

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500 }
      );
    }

    const products = (data || []).map((product: Record<string, unknown>) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      short_description: product.short_description,
      category_name: (product.categories as { name: string } | null)?.name || null,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
