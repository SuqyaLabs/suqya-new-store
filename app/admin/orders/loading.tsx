import { OrdersListSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl p-4">
          <OrdersListSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
