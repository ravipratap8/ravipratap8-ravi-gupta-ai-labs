const ALLOWED_TAGS = new Set([
  'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
  'ul', 'ol', 'li', 'blockquote', 'a', 'pre', 'code', 'hr'
]);

function safeHref(value = '') {
  const href = String(value).trim();
  if (!href) return '';
  if (href.startsWith('/') || href.startsWith('#')) return href;
  try {
    const url = new URL(href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? href : '';
  } catch {
    return '';
  }
}

export function sanitizeArticleHtml(input = '') {
  let html = String(input);

  html = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form|input|button|svg|math)[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form|input|button|svg|math)\b[^>]*\/?>/gi, '');

  return html.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, rawTag, rawAttrs) => {
    const tag = rawTag.toLowerCase();
    const closing = /^<\//.test(match);

    if (!ALLOWED_TAGS.has(tag)) return '';
    if (closing) return `</${tag}>`;
    if (tag === 'br' || tag === 'hr') return `<${tag}>`;

    if (tag === 'a') {
      const hrefMatch = rawAttrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = safeHref(hrefMatch?.[1] || hrefMatch?.[2] || hrefMatch?.[3] || '');
      if (!href) return '<a>';
      const escaped = href
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<a href="${escaped}" target="_blank" rel="noopener noreferrer">`;
    }

    return `<${tag}>`;
  });
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
  return String(value)
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}
