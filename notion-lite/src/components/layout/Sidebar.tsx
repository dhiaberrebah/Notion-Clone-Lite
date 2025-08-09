import Link from "next/link";
import { listRootPages, getPageById, listChildren } from "@/lib/db/pages";

export default async function Sidebar({ currentId }: { currentId?: string }) {
  const roots = await listRootPages();

  let currentChildren: Awaited<ReturnType<typeof listChildren>> = [];
  let currentAncestors: string[] = [];
  if (currentId) {
    // collect ancestors to expand in UI if needed later
    let cursor: string | null = currentId;
    const safety = 20;
    let steps = 0;
    while (cursor && steps < safety) {
      const page = await getPageById(cursor);
      if (!page) break;
      currentAncestors.push(page.id);
      cursor = page.parent_id;
      steps++;
    }
    currentChildren = await listChildren(currentId);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="px-1 text-xs font-medium uppercase tracking-wide text-gray-500">Pages</h2>
        <div className="mt-2">
          {await Promise.all(
            roots.map(async (p) => (
              <TreeNode key={p.id} nodeId={p.id} title={p.title || 'Untitled'} currentId={currentId} depth={0} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

async function TreeNode({ nodeId, title, currentId, depth }: { nodeId: string; title: string; currentId?: string; depth: number }) {
  const children = depth < 3 ? await listChildren(nodeId) : [];
  const isActive = currentId === nodeId;
  return (
    <div className="mb-1">
      <Link
        href={`/p/${nodeId}`}
        className={`block rounded px-2 py-1 hover:bg-gray-50 ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'} `}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        <span className="truncate inline-block max-w-full align-middle">{title}</span>
      </Link>
      {children.length > 0 && (
        <div>
          {await Promise.all(
            children.map(async (c) => (
              <TreeNode key={c.id} nodeId={c.id} title={c.title || 'Untitled'} currentId={currentId} depth={depth + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
