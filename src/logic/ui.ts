/**
 * Initialize clickable spoilers on the page
 */
import {marked} from "marked";

export function initSpoilers()
{
  const spoilers = document.querySelectorAll('.spoiler')

  console.log("Init spoilers")

  for (const spoiler of spoilers)
  {
    // Already initialized
    if (spoiler.classList.contains("spoiler-init")) continue
    spoiler.classList.add("spoiler-init")

    // Add event listener
    spoiler.addEventListener('click', event => {
      console.log('clicked', event);

      // If already shown, hide
      if (spoiler.classList.contains("spoiler-visible")) spoiler.classList.remove("spoiler-visible")
      else spoiler.classList.add("spoiler-visible")
    })
  }
}

/**
 * Spoiler markdown extension
 */
const spoilerExtension = {
  name: 'spoiler',
  level: 'inline',
  start(src) {
    return src.match(/\|\|(?!\s)/)?.index;
  },
  tokenizer(src) {
    const rule = /^\|\|(?!\s)([^\n]+)(?!\s)\|\|/;
    const match = rule.exec(src);

    if (match) {
      console.log(src, match) // This shows me multiple matches.
      return {
        type: 'spoiler',
        raw: match[0],
        inner: this.lexer.inlineTokens(match[1].trim())
      };
    }
  },
  renderer(token) {
    return `<span class="spoiler"><span>${this.parser.parseInline(token.inner)}</span></span>`;
  }
};

marked.use({extensions: [spoilerExtension]})

// console.log(marked.parseInline("Spoiler 测试： ||喵呜||喵呜"))

export function mdParseInline(s: string) {return marked.parseInline(s)}
export function mdParse(s: string) {return marked.parse(s)}
