/**
 * READ THIS BEFORE RUNNING THE SCRIPT
 *
 * Please clone the data repo's built files before running this script. Generating description content depends on the
 * data repo. You can do: `git clone -b gh-pages https://github.com/one-among-us/data data-repo`
 */

import path from "path";
import fs from "fs-extra";

import './extensions.js'
import {dataHost} from "../src/logic/config.js";
import {PersonMeta} from "../src/logic/data.js";
import {marked} from "marked";
import metadataParser from 'markdown-yaml-metadata-parser';
import autocorrect from "autocorrect-node";
import urljoin from "url-join";
import {convert} from 'html-to-text';
import {renderScreenshots, screenshotUrl} from "./render_image.js";
import {optimize_font} from "./optimize_font.js";

const dist = "dist"
const data = "data-repo"

// Read host
const host = 'https://' + dist.join("CNAME").read_file().trim()

// Read html
const html = dist.join("index.original.html").read_file() ?? dist.join("index.html").read_file()
const title = "那些秋叶 - One Among Us"
const defaultImage = urljoin(dataHost, "meta.jpg")

// Backup existing index.html
fs.writeFileSync(dist.join("index.original.html"), html)

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
    <link rel="canonical" href="${url}" />
  ` : '') + `
    <meta property="og:image" content="${image ?? defaultImage}">
    <meta property="twitter:image" content="${image ?? defaultImage}">
  `
}

interface UrlSet {
  path: string
  canonical: string
}

async function createHtml(url: string | UrlSet, meta: Meta, transform?: (string) => string)
{
  if (!meta.url) meta.url = urljoin(host, typeof url == 'string' ? url : url.canonical)
  let h = html.replace("<!-- PLACEHOLDER_INJECT_META_INFORMATION_HERE -->", createMeta(meta))
  if (transform) h = transform(h)

  // Write to path
  const base = dist.join(typeof url == 'string' ? url : url.path)
  await fs.ensureDir(base)
  fs.writeFileSync(base.join("index.html"), h)
}

const htmlStrip = {
  selectors: [
    {selector: 'h1', format: 'skip'},
    {selector: 'h2', format: 'skip'},
    {selector: 'h3', format: 'skip'},
  ]
}

async function createHtmlWithMarkdown(url: string | UrlSet, md: string, image?: string)
{
  const mdMeta = metadataParser(md)
  md = autocorrect.formatFor(mdMeta.content, 'markdown')
  const genDesc = convert(marked(md), htmlStrip).replaceAll("\n", " ")
  const desc = mdMeta.metadata.metaDescription ?? genDesc.substring(0, 100) + (genDesc.length > 100 ? "..." : "")
  await createHtml(url, { title, desc, image }, h => h.replace("<!-- PLACEHOLDER_INJECT_SSO_CONTENT_HERE -->", marked(md)))
}

async function genMeta()
{
  const people: PersonMeta[] = data.join(`people-list.json`).read_file().json()

  // Create static pages
  await createHtmlWithMarkdown("/", "src/assets/home-top.md".read_file())
  await createHtmlWithMarkdown("/about", "src/assets/about.md".read_file())
  await createHtmlWithMarkdown("/__screenshot", "")

  // Track characters in markdown
  const characters = new Set()
  const addChars = (str: string) => { for (const char of str) characters.add(char) }
  const addCharsFile = (file: string) => addChars(file.read_file() ?? "")

  addChars("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ网站")

  // Create people pages
  for (const person of people)
  {
    const p = data.join(`people/${person.path}`)
    const md = p.join(`page.md`).read_file()
    const image = screenshotUrl(person.path, host)

    // Track characters
    addCharsFile(p.join(`info.json`))
    addCharsFile(p.join(`info.zh_hant.json`))

    // Profile
    const pUrl = `/profile/${person.path}`
    await createHtmlWithMarkdown(pUrl, md, image)
    await createHtmlWithMarkdown({ path: `/p/${person.path}`, canonical: pUrl }, md, image)

    // Edit info
    await createHtml(`/edit-info/${person.path}`, { title, desc: `编辑信息: ${person.name}`, image })

    // Channel backups (if exist)
    if (fs.existsSync(p.join(`backup`)))
    {
      for (const file of fs.readdirSync(p.join(`backup`)))
      {
        const meta = { title, desc: `${person.name} 的 ${file} 频道备份`, image }
        const bUrl = urljoin(pUrl, `backup/${file}`)
        await createHtml(bUrl, meta)
        await createHtml({ path: urljoin(pUrl, `b/${file}`), canonical: bUrl }, meta)
      }
    }
  }

  // Create 404 fallback page
  fs.copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"))
  console.log("> Meta generated.")

  // Optimize font
  console.log("Optimizing font...")
  await optimize_font(dist.join('fonts/FZSJ-HUAZCMWWKQ.woff2'), Array.from(characters).join(''), dist)
  console.log("> Font optimized.")

  // Take screenshots
  console.log("Generating meta images by taking screenshots...")
  await renderScreenshots(...people.map(n => n.path))
  console.log("> Screenshots generated.")
}

console.log("Generating meta tags...")
await genMeta()
