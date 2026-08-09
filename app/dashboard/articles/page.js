'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { FileText, Plus, Save, Send, Trash2, ExternalLink, Pencil, ImagePlus, Search, Tags, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/ui';
import ArticleEditor from '@/components/articles/article-editor';

const EMPTY = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  contentHtml: '',
  featuredImageUrl: '',
  status: 'draft',
  category: 'AI & Technology',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  publishedAt: '',
};

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featuredUploading, setFeaturedUploading] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to load articles');
      setArticles(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const newArticle = () => setForm({ ...EMPTY });

  const editArticle = (article) => {
    setForm({
      id: article.id,
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      contentHtml: article.content_html || '',
      featuredImageUrl: article.featured_image_url || '',
      status: article.status || 'draft',
      category: article.category || 'AI & Technology',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      seoTitle: article.seo_title || '',
      seoDescription: article.seo_description || '',
      publishedAt: article.published_at ? (() => { const d = new Date(article.published_at); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); })() : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImage = async (file) => {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/articles/media', { method: 'POST', body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return data.url;
  };

  const uploadFeatured = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setFeaturedUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((current) => ({ ...current, featuredImageUrl: url }));
      toast.success('Featured image uploaded');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFeaturedUploading(false);
    }
  };

  const save = async (status) => {
    if (!form.title.trim()) return toast.error('Add an article title');
    if (!String(form.contentHtml || '').replace(/<[^>]+>/g, '').trim() && !/<(img|iframe|figure)\b/i.test(form.contentHtml || '')) {
      return toast.error('Add article content');
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        status,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        publishedAt: status === 'published' ? (form.publishedAt ? new Date(form.publishedAt).toISOString() : new Date().toISOString()) : null,
      };
      const res = await fetch(form.id ? `/api/articles/${form.id}` : '/api/articles', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast.success(status === 'published' ? 'Article published' : 'Draft saved');
      editArticle(data);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this article permanently?')) return;
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || 'Delete failed');
    toast.success('Article deleted');
    if (form.id === id) newArticle();
    load();
  };

  const filtered = articles.filter((article) => `${article.title} ${article.category || ''} ${(article.tags || []).join(' ')}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Articles CMS" subtitle="Create rich, media-first articles with images, YouTube, references, SEO metadata and responsive publishing without redeploying." />

      <div className="mb-5 flex flex-wrap gap-2">
        <Button onClick={newArticle} variant="outline"><Plus className="mr-2 h-4 w-4" /> New article</Button>
        <Link href="/articles" target="_blank"><Button variant="outline"><ExternalLink className="mr-2 h-4 w-4" /> View public articles</Button></Link>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-2xl border bg-card p-5 md:p-6">
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Article title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="A strong, specific headline" className="h-12 text-lg font-semibold" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">URL slug <span className="text-muted-foreground">(optional)</span></label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="generated-from-title" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="AI Governance" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Tags <span className="text-muted-foreground">(comma separated)</span></label>
              <div className="relative"><Tags className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="AI agents, cybersecurity, governance, testing" /></div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Short summary</label>
              <Textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A concise hook shown on article cards and social previews." />
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3 flex items-center gap-2"><ImagePlus className="h-4 w-4 text-cyan-600" /><h3 className="font-semibold">Featured image</h3></div>
              <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-xl border bg-background aspect-video">
                  {form.featuredImageUrl ? <img src={form.featuredImageUrl} alt="Featured preview" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">No image selected</div>}
                </div>
                <div className="space-y-3">
                  <label className="inline-flex cursor-pointer items-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
                    <ImagePlus className="mr-2 h-4 w-4" /> {featuredUploading ? 'Uploading…' : 'Browse & upload image'}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={uploadFeatured} disabled={featuredUploading} />
                  </label>
                  <Input value={form.featuredImageUrl} onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })} placeholder="Or paste an image URL" />
                  {form.featuredImageUrl ? <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, featuredImageUrl: '' })}>Remove featured image</Button> : null}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium">Article content</label>
                <span className="text-xs text-muted-foreground">Paste from Word • add unlimited images • YouTube • links • references</span>
              </div>
              <ArticleEditor key={form.id || 'new'} value={form.contentHtml} onChange={(contentHtml) => setForm((current) => ({ ...current, contentHtml }))} uploadImage={uploadImage} />
            </div>

            <details className="rounded-2xl border bg-muted/20 p-4">
              <summary className="cursor-pointer font-semibold">SEO & publishing settings</summary>
              <div className="mt-4 grid gap-4">
                <div><label className="mb-1.5 block text-sm font-medium">SEO title <span className="text-muted-foreground">(optional)</span></label><Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Defaults to article title" /></div>
                <div><label className="mb-1.5 block text-sm font-medium">SEO description <span className="text-muted-foreground">(optional)</span></label><Textarea rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} placeholder="Defaults to article summary" /></div>
                <div><label className="mb-1.5 block text-sm font-medium">Publish date/time</label><div className="relative"><CalendarClock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="datetime-local" className="pl-9" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} /></div></div>
              </div>
            </details>

            <div className="flex flex-wrap gap-2 border-t pt-5">
              <Button disabled={saving} variant="outline" onClick={() => save('draft')}><Save className="mr-2 h-4 w-4" /> Save draft</Button>
              <Button disabled={saving} onClick={() => save('published')} className="bg-cyan-600 hover:bg-cyan-700"><Send className="mr-2 h-4 w-4" /> {form.status === 'published' ? 'Update published article' : 'Publish article'}</Button>
              {form.status === 'published' && form.slug ? <Link href={`/articles/${form.slug}`} target="_blank"><Button variant="ghost"><ExternalLink className="mr-2 h-4 w-4" /> Open live article</Button></Link> : null}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border bg-card p-4 md:p-5 2xl:sticky 2xl:top-20">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display font-semibold">Your articles</h2><Badge variant="outline">{articles.length}</Badge></div>
          <div className="relative mb-4"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles" /></div>
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center"><FileText className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">No matching articles.</p></div>
          ) : (
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
              {filtered.map((article) => (
                <div key={article.id} className="rounded-xl border p-3">
                  <div className="flex items-start gap-3">
                    {article.featured_image_url ? <img src={article.featured_image_url} alt="" className="h-14 w-16 rounded-lg object-cover" /> : null}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">{article.title}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{article.category || 'Uncategorised'}</p>
                      <div className="mt-2"><Badge variant="outline" className={article.status === 'published' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}>{article.status}</Badge></div>
                    </div>
                    <div className="flex shrink-0 flex-col"><Button size="icon" variant="ghost" onClick={() => editArticle(article)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(article.id)} className="text-rose-500"><Trash2 className="h-4 w-4" /></Button></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
