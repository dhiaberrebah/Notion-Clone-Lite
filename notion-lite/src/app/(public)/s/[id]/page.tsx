import Link from "next/link";
import { getPageById, listChildren } from "@/lib/db/pages";

export default async function PublicPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const page = await getPageById(id);

  if (!page || !page.is_public) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-sm text-gray-600">This page is not public.</p>
      </div>
    );
  }

  const children = await listChildren(id);

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{page.title || "Untitled"}</h1>
          <p className="text-xs text-gray-500">Public page</p>
        </div>
        <Link href={`/p/${id}`} className="text-sm underline">Open in app →</Link>
      </header>

      <article className="prose max-w-none">
        {/* Basic rendering for now; TipTap JSON could be rendered read-only later */}
        {page.content?.text ? (
          <p>{page.content.text}</p>
        ) : (
          <p className="text-gray-600">No content.</p>
        )}
      </article>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Sub-pages</h2>
        {children.length === 0 ? (
          <p className="text-sm text-gray-600">No sub-pages.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {children
              .filter((c) => c.is_public)
              .map((c) => (
                <li key={c.id}>
                  <Link href={`/s/${c.id}`} className="underline">{c.title || "Untitled"}</Link>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
