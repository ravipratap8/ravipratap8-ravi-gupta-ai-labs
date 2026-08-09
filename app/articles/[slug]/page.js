import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Linkedin, Clock3, Tag, Link2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { extractHeadings, stripArticleHtml } from '@/lib/articles/sanitize';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('articles').select('title, excerpt, featured_image_url, seo_title, seo_description').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (!data) return { title: 'Article | Ravi Gupta' };
  return {
    title: data.seo_title || `${data.title} | Ravi Gupta`,
    description: data.seo_description || data.excerpt,
    openGraph: {
      title: data.seo_title || data.title,
      description: data.seo_description || data.excerpt,
      type: 'article',
      images: data.featured_image_url ? [{ url: data.featured_image_url }] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).eq('status', 'published').lte('published_at', new Date().toISOString()).maybeSingle();
  if (!article) notFound();

  const words = stripArticleHtml(article.content_html).split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(words / 220));
  const { html, headings } = extractHeadings(article.content_html);
  const canonical = `https://ravigupta.dev/articles/${article.slug}`;
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-sm font-bold text-slate-950">RG</span><div className="leading-tight"><p className="font-display text-sm font-bold">Ravi Gupta</p><p className="text-[11px] text-cyan-400">AI Labs</p></div></Link>
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        </div>
      </header>

      <div className="h-1 w-full bg-white/5"><div className="article-reading-progress h-full bg-cyan-400" /></div>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-5xl px-5 py-12 md:py-20">
          <div className="flex flex-wrap items-center gap-2 text-sm text-cyan-300">
            {article.category ? <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1">{article.category}</span> : null}
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">{article.title}</h1>
          {article.excerpt ? <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl">{article.excerpt}</p> : null}
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Ravi Gupta</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {formatDate(article.published_at)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> {readMinutes} min read</span>
          </div>
        </div>
      </section>

      {article.featured_image_url ? <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-14"><img src={article.featured_image_url} alt={article.title} className="max-h-[620px] w-full rounded-3xl border border-white/10 object-cover shadow-2xl" /></div> : null}

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,760px)_250px] lg:py-16">
        <article className="min-w-0">
          {article.tags?.length ? <div className="mb-8 flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"><Tag className="h-3 w-3" />{tag}</span>)}</div> : null}
          <div className="article-content-pro" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="mt-16 rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 to-sky-500/5 p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">About the author</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Ravi Gupta</h2>
            <p className="mt-3 leading-relaxed text-slate-300">AI engineering, quality engineering, enterprise architecture and technology leadership, with a focus on building AI systems that are useful, testable, governed and accountable.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"><Linkedin className="h-4 w-4" /> Share on LinkedIn</a>
              <a href={canonical} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200"><Link2 className="h-4 w-4" /> Permanent link</a>
            </div>
          </div>
        </article>

        {headings.length >= 2 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">In this article</p>
              <nav className="mt-4 space-y-3">
                {headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className={`block text-sm leading-snug transition hover:text-cyan-300 ${heading.level === 3 ? 'pl-3 text-slate-500' : 'text-slate-300'}`}>{heading.text}</a>)}
              </nav>
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
