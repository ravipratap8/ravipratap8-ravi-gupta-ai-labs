'use client';

import { useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { toast } from 'sonner';
import {
  Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, ListOrdered,
  Quote, Code2, Minus, Link2, Unlink, ImagePlus, Youtube as YoutubeIcon,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, ExternalLink, Upload, Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FigureImage = Node.create({
  name: 'figureImage',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    };
  },
  parseHTML() {
    return [{
      tag: 'figure[data-article-image]',
      getAttrs: (node) => ({
        src: node.querySelector('img')?.getAttribute('src') || '',
        alt: node.querySelector('img')?.getAttribute('alt') || '',
        caption: node.querySelector('figcaption')?.textContent || '',
      }),
    }];
  },
  renderHTML({ HTMLAttributes }) {
    const children = [
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt || '', loading: 'lazy' }],
    ];
    if (HTMLAttributes.caption) children.push(['figcaption', {}, HTMLAttributes.caption]);
    return ['figure', { 'data-article-image': 'true' }, ...children];
  },
  addCommands() {
    return {
      setFigureImage: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }),
    };
  },
});

const ReferenceCard = Node.create({
  name: 'referenceCard',
  group: 'block',
  atom: true,
  addAttributes() {
    return { url: { default: '' }, title: { default: 'Reference' }, note: { default: '' } };
  },
  parseHTML() {
    return [{
      tag: 'aside[data-reference-card]',
      getAttrs: (node) => ({
        url: node.querySelector('a')?.getAttribute('href') || '',
        title: node.querySelector('a')?.textContent || 'Reference',
        note: node.querySelectorAll('p')?.[1]?.textContent || '',
      }),
    }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['aside', { 'data-reference-card': 'true' },
      ['p', { class: 'reference-label' }, 'Reference'],
      ['a', { href: HTMLAttributes.url, target: '_blank', rel: 'noopener noreferrer' }, HTMLAttributes.title || HTMLAttributes.url],
      ...(HTMLAttributes.note ? [['p', { class: 'reference-note' }, HTMLAttributes.note]] : []),
    ];
  },
  addCommands() {
    return {
      setReferenceCard: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }),
    };
  },
});

function ToolbarButton({ title, active, onClick, children }) {
  return (
    <Button type="button" variant={active ? 'secondary' : 'ghost'} size="icon" title={title} onClick={onClick} className="h-9 w-9">
      {children}
    </Button>
  );
}

export default function ArticleEditor({ value, onChange, uploadImage }) {
  const imageInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true, defaultProtocol: 'https', HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Image,
      FigureImage,
      Youtube.configure({ nocookie: true, controls: true, allowFullscreen: true, width: 960, height: 540 }),
      ReferenceCard,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write here, paste from Word, or use the toolbar to add images, video and references…' }),
    ],
    content: value || '',
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: {
      attributes: { class: 'article-editor-pro min-h-[560px] focus:outline-none' },
    },
  });

  if (!editor) return <div className="min-h-[560px] animate-pulse rounded-xl bg-muted/40" />;

  const addLink = () => {
    const current = editor.getAttributes('link').href || '';
    const url = window.prompt('Paste the URL', current);
    if (url === null) return;
    if (!url.trim()) return editor.chain().focus().extendMarkRange('link').unsetLink().run();
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const addYoutube = () => {
    const url = window.prompt('Paste a YouTube URL');
    if (!url) return;
    try {
      editor.commands.setYoutubeVideo({ src: url.trim(), width: 960, height: 540 });
    } catch {
      toast.error('That does not look like a valid YouTube URL.');
    }
  };

  const editSelectedImage = () => {
    if (!editor.isActive('figureImage')) return toast.info('Click an inserted image first.');
    const current = editor.getAttributes('figureImage');
    const alt = window.prompt('Image description / alt text', current.alt || '') ?? current.alt;
    const caption = window.prompt('Image caption', current.caption || '') ?? current.caption;
    editor.chain().focus().updateAttributes('figureImage', { alt: String(alt || '').trim(), caption: String(caption || '').trim() }).run();
  };

  const addReference = () => {
    const url = window.prompt('Paste the reference/source URL');
    if (!url) return;
    let defaultTitle = 'Open source';
    try { defaultTitle = new URL(url).hostname.replace(/^www\./, ''); } catch {}
    const title = window.prompt('Reference title', defaultTitle) || defaultTitle;
    const note = window.prompt('Optional short note about why this source matters', '') || '';
    editor.commands.setReferenceCard({ url: url.trim(), title: title.trim(), note: note.trim() });
  };

  const onImageSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const alt = window.prompt('Image description / alt text', file.name.replace(/\.[^.]+$/, '')) || '';
      const caption = window.prompt('Optional image caption', '') || '';
      editor.commands.setFigureImage({ src: url, alt: alt.trim(), caption: caption.trim() });
      toast.success('Image inserted into the article');
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onImageSelected} />
      <div className="sticky top-16 z-10 flex flex-wrap gap-1 border-b bg-card/95 p-2 backdrop-blur">
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-9 w-px bg-border" />
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Strike" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-9 w-px bg-border" />
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-9 w-px bg-border" />
        <ToolbarButton title="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Align centre" onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-9 w-px bg-border" />
        <ToolbarButton title="Add/edit link" active={editor.isActive('link')} onClick={addLink}><Link2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}><Unlink className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Insert image" onClick={() => imageInputRef.current?.click()}>{uploading ? <Upload className="h-4 w-4 animate-pulse" /> : <ImagePlus className="h-4 w-4" />}</ToolbarButton>
        <ToolbarButton title="Edit selected image caption/alt text" active={editor.isActive('figureImage')} onClick={editSelectedImage}><Pencil className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Embed YouTube video" onClick={addYoutube}><YoutubeIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Add reference card" onClick={addReference}><ExternalLink className="h-4 w-4" /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
