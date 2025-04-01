import {marked} from "marked";
import sanitizeHtml from 'sanitize-html';

function markdownHandlers(s: string): string {
    if (/\|\|(?!\s)/.test(s)) {
        s = s.replace(/\|\|(.*?)\|\|/g, (match, inner) => {
            return `<span class="spoiler"><span>${inner}</span></span>`;
        })
    }
    if (/--(?!\s)/.test(s)) {
        s = s.replace(/--(.*?)--/g, (match, inner) => {
            return `<u>${inner}</u>>`;
        })
    }
    if (/__(?!\s)/.test(s)) {
        s = s.replace(/__(.*?)__/g, (match, inner) => {
            return `<i>${inner}</i>`;
        })
    }
    return s;
}

/**
 * SanitizeHTML options
 */
const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: [
        "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
        "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
        "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
        "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
        "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
        "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
        "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u",

        "img", "del"
    ],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
        i: ['emoji-src', 'emoji-orig']
    },
    allowedClasses: {
        span: ['spoiler'],
        i: ['custom-emoji']
    },
    selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false
}

export function sanitize(html: string) {
    return sanitizeHtml(html, sanitizeOptions)
}

export function mdParseInline(s: string) {
    return sanitize(marked.parseInline(markdownHandlers(s)))
}

export function mdParse(s: string) {
    return sanitize(marked.parse(markdownHandlers(s)))
}
