import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileDown, FileUp, ShieldCheck, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Useful Tools | Ravi Gupta',
  description: 'Simple, privacy-minded browser tools from Ravi Gupta AI Labs.',
};

const TOOLS = [
  { title: 'Word to PDF', description: 'Convert a .docx file to PDF directly in your browser. Your document is processed locally on your device.', href: '/tools/word-to-pdf', icon: FileDown },
  { title: 'PDF to Word', description: 'Extract text from a text-based PDF and download it as an editable Word document, processed locally in your browser.', href: '/tools/pdf-to-word', icon: FileUp },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-sm font-bold text-slate-950">RG</span><div className="leading-tight"><p className="font-display text-sm font-bold">Ravi Gupta</p><p className="text-[11px] text-cyan-400">AI Labs</p></div></Link><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to portfolio</Link></div></header>
      <section className="relative overflow-hidden border-b border-white/10"><div className="absolute inset-0 bg-grid opacity-30" /><div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28"><div className="max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-300"><Wrench className="h-4 w-4" /> Useful Tools</div><h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">Small tools that save real time.</h1><p className="mt-5 text-lg leading-relaxed text-slate-300">A growing collection of practical utilities. Wherever possible, files are processed locally in your browser rather than uploaded to a server.</p></div></div></section>
      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20"><div className="grid gap-6 md:grid-cols-2">{TOOLS.map(({ title, description, href, icon: Icon }) => <Link key={href} href={href} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition hover:-translate-y-1 hover:border-cyan-400/30"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon className="h-6 w-6" /></div><h2 className="mt-5 font-display text-2xl font-bold">{title}</h2><p className="mt-3 leading-relaxed text-slate-400">{description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400">Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div><div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><ShieldCheck className="h-4 w-4" /> More tools can be added here without changing the portfolio structure.</div></section>
    </main>
  );
}
