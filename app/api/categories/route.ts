import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get("locale") || "fr";

  try {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id,
        category_translations!inner (
          name,
          language_code
        ),
        products!products_category_id_fkey (
          id
        )
      `)
      .eq("category_translations.language_code", locale);

    if (error) {
      console.error("Categories fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    const categories = (data || []).map((category: Record<string, unknown>) => ({
      id: category.id,
      name: (category.category_translations as { name: string }[])[0]?.name || "",
      product_count: (category.products as unknown[])?.length || 0,
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
