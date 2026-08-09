function escapeAttr(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function safeHttpUrl(value = '') {
  try {
    const url = new URL(String(value).trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function safeLink(value = '') {
  const raw = String(value).trim();
  if (/^(mailto:|\/|#)/i.test(raw)) return raw;
  return safeHttpUrl(raw);
}

function safeImageUrl(value = '') {
  return safeHttpUrl(value);
}

function safeYoutubeEmbed(value = '') {
  const raw = safeHttpUrl(value);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');
    if (!['youtube.com', 'youtube-nocookie.com'].includes(host)) return '';
    if (!url.pathname.startsWith('/embed/')) return '';
    return url.toString();
  } catch {
    return '';
  }
}

export function sanitizeArticleHtml(input = '') {
  let html = String(input || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(?:script|style|object|embed|form|input|button|textarea|select|option|svg|math|meta|link)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\sstyle\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  const allowed = new Set(['p','br','h2','h3','h4','strong','b','em','i','u','s','ul','ol','li','blockquote','a','pre','code','hr','figure','img','figcaption','iframe','aside']);

  html = html.replace(/<\s*(\/?)\s*([a-z0-9]+)([^>]*)>/gi, (full, closing, tagName, attrs = '') => {
    const tag = tagName.toLowerCase();
    if (!allowed.has(tag)) return '';
    if (closing) return ['br','hr','img'].includes(tag) ? '' : `</${tag}>`;
    if (tag === 'br' || tag === 'hr') return `<${tag}>`;

    if (tag === 'a') {
      const match = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = safeLink(match?.[1] || match?.[2] || match?.[3] || '');
      return href ? `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">` : '<a>';
    }

    if (tag === 'img') {
      const srcMatch = attrs.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const altMatch = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const src = safeImageUrl(srcMatch?.[1] || srcMatch?.[2] || srcMatch?.[3] || '');
      const alt = altMatch?.[1] || altMatch?.[2] || altMatch?.[3] || '';
      return src ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy">` : '';
    }

    if (tag === 'iframe') {
      const srcMatch = attrs.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const src = safeYoutubeEmbed(srcMatch?.[1] || srcMatch?.[2] || srcMatch?.[3] || '');
      return src ? `<iframe src="${escapeAttr(src)}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : '';
    }

    if (tag === 'figure') return '<figure data-article-image="true">';
    if (tag === 'aside') return '<aside data-reference-card="true">';
    return `<${tag}>`;
  });

  return html.trim();
}

export function stripArticleHtml(input = '') {
  return sanitizeArticleHtml(input)
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function createExcerpt(html, maxLength = 220) {
  const text = stripArticleHtml(html);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
}

export function slugifyArticleTitle(value = '') {
  return String(value).toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100);
}

export function addHeadingIds(html = '') {
  const used = new Set();
  return sanitizeArticleHtml(html).replace(/<(h2|h3)>([\s\S]*?)<\/\1>/gi, (full, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
    let id = slugifyArticleTitle(text) || 'section';
    const base = id;
    let count = 2;
    while (used.has(id)) id = `${base}-${count++}`;
    used.add(id);
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
}

export function extractHeadings(html = '') {
  const withIds = addHeadingIds(html);
  const headings = [];
  const regex = /<(h2|h3) id="([^"]+)">([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = regex.exec(withIds))) {
    headings.push({ level: match[1] === 'h2' ? 2 : 3, id: match[2], text: match[3].replace(/<[^>]+>/g, '').trim() });
  }
  return { html: withIds, headings };
}
