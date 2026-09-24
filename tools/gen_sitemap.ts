import path from "path";
import fs from "fs-extra";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import "./extensions.js";
import { PersonMeta } from "../src/logic/data.js";

export interface SitemapOptions {
  distDir?: string;
  dataDir?: string;
  host?: string;
}

interface SitemapItem {
  url: string;
  lastmod?: string;
}

interface PageDateEntry {
  created: string;
  modified: string;
}

/**
 * Generate standard sitemap.xml for One Among Us:
 * - Only includes regular entries (excludes notShowOnHome, actualHide, and exclude)
 * - Includes noname
 * - Includes lastmod derived from data repo's main branch git commit history (page-dates.json)
 * - Omits deprecated changefreq and priority
 */
export async function generateSitemap(options: SitemapOptions = {}) {
  const distDir = options.distDir ?? "dist";
  const dataDir = options.dataDir ?? "data-repo";

  // 1. Resolve host
  let host = options.host;
  if (!host) {
    const cnameContent = distDir.join("CNAME").read_file();
    host = cnameContent ? "https://" + cnameContent.trim() : "https://one-among.us";
  }

  // 2. Load git page dates
  const pageDatesRaw = dataDir.join("page-dates.json").read_file();
  const pageDates: Record<string, PageDateEntry> = pageDatesRaw ? JSON.parse(pageDatesRaw) : {};

  // 3. Collect URLs
  const items: SitemapItem[] = [
    { url: "/" },
    { url: "/about" },
  ];

  // 4. Populate from people-home-list (standard entries + noname only)
  const homeListRaw = dataDir.join("people-home-list.json").read_file();
  if (homeListRaw) {
    const people: PersonMeta[] = JSON.parse(homeListRaw);

    for (const person of people) {
      const rawDate = pageDates[person.path]?.modified || pageDates[person.id]?.modified;
      const lastmod = rawDate || undefined;

      items.push({
        url: `/profile/${person.path}`,
        lastmod,
      });

      // Add channel backups if they exist
      const backupDir = dataDir.join("people", person.path, "backup");
      if (fs.existsSync(backupDir)) {
        for (const file of fs.readdirSync(backupDir)) {
          items.push({
            url: `/profile/${person.path}/backup/${file}`,
            lastmod,
          });
        }
      }
    }
  }

  // 5. Build sitemap using sitemap library (handles XML escaping, encoding, namespace, lastmod)
  const stream = new SitemapStream({ hostname: host });
  const data = await streamToPromise(
    Readable.from(items).pipe(stream)
  );

  await fs.ensureDir(distDir);
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), data.toString());
  console.log(`[Sitemap] Generated sitemap.xml with ${items.length} URLs.`);
}
