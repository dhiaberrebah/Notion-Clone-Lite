import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function AppGroupLayout({ children, params }: { children: ReactNode; params: { id?: string } }) {
  // When at /p/[id], params.id will be defined for this layout render
  const currentId = params?.id;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <aside className="md:sticky md:top-20 h-fit">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Sidebar currentId={currentId} />
        </div>
      </aside>
      <section className="min-h-[60vh]">
        {children}
      </section>
    </div>
  );
}
