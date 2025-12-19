"use client";

import { ProductCard } from "@/components/product/product-card";
import { SectionGradient } from "@/components/theme/section-gradient";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  images?: string[] | null;
  short_description?: string | null;
  category_name?: string | null;
  is_available?: boolean;
}

interface CategoryPageClientProps {
  categoryName: string;
  categoryDescription: string;
  products: Product[];
  productCountLabel: string;
  noProductsLabel: string;
}

export function CategoryPageClient({
  categoryName,
  categoryDescription,
  products,
  productCountLabel,
  noProductsLabel,
}: CategoryPageClientProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SectionGradient variant="primary" intensity="medium" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              {categoryName}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {categoryDescription}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <SectionGradient variant="secondary" intensity="light" />
        <div className="container relative z-10 mx-auto px-4">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  {productCountLabel}
                </p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug || undefined}
                      price={product.price}
                      image={product.images?.[0]}
                      short_description={product.short_description || undefined}
                      category={product.category_name || undefined}
                      isAvailable={product.is_available}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🍯</span>
              <p className="text-muted-foreground text-lg">
                {noProductsLabel}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
