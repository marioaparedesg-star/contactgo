export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* Header skeleton */}
      <div className="mb-4">
        <div className="h-7 w-32 bg-gray-100 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-100 rounded-full animate-pulse shrink-0" />
        ))}
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-full bg-gray-100 rounded-xl animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
