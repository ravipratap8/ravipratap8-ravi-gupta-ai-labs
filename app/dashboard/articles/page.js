'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { FileText, Plus, Save, Send, Trash2, ExternalLink, Pencil, Bold, Italic, List, ListOrdered, Heading2, Quote, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/ui';

const EMPTY = { id: null, title: '', slug: '', excerpt: '', contentHtml: '', featuredImageUrl: '', status: 'draft' };

function clientCleanHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,iframe,object,embed,form,input,button,svg,math').forEach((node) => node.remove());
  const allowed = new Set(['P','BR','H2','H3','H4','STRONG','B','EM','I','U','S','UL','OL','LI','BLOCKQUOTE','A','PRE','CODE','HR']);
  [...doc.body.querySelectorAll('*')].forEach((node) => {
    if (!allowed.has(node.tagName)) {
      node.replaceWith(...node.childNodes);
      return;
    }
    [...node.attributes].forEach((attr) => {
      if (node.tagName === 'A' && attr.name.toLowerCase() === 'href') return;
      node.removeAttribute(attr.name);
    });
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || '';
      if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href)) node.removeAttribute('href');
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  return doc.body.innerHTML;
}

export default function ArticlesAdminPage() {
  const editorRef = useRef(null);
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to load articles');
      setArticles(data);
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const syncEditor = () => setForm((current) => ({ ...current, contentHtml: editorRef.current?.innerHTML || '' }));

  const newArticle = () => {
    setForm(EMPTY);
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const editArticle = (article) => {
    const next = {
      id: article.id,
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      contentHtml: article.content_html || '',
      featuredImageUrl: article.featured_image_url || '',
      status: article.status || 'draft',
    };
    setForm(next);
    requestAnimationFrame(() => { if (editorRef.current) editorRef.current.innerHTML = next.contentHtml; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const command = (name, value = null) => {
    editorRef.current?.focus();
    document.execCommand(name, false, value);
    syncEditor();
  };

  const addLink = () => {
    const url = window.prompt('Paste the link URL');
    if (url) command('createLink', url);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');
    const clean = html ? clientCleanHtml(html) : text.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    document.execCommand('insertHTML', false, clean);
    syncEditor();
  };

  const save = async (status) => {
    const contentHtml = editorRef.current?.innerHTML || '';
    if (!form.title.trim()) return toast.error('Add an article title');
    if (!contentHtml.replace(/<[^>]+>/g, '').trim()) return toast.error('Add article content');

    setSaving(true);
    try {
      const payload = { ...form, contentHtml, status };
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
    } catch (error) { toast.error(error.message); }
    finally { setSaving(false); }
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

  return (
    <div>
      <PageHeader title="Articles" subtitle="Write, format, preview and publish articles to your public portfolio without redeploying the site." />

      <div className="mb-5 flex flex-wrap gap-2">
        <Button onClick={newArticle} variant="outline"><Plus className="mr-2 h-4 w-4" /> New article</Button>
        <Link href="/articles" target="_blank"><Button variant="outline"><ExternalLink className="mr-2 h-4 w-4" /> View public articles</Button></Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border bg-card p-5 md:p-6">
          <div className="space-y-5">
            <div><label className="mb-1.5 block text-sm font-medium">Article title</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Why AI Testing Needs Human Oversight" className="text-base" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1.5 block text-sm font-medium">URL slug <span className="text-muted-foreground">(optional)</span></label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="generated-from-title" /></div>
              <div><label className="mb-1.5 block text-sm font-medium">Featured image URL <span className="text-muted-foreground">(optional)</span></label><Input value={form.featuredImageUrl} onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })} placeholder="https://..." /></div>
            </div>
            <div><label className="mb-1.5 block text-sm font-medium">Short summary <span className="text-muted-foreground">(optional, auto-generated if blank)</span></label><Textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A short description shown on the article listing and when the link is shared." /></div>

            <div>
              <div className="mb-1.5 flex items-center justify-between"><label className="text-sm font-medium">Article content</label><span className="text-xs text-muted-foreground">Paste directly from Word</span></div>
              <div className="flex flex-wrap gap-1 rounded-t-xl border border-b-0 bg-muted/50 p-2">
                <Button type="button" variant="ghost" size="icon" title="Bold" onClick={() => command('bold')}><Bold className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" title="Italic" onClick={() => command('italic')}><Italic className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" title="Heading" onClick={() => command('formatBlock', 'h2')}><Heading2 className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" title="Bulleted list" onClick={() => command('insertUnorderedList')}><List className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" title="Numbered list" onClick={() => command('insertOrderedList')}><ListOrdered className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" title="Quote" onClick={() => command('formatBlock', 'blockquote')}><Quote className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" title="Link" onClick={addLink}><Link2 className="h-4 w-4" /></Button>
              </div>
              <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={syncEditor} onPaste={handlePaste} className="article-editor min-h-[460px] rounded-b-xl border bg-background p-5 text-base leading-7 outline-none focus:ring-2 focus:ring-cyan-500/30" data-placeholder="Write here, or copy your finished article from Word and paste it here..." />
            </div>

            <div className="flex flex-wrap gap-2 border-t pt-5">
              <Button disabled={saving} variant="outline" onClick={() => save('draft')}><Save className="mr-2 h-4 w-4" /> Save draft</Button>
              <Button disabled={saving} onClick={() => save('published')} className="bg-cyan-600 hover:bg-cyan-700"><Send className="mr-2 h-4 w-4" /> {form.status === 'published' ? 'Update published article' : 'Publish article'}</Button>
              {form.status === 'published' && form.slug ? <Link href={`/articles/${form.slug}`} target="_blank"><Button variant="ghost"><ExternalLink className="mr-2 h-4 w-4" /> Open live article</Button></Link> : null}
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border bg-card p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display font-semibold">Your articles</h2><Badge variant="outline">{articles.length}</Badge></div>
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : articles.length === 0 ? <div className="rounded-xl border border-dashed p-6 text-center"><FileText className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">No articles yet.</p></div> : <div className="space-y-2">
            {articles.map((article) => <div key={article.id} className="rounded-xl border p-3">
              <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="line-clamp-2 text-sm font-semibold">{article.title}</p><div className="mt-1"><Badge variant="outline" className={article.status === 'published' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}>{article.status}</Badge></div></div><div className="flex shrink-0"><Button size="icon" variant="ghost" onClick={() => editArticle(article)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(article.id)} className="text-rose-500"><Trash2 className="h-4 w-4" /></Button></div></div>
            </div>)}
          </div>}
        </aside>
      </div>
    </div>
  );
}
