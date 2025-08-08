import { cookies } from 'next/headers';
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';

export type PageRow = {
  id: string;
  owner_id: string;
  parent_id: string | null;
  title: string;
  content: Record<string, any>;
  slug: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export async function getCurrentUserId() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function listRootPages(): Promise<PageRow[]> {
  const supabase = createServerComponentClient({ cookies });
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .is('parent_id', null)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PageRow[];
}

export async function getPageById(id: string): Promise<PageRow | null> {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as PageRow;
}

export async function listChildren(parentId: string): Promise<PageRow[]> {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('parent_id', parentId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PageRow[];
}

export async function createPage(input: { title: string; parentId?: string | null }): Promise<PageRow | null> {
  const supabase = createServerActionClient({ cookies });
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('pages')
    .insert({
      owner_id: userId,
      title: input.title,
      parent_id: input.parentId ?? null,
      content: {},
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as PageRow;
}

export async function updatePage(id: string, patch: Partial<Pick<PageRow, 'title' | 'content' | 'is_public' | 'slug' | 'parent_id'>>): Promise<PageRow | null> {
  const supabase = createServerActionClient({ cookies });
  const { data, error } = await supabase
    .from('pages')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as PageRow;
}

export async function deletePage(id: string): Promise<void> {
  const supabase = createServerActionClient({ cookies });
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
