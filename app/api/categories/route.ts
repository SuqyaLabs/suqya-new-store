import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'fr';

    // Get categories with translations
    const { data: categoriesData, error: catError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        category_translations(
          name,
          language_code
        )
      `)
      .eq('tenant_id', TENANT_ID);

    if (catError) {
      console.error('Error fetching categories:', catError);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    // Get product counts per category
    const { data: productsData, error: prodError } = await supabase
      .from('products')
      .select('category_id')
      .eq('tenant_id', TENANT_ID)
      .eq('is_available', true)
      .eq('is_online', true);

    if (prodError) {
      console.error('Error fetching products:', prodError);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Count products per category
    const productCounts = new Map<string, number>();
    productsData?.forEach(product => {
      if (product.category_id) {
        productCounts.set(
          product.category_id, 
          (productCounts.get(product.category_id) || 0) + 1
        );
      }
    });

    // Build result with translated names and product counts
    const result = categoriesData?.map(category => {
      // Find translation for current locale, fallback to default name
      const translation = category.category_translations?.find(
        (t: { language_code: string; name: string }) => t.language_code === locale
      );
      
      return {
        id: category.id,
        name: translation?.name || category.name,
        product_count: productCounts.get(category.id) || 0
      };
    }).filter(cat => cat.product_count > 0) || [];

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
