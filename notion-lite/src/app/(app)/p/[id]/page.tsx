import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPageById, listChildren, updatePage, createPage, deletePage } from "@/lib/db/pages";
import TipTapEditor from "@/components/editor/TipTapEditor";
export default async function PageDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-600">Page not found or you don't have access.</p>
          <Link href="/" className="underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const children = await listChildren(id);

  // Build breadcrumb chain by walking parent links
  async function buildBreadcrumb(currentId: string) {
    const chain: { id: string; title: string }[] = [];
    let cursor: string | null = currentId;
    const safety = 20; // prevent infinite loops
    let steps = 0;
    while (cursor && steps < safety) {
      const p = await getPageById(cursor);
      if (!p) break;
      chain.push({ id: p.id, title: p.title || "Untitled" });
      cursor = p.parent_id;
      steps++;
    }
    return chain.reverse();
  }
  const breadcrumb = await buildBreadcrumb(id);

  async function updateTitle(formData: FormData) {
    "use server";
    const newTitle = String(formData.get("title") || "").trim();
    if (!newTitle) return;
    await updatePage(id, { title: newTitle });
    revalidatePath(`/p/${id}`);
  }

  async function updateContent(formData: FormData) {
    "use server";
    const jsonStr = String(formData.get("content_json") || "");
    let parsed: any = null;
    try {
      parsed = jsonStr ? JSON.parse(jsonStr) : null;
    } catch {
      parsed = null;
    }
    await updatePage(id, { content: parsed });
    revalidatePath(`/p/${id}`);
  }

  async function createChildAction(formData: FormData) {
    "use server";
    const title = String(formData.get("childTitle") || "").trim();
    if (!title) return;
    const child = await createPage({ title, parentId: id });
    revalidatePath(`/p/${id}`);
    if (child?.id) redirect(`/p/${child.id}`);
  }

  async function deleteAction() {
    "use server";
    await deletePage(id);
    redirect("/");
  }

  async function toggleShare(formData: FormData) {
    "use server";
    const isPublic = formData.get("is_public") === "on";
    await updatePage(id, { is_public: isPublic });
    revalidatePath(`/p/${id}`);
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="underline">Home</Link>
          {breadcrumb.map((b, idx) => (
            <span key={b.id}>
              <span className="mx-1">/</span>
              {idx === breadcrumb.length - 1 ? (
                <span className="text-gray-900 font-medium">{b.title}</span>
              ) : (
                <Link className="underline" href={`/p/${b.id}`}>{b.title}</Link>
              )}
            </span>
          ))}
        </nav>
        <form action={deleteAction}>
          <button type="submit" className="inline-flex items-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">Delete</button>
        </form>
      </div>

      <form action={updateTitle} className="space-y-2">
        <label className="block text-sm text-gray-600">Title</label>
        <input
          name="title"
          defaultValue={page.title}
          className="w-full rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
          placeholder="Untitled"
        />
        <button type="submit" className="inline-flex items-center rounded-md bg-black text-white px-3 py-1.5 text-sm hover:bg-black/90">Save title</button>
      </form>

      <form action={toggleShare} className="space-y-2 rounded-lg border bg-white p-3">
        <div className="flex items-center gap-2">
          <input id="is_public" name="is_public" type="checkbox" defaultChecked={!!page.is_public} />
          <label htmlFor="is_public" className="text-sm">Make page public</label>
        </div>
        {page.is_public && (
          <div className="text-sm text-gray-600">
            Public URL: <a className="underline" href={`/s/${page.id}`}>{`/s/${page.id}`}</a>
          </div>
        )}
        <button type="submit" className="inline-flex items-center rounded-md bg-black text-white px-3 py-1.5 text-sm hover:bg-black/90">Update sharing</button>
      </form>

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Content</label>
        {/* TipTap client editor with server action save */}
        <TipTapEditor
          initialContent={page.content ?? null}
          saveAction={updateContent}
        />
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Sub-pages</h2>
        {children.length === 0 ? (
          <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">No sub-pages yet.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children.map((c) => (
              <li key={c.id}>
                <Link href={`/p/${c.id}`} className="block rounded-lg border bg-white p-3 shadow-sm hover:shadow transition-shadow">
                  <div className="truncate font-medium">{c.title || "Untitled"}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <form action={createChildAction} className="flex items-center gap-2">
          <input name="childTitle" placeholder="New sub-page title" className="flex-1 rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          <button type="submit" className="inline-flex items-center rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-black/90">Create</button>
        </form>
      </section>
    </div>
  );
}
