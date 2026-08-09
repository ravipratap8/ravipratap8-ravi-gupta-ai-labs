'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Loader2, ShieldCheck, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';


function cleanPreviewHtml(input = '') {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  doc.querySelectorAll('script,style,iframe,object,embed,form,input,button').forEach((node) => node.remove());
  doc.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) node.removeAttribute(attr.name);
      if (name === 'href' && /^javascript:/i.test(attr.value)) node.removeAttribute(attr.name);
    });
  });
  return doc.body.innerHTML;
}

export default function WordToPdfPage() {
  const previewRef = useRef(null);
  const [name, setName] = useState('');
  const [html, setHtml] = useState('');
  const [working, setWorking] = useState(false);
  const [messages, setMessages] = useState([]);

  async function chooseFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.docx')) return alert('Please choose a .docx Word document.');
    setWorking(true);
    try {
      const mammoth = await import('mammoth/mammoth.browser');
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      setName(file.name.replace(/\.docx$/i, ''));
      setHtml(cleanPreviewHtml(result.value));
      setMessages(result.messages || []);
    } catch (error) {
      alert(error.message || 'Unable to read this Word document.');
    } finally {
      setWorking(false);
    }
  }

  async function downloadPdf() {
    if (!previewRef.current) return;
    setWorking(true);
    try {
      const module = await import('html2pdf.js');
      const html2pdf = module.default || module;
      await html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: `${name || 'document'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      }).from(previewRef.current).save();
    } catch (error) {
      alert(error.message || 'PDF conversion failed.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Useful Tools</Link>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-10">
          <div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><FileText className="h-6 w-6" /></div><div><h1 className="font-display text-3xl font-bold md:text-4xl">Word to PDF</h1><p className="mt-2 text-slate-400">Choose a .docx file, review the converted preview and download a PDF. Processing happens in your browser.</p></div></div>
          <div className="mt-8 flex flex-wrap items-center gap-3"><label className="inline-flex cursor-pointer items-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"><UploadCloud className="mr-2 h-4 w-4" /> Choose Word document<input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={chooseFile} /></label>{html ? <Button onClick={downloadPdf} disabled={working} className="bg-white text-slate-950 hover:bg-slate-200">{working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download PDF</Button> : null}</div>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4" /> Your document is not sent to Ravi Gupta AI Labs servers.</div>
          {messages.length ? <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">Some advanced Word formatting may be simplified during browser conversion.</div> : null}
        </div>
        {html ? <div className="mt-8 overflow-auto rounded-3xl border border-white/10 bg-slate-800 p-4 md:p-8"><div ref={previewRef} className="mx-auto min-h-[1120px] w-full max-w-[794px] bg-white p-8 text-slate-900 shadow-2xl md:p-14"><div className="document-preview" dangerouslySetInnerHTML={{ __html: html }} /></div></div> : null}
      </div>
    </main>
  );
}
