import { listRootPages, createPage } from "@/lib/db/pages";

export default async function Home() {
  const pages = await listRootPages();

  async function createAction(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    if (!title) return;
    await createPage({ title });
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Your pages</h1>
        {pages.length === 0 ? (
          <p className="text-sm text-gray-600">No pages yet. Create your first page below.</p>
        ) : (
          <ul className="divide-y rounded border">
            {pages.map((p) => (
              <li key={p.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.title || "Untitled"}</div>
                  <div className="text-xs text-gray-500">{new Date(p.updated_at).toLocaleString()}</div>
                </div>
                {/* Placeholder for link to page view/editor route */}
                {/* <Link href={`/p/${p.id}`} className="text-sm underline">Open</Link> */}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <form action={createAction} className="flex items-center gap-2">
          <input
            type="text"
            name="title"
            placeholder="New page title"
            className="w-full rounded border px-3 py-2"
          />
          <button type="submit" className="rounded bg-black text-white px-4 py-2">Create</button>
        </form>
      </section>
    </main>
  );
}
