import path from "path";
import fs from "fs-extra";

import {dataHost} from "../src/logic/config.js";
import {PersonMeta} from "../src/logic/data.js";


const dist = "dist"
const html = fs.readFileSync(path.join(dist, "index.html")).toString()
const title = "那些秋叶 - One Among Us"


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
  ` : '') + (image? `
    <meta property="og:image" content="${image}">
    <meta property="twitter:image" content="${image}">
  ` : '')
}

async function createHtml(url: string, meta: Meta)
{
  // TODO: Add url parameter in meta
  const h = html.replace("<!-- PLACEHOLDER_INJECT_META_INFORMATION_HERE -->", createMeta(meta))

  // Write to path
  const base = path.join(dist, url)
  await fs.ensureDir(base)
  fs.writeFileSync(path.join(base, "index.html"), h)
}

async function genMeta()
{
  const people: PersonMeta[] = await (await fetch(dataHost + "/people-list.json")).json()

  // Create static pages
  const main_meta = {title: "Test", desc: "hi"}
  await createHtml("/about", main_meta)

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
