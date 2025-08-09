import { listRootPages } from "@/lib/db/pages";
import { createSupabaseActionClient } from "@/lib/supabase/server";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import FormWithToast from "@/components/ui/FormWithToast";

export default async function Home() {
  const pages = await listRootPages();

  async function create(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    if (!title) return;
    const supabase = await createSupabaseActionClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id ?? null;
    if (!userId) redirect("/sign-in");
    await supabase
      .from("pages")
      .insert({
        owner_id: userId,
        title,
        parent_id: null,
        content: {},
      });
    revalidatePath("/");
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Your pages</h1>
        {pages.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-sm text-gray-600 bg-white">
            No pages yet. Create one below.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pages.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/p/${p.id}`}
                  className="block rounded-lg border bg-white p-4 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="font-medium truncate">{p.title || 'Untitled'}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Create a page</h2>
        <FormWithToast success="Page created">
          <form action={create} className="flex items-center gap-2">
            <input
              name="title"
              placeholder="Page title"
              className="flex-1 rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-black/90"
            >
              Create
            </button>
          </form>
        </FormWithToast>
      </section>
    </main>
  );
}
