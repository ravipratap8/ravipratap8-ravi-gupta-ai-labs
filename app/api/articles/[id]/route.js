import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createExcerpt, sanitizeArticleHtml, slugifyArticleTitle } from '@/lib/articles/sanitize';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('profile_id', user.id)
    .in('role', ['owner', 'admin'])
    .limit(1)
    .maybeSingle();

  if (!membership) return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  return { supabase, user };
}

async function resolveUniqueSlug(supabase, value, currentId) {
  const base = slugifyArticleTitle(value) || `article-${Date.now()}`;
  let candidate = base;
  let counter = 2;

  while (true) {
    const { data } = await supabase.from('articles').select('id').eq('slug', candidate).maybeSingle();
    if (!data || data.id === currentId) return candidate;
    candidate = `${base}-${counter++}`;
  }
}

export async function PUT(request, { params }) {
  const ctx = await requireAdmin();
  if (ctx.error) return ctx.error;

  const { id } = await params;
  const body = await request.json();
  const title = String(body.title || '').trim();
  const contentHtml = sanitizeArticleHtml(body.contentHtml || '');
  const status = body.status === 'published' ? 'published' : 'draft';

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!contentHtml.trim()) return NextResponse.json({ error: 'Article content is required' }, { status: 400 });

  const { data: existing, error: existingError } = await ctx.supabase
    .from('articles')
    .select('id, published_at')
    .eq('id', id)
    .single();

  if (existingError || !existing) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

  const slug = await resolveUniqueSlug(ctx.supabase, body.slug || title, id);
  const excerpt = String(body.excerpt || '').trim() || createExcerpt(contentHtml);

  const { data, error } = await ctx.supabase
    .from('articles')
    .update({
      title,
      slug,
      excerpt: excerpt.slice(0, 500),
      content_html: contentHtml,
      status,
      featured_image_url: String(body.featuredImageUrl || '').trim() || null,
      published_at: status === 'published' ? (existing.published_at || new Date().toISOString()) : null,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request, { params }) {
  const ctx = await requireAdmin();
  if (ctx.error) return ctx.error;

  const { id } = await params;
  const { error } = await ctx.supabase.from('articles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
