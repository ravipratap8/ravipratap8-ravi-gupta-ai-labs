import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Linkedin, Clock3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { stripArticleHtml } from '@/lib/articles/sanitize';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('articles').select('title, excerpt').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (!data) return { title: 'Article | Ravi Gupta' };
  return { title: `${data.title} | Ravi Gupta`, description: data.excerpt };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (!article) notFound();

  const words = stripArticleHtml(article.content_html).split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(words / 220));
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://ravigupta.dev/articles/${article.slug}`)}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-sm font-bold text-slate-950">RG</span><div className="leading-tight"><p className="font-display text-sm font-bold">Ravi Gupta</p><p className="text-[11px] text-cyan-400">AI Labs</p></div></Link>
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        </div>
      </header>

      {article.featured_image_url ? <div className="mx-auto max-w-6xl px-5 pt-10"><img src={article.featured_image_url} alt="" className="max-h-[520px] w-full rounded-3xl border border-white/10 object-cover" /></div> : null}

      <article className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {formatDate(article.published_at)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> {readMinutes} min read</span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">{article.title}</h1>
        {article.excerpt ? <p className="mt-6 text-xl leading-relaxed text-slate-300">{article.excerpt}</p> : null}

        <div className="article-content mt-10" dangerouslySetInnerHTML={{ __html: article.content_html }} />

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <div><p className="font-display font-semibold">Ravi Gupta</p><p className="text-sm text-slate-400">AI Engineering • Quality Engineering • Technology Leadership</p></div>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/15"><Linkedin className="h-4 w-4" /> Share on LinkedIn</a>
        </div>
      </article>
    </main>
  );
}
