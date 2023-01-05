import path from "path";
import fs from "fs-extra";

import './extensions.js'
import {dataHost} from "../src/logic/config.js";
import {PersonMeta} from "../src/logic/data.js";
import {marked} from "marked";
import urljoin from "url-join";


const dist = "dist"
const html = path.join(dist, "index.html").read_file()
const title = "那些秋叶 - One Among Us"
// TODO: Change this to actual deployment path (since we cannot use relative paths here)
const defaultImage = urljoin(dataHost, "meta.jpg")

interface Meta {
  title: string
  desc: string
  image?: string
  url?: string
}

function createMeta(meta: Meta): string
{
  const { title, desc, image, url } = meta
  return `
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}">
    <meta name="description" content="${desc}">
  
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
  
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${desc}">
  ` + (url ? `
    <meta property="og:url" content="${url}">
    <meta property="twitter:url" content="${url}">
  ` : '') + `
    <meta property="og:image" content="${image ?? defaultImage}">
    <meta property="twitter:image" content="${image ?? defaultImage}">
  `
}

async function createHtml(url: string, meta: Meta, transform?: (string) => string)
{
  // TODO: Add url parameter in meta
  let h = html.replace("<!-- PLACEHOLDER_INJECT_META_INFORMATION_HERE -->", createMeta(meta))
  if (transform) h = transform(h)

  // Write to path
  const base = path.join(dist, url)
  await fs.ensureDir(base)
  fs.writeFileSync(path.join(base, "index.html"), h)
}

async function createHtmlWithMarkdown(url: string, md: string)
{
  md = md.replace("\n", " ")
  await createHtml(url, { title, desc: md.substring(0, 100) + (md.length > 100 ? "..." : "") },
      h => h.replace("<!-- PLACEHOLDER_INJECT_SSO_CONTENT_HERE -->", marked(md)))
}

async function genMeta()
{
  const people: PersonMeta[] = await (dataHost + "/people-list.json").fetch_json()

  // Create static pages
  // await createHtmlWithContent("/", "src/assets/home-top.md".read_file())
  await createHtmlWithMarkdown("/about", "src/assets/about.md".read_file())

  // Create people pages
  for (const person of people)
  {
    // Profile
    await createHtml(`/profile/${person.path}`, { title, desc: `TODO`, image: person.profileUrl })

    // Edit info
    await createHtml(`/edit-info/${person.path}`, { title, desc: `编辑信息: ${person.name}` })
  }
}

console.log("Generating meta tags...")
await genMeta()
