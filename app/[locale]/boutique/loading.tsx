import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function BoutiqueLoading() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-br from-honey-100 to-forest-50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-warm-200 rounded-lg mx-auto mb-4" />
            <div className="h-5 w-96 max-w-full bg-warm-200 rounded mx-auto" />
          </div>
        </div>
      </section>

      {/* Categories Filter Skeleton */}
      <section className="bg-white border-b border-warm-200 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 bg-warm-200 rounded-full animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-5 w-24 bg-warm-200 rounded animate-pulse" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    </div>
  );
}
