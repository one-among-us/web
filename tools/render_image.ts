import puppeteer from 'puppeteer';
import './extensions.js';

import serveStatic from 'serve-static';
import * as http from "http";
import {createHttpTerminator} from "http-terminator";
import fs from "fs-extra";

// @ts-ignore
import finalhandler from "finalhandler";
import urljoin from "url-join";

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

export function screenshotUrl(person: string, host: string) {
  return urljoin(host, screenshotPath(person).replace("dist", ""))
}

// Render HTML component using puppeteer
export async function renderScreenshots(...people: string[])
{
  const terminate = createServer()
  const browser = await puppeteer.launch({ headless: true,
    args: ['--no-sandbox', '--lang=zh-CN,zh'],
    executablePath: '/usr/bin/google-chrome-stable', // set by docker container
  })
  for (const person of people)
  {
    const page = await browser.newPage()
    await page.setViewport({width: 700, height: 700, deviceScaleFactor: 2})
    
    // Set language to Simplified Chinese
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    })
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "language", {
          get: () => { return "zh-CN" }
      });
      Object.defineProperty(navigator, "languages", {
          get: () => { return ["zh-CN", "zh"] }
      });
    });

    try {
      // Load page
      await page.goto(`http://localhost:22745/__screenshot?p=${person}`)
      await sleep(1000)

      // Take screenshot of an element
      const element = await page.waitForSelector("#info", { timeout: 60000 })

      if (element) {
        await fs.ensureDir(screenshotPath(person).parent())
        await element.screenshot({ type: "jpeg", quality: 100, omitBackground: true, path: screenshotPath(person) })
      }
    } catch (e) {
      console.error(`Error processing ${person}:`, e);
    } finally {
      await page.close()
    }
  }

  await browser.close()
  await terminate()
}

// Debug with: node --no-warnings --loader ts-node/esm/transpile-only tools/render_image.ts
// await renderScreenshots("donotexist_A")
