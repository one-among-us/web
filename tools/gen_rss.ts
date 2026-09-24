/**
 * RSS, Atom, and JSON Feed Generator for One Among Us.
 *
 * Generates multilingual feeds (zh-CN, zh-TW, and en) for:
 * - Standard memorial entries
 * - notShowOnHome entries
 * - actualHide entries
 * - noname
 *
 * Excludes entries defined in data's exclude list or without valid page.md.
 */

import path from "path";
import fs from "fs-extra";
import { Feed, Item } from "feed";
import { marked } from "marked";
import metadataParser from "markdown-yaml-metadata-parser";
import autocorrect from "autocorrect-node";
import urljoin from "url-join";
import { convert } from "html-to-text";
import "./extensions.js";
import { PersonMeta } from "../src/logic/data.js";
import { dataHost } from "../src/logic/config.js";
import { screenshotUrl } from "./render_image.js";

const markedOptions = { async: false } as const;

export interface RssOptions {
  distDir?: string;
  dataDir?: string;
  host?: string;
}

interface LangConfig {
  /** Suffix appended to people-list and info JSON files (e.g. ".en", ".zh_hant", or "" for default) */
  fileSuffix: string;
  /** BCP-47 language tag for the feed's <language> field */
  langCode: string;
  /** Human-readable label used in feed titles */
  label: string;
  /** Output filename suffix (e.g. ".en" -> rss.en.xml; empty string for default) */
  outSuffix: string;
}

const LANGUAGES: LangConfig[] = [
  { fileSuffix: "", langCode: "zh-CN", label: "简体中文", outSuffix: "" },
  { fileSuffix: ".zh_hant", langCode: "zh-TW", label: "繁體中文", outSuffix: ".zh_hant" },
  { fileSuffix: ".en", langCode: "en", label: "English", outSuffix: ".en" },
];

/**
 * Determine MIME content-type based on image file extension.
 */
function resolveMimeType(imageUrl: string): string {
  const cleanUrl = imageUrl.split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".webp")) return "image/webp";
  if (cleanUrl.endsWith(".png")) return "image/png";
  if (cleanUrl.endsWith(".gif")) return "image/gif";
  if (cleanUrl.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

/**
 * Transform MDX/Markdown content into compliant HTML and a plain text summary:
 * 1. Replace placeholder variables (${path}, ${dataHost})
 * 2. Convert <PhotoScroll photos={[...]} /> into responsive Markdown image list
 * 3. Unwrap unsupported JSX/HTML custom tags while preserving text/formatting
 * 4. Format text spacing using autocorrect
 * 5. Convert Markdown to HTML and extract clean text summary
 */
function renderMarkdownContent(rawMarkdown: string, personPath: string): { html: string; textSummary: string } {
  const personDataUrl = urljoin(dataHost, "people", personPath);

  // Step 1: Replace project URL placeholders
  let md = rawMarkdown
    .replace(/\$\{path\}/g, personDataUrl)
    .replace(/\$\{dataHost\}/g, dataHost);

  // Step 2: Convert <PhotoScroll ... /> into standard Markdown images
  md = md.replace(/<PhotoScroll\s+photos=\{\[([\s\S]*?)\]\}\s*\/>/g, (_, photosArrayContent: string) => {
    const photoUrls = [...photosArrayContent.matchAll(/['"`](.*?)['"`]/g)].map(m => m[1].trim()).filter(Boolean);
    if (!photoUrls.length) return "";
    return "\n\n" + photoUrls.map(url => `![](${url})`).join("\n\n") + "\n\n";
  });

  // Step 3: Unwrap remaining custom JSX components, retaining inner contents
  md = md.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, "");
  md = md.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*>([\s\S]*?)<\/[A-Z][A-Za-z0-9]*>/g, "$1");

  // Step 4: Autocorrect text spacing
  md = autocorrect.formatFor(md, "markdown");

  // Step 5: Render Markdown to HTML
  const html = marked(md, markedOptions) as string;

  // Step 6: Extract clean text summary (skipping headers and images)
  const textSummary = convert(html, {
    selectors: [
      { selector: "h1", format: "skip" },
      { selector: "h2", format: "skip" },
      { selector: "h3", format: "skip" },
      { selector: "img", format: "skip" },
    ],
  }).replace(/\s+/g, " ").trim();

  return { html, textSummary };
}

/**
 * Resolve profile avatar image URL from info.json, or fallback to screenshot card.
 * Always reads the default (zh-hans) info.json since profileUrl is language-independent.
 */
function resolvePersonImage(personDir: string, personPath: string, host: string): string {
  const infoJsonPath = personDir.join("info.json");
  const rawInfo = infoJsonPath.read_file();
  if (rawInfo) {
    try {
      const info = JSON.parse(rawInfo);
      if (typeof info.profileUrl === "string" && info.profileUrl.trim()) {
        const personDataUrl = urljoin(dataHost, "people", personPath);
        return info.profileUrl
          .replace(/\$\{path\}/g, personDataUrl)
          .replace(/\$\{dataHost\}/g, dataHost);
      }
    } catch {
      // Ignore JSON parse errors
    }
  }
  return screenshotUrl(personPath, host);
}

/**
 * Parse publication date from sortKey or info.json died field.
 * Returns deterministic UTC midnight timestamp to prevent feed republish spikes.
 */
function resolvePublishDate(sortKey?: string, diedDate?: string): Date {
  const dateStr = (sortKey && /^\d{4}-\d{2}-\d{2}/.test(sortKey))
    ? sortKey
    : ((diedDate && /^\d{4}-\d{2}-\d{2}/.test(diedDate)) ? diedDate : null);

  if (dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
    }
  }

  // Deterministic fallback (project genesis date) for items without exact dates
  return new Date(Date.UTC(2020, 0, 1, 0, 0, 0));
}

/**
 * Scan all available people from data directory for a given language, including:
 * - standard entries
 * - notShowOnHome entries
 * - actualHide entries (switch pairs / triggered)
 * - noname
 * (only excluding items in data excludeList / without page.md)
 *
 * Uses the language-specific people-list for names, but always reads the default
 * info.json for sortKey (since died date is language-independent).
 */
function scanAllAvailablePeople(dataDir: string, fileSuffix: string): PersonMeta[] {
  const peopleMap = new Map<string, PersonMeta>();

  // Step 1: Read people-list{suffix}.json (contains standard + notShowOnHome + noname)
  const listFile = dataDir.join(`people-list${fileSuffix}.json`);
  const rawList = listFile.read_file();
  if (rawList) {
    const list: PersonMeta[] = JSON.parse(rawList);
    for (const p of list) {
      if (p.id) peopleMap.set(p.id, p);
    }
  }

  // Step 2: Discover actualHide entries by scanning people/ directory
  // (they are absent from people-list but have info.json + page.md)
  const peopleFolder = dataDir.join("people");
  if (fs.existsSync(peopleFolder)) {
    for (const dirName of fs.readdirSync(peopleFolder)) {
      if (dirName.startsWith(".") || peopleMap.has(dirName)) continue;
      const targetDir = peopleFolder.join(dirName);
      if (!fs.statSync(targetDir).isDirectory()) continue;

      // Use language-specific info if available, else fall back to default
      const infoSuffixes = [fileSuffix, ""].filter((v, i, a) => a.indexOf(v) === i);
      let info: any = null;
      for (const suffix of infoSuffixes) {
        const infoPath = targetDir.join(`info${suffix}.json`);
        if (fs.existsSync(infoPath) && fs.existsSync(targetDir.join("page.md"))) {
          try {
            info = JSON.parse(infoPath.read_file());
            break;
          } catch {
            // Ignore JSON parse errors
          }
        }
      }
      if (!info) continue;

      // Sort key from default info.json (died date is language-independent)
      let sortKey = "0";
      const defaultInfoPath = targetDir.join("info.json");
      if (fs.existsSync(defaultInfoPath)) {
        try {
          const defaultInfo = JSON.parse(defaultInfoPath.read_file());
          if (Array.isArray(defaultInfo.info)) {
            const died = defaultInfo.info.find((it: any[]) => it[0] === "逝世" || it[0] === "died");
            if (died && died[1]) sortKey = String(died[1]);
          }
        } catch {
          // Ignore JSON parse errors
        }
      }

      peopleMap.set(info.id || dirName, {
        path: dirName,
        id: info.id || dirName,
        name: info.name || dirName,
        profileUrl: info.profileUrl || `${dirName}/photos/profile.jpg`,
        sortKey,
      });
    }
  }

  return Array.from(peopleMap.values());
}

interface PageDateEntry {
  created: string;
  modified: string;
}

/**
 * Generate RSS, Atom, and JSON feeds for a single language.
 */
async function generateFeedsForLang(
  lang: LangConfig,
  host: string,
  distDir: string,
  dataDir: string,
): Promise<void> {
  const allPeople = scanAllAvailablePeople(dataDir, lang.fileSuffix);
  if (!allPeople.length) {
    console.warn(`[RSS/${lang.langCode}] No people entries found, skipping.`);
    return;
  }

  // 1. Load git page dates (merged into main & last modified on main)
  const pageDatesRaw = dataDir.join("page-dates.json").read_file();
  const pageDates: Record<string, PageDateEntry> = pageDatesRaw ? JSON.parse(pageDatesRaw) : {};

  // 2. Sort descending by creation date (when merged into main), fallback to sortKey
  const sortedPeople = allPeople.sort((a, b) => {
    const dateA = pageDates[a.path]?.created || pageDates[a.id]?.created || String(a.sortKey ?? "");
    const dateB = pageDates[b.path]?.created || pageDates[b.id]?.created || String(b.sortKey ?? "");
    return dateB.localeCompare(dateA);
  });

  // 3. Initialize Feed instance
  const outSuffix = lang.outSuffix;
  const feed = new Feed({
    title: `那些秋叶 - One Among Us (${lang.label})`,
    description: "A memorial website for transgender individuals and allies passed away.",
    id: host + "/",
    link: host + "/",
    language: lang.langCode,
    image: urljoin(host, "favicon.png"),
    favicon: urljoin(host, "favicon.png"),
    copyright: "All rights reserved, One Among Us",
    feedLinks: {
      rss2: urljoin(host, `rss${outSuffix}.xml`),
      atom: urljoin(host, `atom${outSuffix}.xml`),
      json: urljoin(host, `feed${outSuffix}.json`),
    },
    author: {
      name: "One Among Us",
      email: "info@one-among.us",
      link: host,
    },
  });

  // 4. Assemble feed items
  for (const person of sortedPeople) {
    const personDir = dataDir.join("people", person.path);

    let title = person.name;
    let explicitDesc = person.desc;
    let rawContent = "";
    let diedDate: string | undefined;

    // Load page content: prefer language-specific Markdown, fallback to page.md
    const mdSuffixes = [lang.fileSuffix, ""].filter((v, i, a) => a.indexOf(v) === i);
    for (const suffix of mdSuffixes) {
      const candidateMd = personDir.join(`page${suffix}.md`).read_file();
      if (candidateMd) {
        const mdMeta = metadataParser(candidateMd);
        if (mdMeta.metadata?.name) title = mdMeta.metadata.name;
        if (!explicitDesc && mdMeta.metadata?.desc) explicitDesc = mdMeta.metadata.desc;
        rawContent = mdMeta.content ?? "";
        break;
      }
    }

    // Prefer localized name/desc from language-specific info.json if available
    const localInfoSuffixes = [lang.fileSuffix, ""].filter((v, i, a) => a.indexOf(v) === i);
    for (const suffix of localInfoSuffixes) {
      const localInfoRaw = personDir.join(`info${suffix}.json`).read_file();
      if (!localInfoRaw) continue;
      try {
        const localInfo = JSON.parse(localInfoRaw);
        if (localInfo.name) title = localInfo.name;
        if (!explicitDesc && localInfo.desc) explicitDesc = localInfo.desc;
        // Extract died date from default info (language-independent)
        if (!suffix && Array.isArray(localInfo.info)) {
          const diedEntry = localInfo.info.find((item: any[]) => item[0] === "逝世" || item[0] === "died");
          if (diedEntry && diedEntry[1]) diedDate = String(diedEntry[1]);
        }
        break;
      } catch {
        // Ignore JSON parse errors
      }
    }

    const { html: contentHtml, textSummary } = renderMarkdownContent(rawContent, person.path);

    // Pick description: frontmatter desc -> first 180 chars of summary -> fallback title
    const description = explicitDesc || (textSummary
      ? textSummary.slice(0, 180) + (textSummary.length > 180 ? "..." : "")
      : title);

    const profileUrl = urljoin(host, "profile", person.path);
    const imageUrl = resolvePersonImage(personDir, person.path, host);

    // Resolve published date (when PR merged into main branch, fallback to died date)
    const pageDate = pageDates[person.path] || pageDates[person.id];
    let mainCreatedDate: Date | undefined;
    let mainModifiedDate: Date | undefined;

    if (pageDate?.created) {
      const parsed = new Date(pageDate.created);
      if (!isNaN(parsed.getTime())) mainCreatedDate = parsed;
    }
    if (pageDate?.modified) {
      const parsed = new Date(pageDate.modified);
      if (!isNaN(parsed.getTime())) mainModifiedDate = parsed;
    }

    const fallbackPubDate = resolvePublishDate(person.sortKey, diedDate);
    const publishedDate = mainCreatedDate || fallbackPubDate;
    const modifiedDate = mainModifiedDate || publishedDate;

    const item: Item = {
      title,
      id: profileUrl,
      link: profileUrl,
      description,
      content: contentHtml || description,
      date: modifiedDate, // Used for RSS 2.0 <pubDate> and Atom <updated>
      published: publishedDate, // Used for Atom <published> and JSON Feed date_published
      image: imageUrl,
      enclosure: {
        url: imageUrl,
        type: resolveMimeType(imageUrl),
      },
    };

    feed.addItem(item);
  }

  // 5. Format JSON Feed: in JSON Feed spec, date_published is creation/genesis date,
  // while date_modified indicates subsequent revisions. If a file was modified after
  // publication, include date_modified; otherwise omit it.
  const jsonFeedObj = JSON.parse(feed.json1());
  if (Array.isArray(jsonFeedObj.items)) {
    for (const feedItem of jsonFeedObj.items) {
      const matchedPerson = sortedPeople.find(p => urljoin(host, "profile", p.path) === feedItem.id || urljoin(host, "profile", p.path) === feedItem.url);
      const dates = matchedPerson ? (pageDates[matchedPerson.path] || pageDates[matchedPerson.id]) : undefined;
      // Only include date_modified if modified differs from created
      if (dates && dates.modified && dates.created && dates.modified !== dates.created) {
        feedItem.date_modified = dates.modified;
      } else {
        delete feedItem.date_modified;
      }
    }
  }

  // 6. Write feed files
  await fs.ensureDir(distDir);
  fs.writeFileSync(path.join(distDir, `rss${outSuffix}.xml`), feed.rss2());
  fs.writeFileSync(path.join(distDir, `atom${outSuffix}.xml`), feed.atom1());
  fs.writeFileSync(path.join(distDir, `feed${outSuffix}.json`), JSON.stringify(jsonFeedObj, null, 2));
  console.log(`[RSS/${lang.langCode}] Generated rss${outSuffix}.xml, atom${outSuffix}.xml, feed${outSuffix}.json (${sortedPeople.length} items).`);
}

/**
 * Generate RSS, Atom, and JSON feeds for all supported languages.
 */
export async function generateRssFeeds(options: RssOptions = {}) {
  const distDir = options.distDir ?? "dist";
  const dataDir = options.dataDir ?? "data-repo";

  // 1. Resolve host
  let host = options.host;
  if (!host) {
    const cnameContent = distDir.join("CNAME").read_file();
    host = cnameContent ? "https://" + cnameContent.trim() : "https://one-among.us";
  }

  // 2. Generate feeds concurrently
  await Promise.all(LANGUAGES.map(lang => generateFeedsForLang(lang, host!, distDir, dataDir)));
}
