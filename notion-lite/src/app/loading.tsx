import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <aside className="md:col-span-1">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </aside>
        <section className="md:col-span-2">
          <div className="mb-6">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-4 shadow-sm">
                <Skeleton className="mb-2 h-5 w-3/5" />
                <Skeleton className="h-4 w-2/5" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
