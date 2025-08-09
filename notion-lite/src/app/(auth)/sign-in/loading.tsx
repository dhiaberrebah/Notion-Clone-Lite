import Skeleton from "@/components/ui/Skeleton";

export default function LoadingSignIn() {
  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 text-center">
          <Skeleton className="mx-auto h-7 w-40" />
          <Skeleton className="mx-auto mt-2 h-4 w-52" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
