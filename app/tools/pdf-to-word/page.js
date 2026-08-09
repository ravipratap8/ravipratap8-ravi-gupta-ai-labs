'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Loader2, ShieldCheck, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PdfToWordPage() {
  const [name, setName] = useState('');
  const [pages, setPages] = useState([]);
  const [working, setWorking] = useState(false);

  async function chooseFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return alert('Please choose a PDF file.');
    setWorking(true);
    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const extracted = [];
      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        let currentY = null;
        let line = '';
        const lines = [];
        for (const item of content.items) {
          if (!('str' in item)) continue;
          const y = Math.round(item.transform?.[5] || 0);
          if (currentY !== null && Math.abs(y - currentY) > 3) {
            if (line.trim()) lines.push(line.trim());
            line = '';
          }
          line += `${item.str}${item.hasEOL ? '' : ' '}`;
          currentY = y;
          if (item.hasEOL) { if (line.trim()) lines.push(line.trim()); line = ''; }
        }
        if (line.trim()) lines.push(line.trim());
        extracted.push({ pageNo, lines });
      }
      const totalText = extracted.reduce((sum, page) => sum + page.lines.join(' ').trim().length, 0);
      if (totalText < 20) {
        setPages([]);
        alert('This PDF appears to be scanned or image-only. OCR is required before it can be converted reliably to Word.');
        return;
      }
      setName(file.name.replace(/\.pdf$/i, ''));
      setPages(extracted);
    } catch (error) {
      alert(error.message || 'Unable to extract text from this PDF.');
    } finally {
      setWorking(false);
    }
  }

  async function downloadWord() {
    if (!pages.length) return;
    setWorking(true);
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } = await import('docx');
      const children = [];
      pages.forEach((page, index) => {
        children.push(new Paragraph({ text: `Page ${page.pageNo}`, heading: HeadingLevel.HEADING_2, spacing: { before: index ? 240 : 0, after: 120 } }));
        page.lines.forEach((line) => children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })], spacing: { after: 100 } })));
        if (index < pages.length - 1) children.push(new Paragraph({ children: [new PageBreak()] }));
      });
      const doc = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${name || 'converted'}.docx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message || 'Word document generation failed.');
    } finally {
      setWorking(false);
    }
  }

  const charCount = pages.reduce((sum, page) => sum + page.lines.join(' ').length, 0);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Useful Tools</Link>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-10">
          <div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><FileText className="h-6 w-6" /></div><div><h1 className="font-display text-3xl font-bold md:text-4xl">PDF to Word</h1><p className="mt-2 text-slate-400">Extract readable text from a PDF and download it as an editable .docx document. Best for text-based PDFs.</p></div></div>
          <div className="mt-8 flex flex-wrap gap-3"><label className="inline-flex cursor-pointer items-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"><UploadCloud className="mr-2 h-4 w-4" /> Choose PDF<input type="file" accept="application/pdf,.pdf" className="hidden" onChange={chooseFile} /></label>{pages.length ? <Button onClick={downloadWord} disabled={working} className="bg-white text-slate-950 hover:bg-slate-200">{working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download Word</Button> : null}</div>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4" /> The PDF is processed in your browser. Scanned/image-only PDFs require OCR and are not silently sent to an external service.</div>
        </div>
        {pages.length ? <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-bold">Extraction preview</h2><span className="text-xs text-slate-500">{pages.length} pages • {charCount.toLocaleString()} characters</span></div><div className="mt-5 max-h-[620px] space-y-6 overflow-y-auto pr-2 scrollbar-thin">{pages.map((page) => <section key={page.pageNo} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"><h3 className="text-sm font-semibold text-cyan-300">Page {page.pageNo}</h3><div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">{page.lines.slice(0, 80).map((line, index) => <p key={index}>{line}</p>)}</div></section>)}</div></div> : null}
      </div>
    </main>
  );
}
