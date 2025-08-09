import Skeleton from "@/components/ui/Skeleton";

export default function LoadingPageDetails() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-80" />
      </div>

      <div className="rounded-lg border bg-white p-3">
        <Skeleton className="mb-2 h-4 w-28" />
        <Skeleton className="h-4 w-44" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="rounded-lg border bg-white p-3">
              <Skeleton className="mb-2 h-5 w-3/5" />
              <Skeleton className="h-4 w-2/5" />
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
      </section>
    </div>
  );
}
