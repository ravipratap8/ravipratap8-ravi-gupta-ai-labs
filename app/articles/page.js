import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, FileText, Clock3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { stripArticleHtml } from '@/lib/articles/sanitize';

export const metadata = {
  title: 'Articles | Ravi Gupta',
  description: 'Practical perspectives on AI engineering, testing, governance, architecture and technology leadership by Ravi Gupta.',
};

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

export default async function ArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase.from('articles').select('id,title,slug,excerpt,featured_image_url,published_at,category,tags,content_html').eq('status', 'published').lte('published_at', new Date().toISOString()).order('published_at', { ascending: false });
  const [featured, ...rest] = articles || [];

  const minutes = (article) => Math.max(1, Math.ceil(stripArticleHtml(article.content_html || '').split(/\s+/).filter(Boolean).length / 220));

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-sm font-bold text-slate-950">RG</span><div className="leading-tight"><p className="font-display text-sm font-bold">Ravi Gupta</p><p className="text-[11px] text-cyan-400">AI Labs</p></div></Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to portfolio</Link>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-300"><FileText className="h-4 w-4" /> Ideas worth reading, not content for content's sake</div>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">Articles</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">Practical views on AI, engineering, quality, governance and technology leadership, grounded in what is changing now and what it means in real organisations.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        {!featured ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center"><FileText className="mx-auto h-10 w-10 text-slate-500" /><h2 className="mt-4 font-display text-xl font-semibold">Articles are coming soon</h2></div>
        ) : (
          <>
            <Link href={`/articles/${featured.slug}`} className="group grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition hover:border-cyan-400/30 lg:grid-cols-[1.15fr_.85fr]">
              <div className="min-h-[320px] overflow-hidden bg-slate-900">{featured.featured_image_url ? <img src={featured.featured_image_url} alt={featured.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" /> : <div className="grid h-full place-items-center bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-violet-500/10"><FileText className="h-16 w-16 text-cyan-400/40" /></div>}</div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Latest • {featured.category || 'Article'}</span>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">{featured.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-400">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(featured.published_at)}</span><span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{minutes(featured)} min read</span></div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400">Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>

            {rest.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{rest.map((article) => (
              <article key={article.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]">
                {article.featured_image_url ? <img src={article.featured_image_url} alt={article.title} className="h-52 w-full object-cover" /> : <div className="grid h-52 place-items-center bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-violet-500/10"><FileText className="h-12 w-12 text-cyan-400/50" /></div>}
                <div className="p-6"><span className="text-xs font-semibold text-cyan-300">{article.category || 'Article'}</span><h2 className="mt-2 font-display text-xl font-bold leading-snug group-hover:text-cyan-300">{article.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{article.excerpt}</p><div className="mt-4 flex gap-4 text-xs text-slate-500"><span>{formatDate(article.published_at)}</span><span>{minutes(article)} min</span></div><Link href={`/articles/${article.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300">Read article <ArrowRight className="h-4 w-4" /></Link></div>
              </article>
            ))}</div> : null}
          </>
        )}
      </section>
    </main>
  );
}
