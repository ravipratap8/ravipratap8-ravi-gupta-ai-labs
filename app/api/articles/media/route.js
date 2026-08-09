import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };
  const { data: membership } = await supabase.from('workspace_members').select('role').eq('profile_id', user.id).in('role', ['owner', 'admin']).limit(1).maybeSingle();
  if (!membership) return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  return { supabase, user };
}

export async function POST(request) {
  const ctx = await requireAdmin();
  if (ctx.error) return ctx.error;

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Use JPG, PNG, WebP or GIF images' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image must be smaller than 8 MB' }, { status: 400 });

  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${ctx.user.id}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await ctx.supabase.storage.from('article-media').upload(path, bytes, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = ctx.supabase.storage.from('article-media').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
