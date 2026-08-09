import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createExcerpt, sanitizeArticleHtml, slugifyArticleTitle } from '@/lib/articles/sanitize';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };
  const { data: membership, error } = await supabase.from('workspace_members').select('role').eq('profile_id', user.id).in('role', ['owner', 'admin']).limit(1).maybeSingle();
  if (error || !membership) return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  return { supabase, user };
}

async function uniqueSlug(supabase, title, requestedSlug) {
  const base = slugifyArticleTitle(requestedSlug || title) || `article-${Date.now()}`;
  let candidate = base;
  let counter = 2;
  while (true) {
    const { data } = await supabase.from('articles').select('id').eq('slug', candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${counter++}`;
  }
}

function cleanTags(tags) {
  const values = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return [...new Set(values.map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 12);
}

export async function GET() {
  const ctx = await requireAdmin();
  if (ctx.error) return ctx.error;
  const { data, error } = await ctx.supabase.from('articles').select('*').order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const ctx = await requireAdmin();
  if (ctx.error) return ctx.error;
  const body = await request.json();
  const title = String(body.title || '').trim();
  const contentHtml = sanitizeArticleHtml(body.contentHtml || '');
  const status = body.status === 'published' ? 'published' : 'draft';
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!contentHtml.trim()) return NextResponse.json({ error: 'Article content is required' }, { status: 400 });

  const slug = await uniqueSlug(ctx.supabase, title, body.slug);
  const excerpt = String(body.excerpt || '').trim() || createExcerpt(contentHtml);
  const publishAt = status === 'published' ? (body.publishedAt ? new Date(body.publishedAt).toISOString() : new Date().toISOString()) : null;
  const { data, error } = await ctx.supabase.from('articles').insert({
    author_id: ctx.user.id,
    title,
    slug,
    excerpt: excerpt.slice(0, 500),
    content_html: contentHtml,
    status,
    featured_image_url: String(body.featuredImageUrl || '').trim() || null,
    published_at: publishAt,
    category: String(body.category || 'AI & Technology').trim().slice(0, 100),
    tags: cleanTags(body.tags),
    seo_title: String(body.seoTitle || '').trim().slice(0, 160) || null,
    seo_description: String(body.seoDescription || '').trim().slice(0, 320) || null,
  }).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
