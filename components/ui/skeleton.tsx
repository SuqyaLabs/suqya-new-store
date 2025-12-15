"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-warm-200",
        className
      )}
    />
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-full mt-3" />
      </div>
    </div>
  );
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Product detail skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <Skeleton className="aspect-square rounded-2xl" />
        
        {/* Info */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-20 w-full" />
          
          {/* Variants */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-20 flex-1 rounded-xl" />
            <Skeleton className="h-20 flex-1 rounded-xl" />
            <Skeleton className="h-20 flex-1 rounded-xl" />
          </div>
          
          {/* Quantity */}
          <Skeleton className="h-12 w-40" />
          
          {/* Button */}
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Order row skeleton
export function OrderRowSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-28" />
      <Skeleton className="h-4 w-32 flex-1" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

// Orders list skeleton
export function OrdersListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <OrderRowSkeleton key={i} />
      ))}
    </div>
  );
}
