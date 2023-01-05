import puppeteer from 'puppeteer';
import './extensions.js';

import serveStatic from 'serve-static';
import * as http from "http";
import {createHttpTerminator} from "http-terminator";
import fs from "fs-extra";

// @ts-ignore
import finalhandler from "finalhandler";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create static http file server
 *
 * @return Terminator function
 */
function createServer()
{
  const file = serveStatic('./dist');
  const server = http.createServer((req, res) => {
    req.addListener('end', () => file(req, res, finalhandler(req, res))).resume()
  })
  server.listen(22745)
  const terminator = createHttpTerminator({ server })
  return () => terminator.terminate()
}

export function screenshotPath(person: string) {
  return `dist/meta/${person}.jpeg`
}

export function screenshotUrl(person: string) {
  return screenshotPath(person).replace("dist/", "dist/CNAME".read_file())
}

// Render HTML component using puppeteer
export async function renderScreenshots(...people: string[])
{
  const terminate = createServer()
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({width: 700, height: 700, deviceScaleFactor: 2})

  for (const person of people)
  {
    // Load page
    await page.goto(`http://localhost:22745/__screenshot?p=${person}`)
    await sleep(1000)

    // Take screenshot of an element
    const element = await page.$("#info")
    await fs.ensureDir(screenshotPath(person).parent())
    await element.screenshot({ type: "jpeg", quality: 100, omitBackground: true, path: screenshotPath(person) })
  }

  await browser.close()
  await terminate()
}

// Debug with: node --no-warnings --loader ts-node/esm/transpile-only tools/render_image.ts
// await renderScreenshots("donotexist_A")
