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
import {renderScreenshots, screenshotUrl} from "./render_image.js";

const dist = "dist"
const data = "data-repo"

// Read host
const host = 'https://' + dist.join("CNAME").read_file().trim()

// Read html
const html = dist.join("index.original.html").read_file() ?? dist.join("index.html").read_file()
const title = "那些秋叶 - One Among Us"
const defaultImage = urljoin(dataHost, "meta.jpg")

// Backup existing index.html
fs.copyFileSync(dist.join("index.html"), dist.join("index.original.html"))

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
  const base = dist.join(url)
  await fs.ensureDir(base)
  fs.writeFileSync(base.join("index.html"), h)
}

async function createHtmlWithMarkdown(url: string, md: string, image?: string)
{
  const mdMeta = metadataParser(md)
  md = autocorrect.formatFor(mdMeta.content, 'markdown')
  const desc = mdMeta.metadata.metaDescription ?? md.replaceAll("\n", " ").substring(0, 100) + (md.length > 100 ? "..." : "")
  await createHtml(url, { title, desc, image }, h => h.replace("<!-- PLACEHOLDER_INJECT_SSO_CONTENT_HERE -->", marked(md)))
}

async function genMeta()
{
  const people: PersonMeta[] = data.join(`people-list.json`).read_file().json()

  // Create static pages
  // await createHtmlWithContent("/", "src/assets/home-top.md".read_file())
  await createHtmlWithMarkdown("/about", "src/assets/about.md".read_file())
  await createHtmlWithMarkdown("/__screenshot", "")

  // Create people pages
  for (const person of people)
  {
    const p = data.join(`people/${person.path}`)
    const md = p.join(`page.md`).read_file()
    const image = screenshotUrl(person.path, host)

    // Profile
    await createHtmlWithMarkdown(`/profile/${person.path}`, md, image)
    await createHtmlWithMarkdown(`/p/${person.path}`, md, image)

    // Edit info
    await createHtml(`/edit-info/${person.path}`, { title, desc: `编辑信息: ${person.name}`, image })

    // Channel backups (if exist)
    if (fs.existsSync(p.join(`backup`)))
    {
      for (const file of fs.readdirSync(p.join(`backup`)))
      {
        const meta = { title, desc: `${person.name} 的 ${file} 频道备份`, image }
        await createHtml(`/profile/${person.path}/backup/${file}`, meta)
        await createHtml(`/p/${person.path}/b/${file}`, meta)
      }
    }
  }

  // Create 404 fallback page
  fs.copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"))

  // Take screenshots
  console.log("Generating meta images by taking screenshots...")
  await renderScreenshots(...people.map(n => n.path))
}

console.log("Generating meta tags...")
await genMeta()
