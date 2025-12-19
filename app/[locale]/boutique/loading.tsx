import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function BoutiqueLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/5" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-muted rounded-lg mx-auto mb-4" />
            <div className="h-5 w-96 max-w-full bg-muted rounded mx-auto" />
          </div>
        </div>
      </section>

      {/* Categories Filter Skeleton */}
      <section className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 bg-muted rounded-full animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="py-8 md:py-12 relative">
        <div className="absolute inset-0 bg-linear-to-b from-background to-muted/30" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    </div>
  );
}
