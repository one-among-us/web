import puppeteer from 'puppeteer';
import './extensions.js';

import serveStatic from 'serve-static';
import * as http from "http";
import {createHttpTerminator} from "http-terminator";
import fs from "fs-extra";

import finalhandler from "finalhandler";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Create HTTP server
const file = serveStatic('./dist');
const server = http.createServer((req, res) => {
  req.addListener('end', () => file(req, res, finalhandler(req, res))).resume()
})
server.listen(22745)
const terminator = createHttpTerminator({ server })

// Render HTML component using puppeteer
export async function render(...people: string[])
{
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({width: 700, height: 700})

  for (const person of people)
  {
    // Load page
    await page.goto(`http://localhost:22745/__screenshot?p=${person}`)
    await sleep(1000)

    // Take screenshot of an element
    const element = await page.$("#info")
    await fs.ensureDir("dist/meta")
    await element.screenshot({ type: "jpeg", quality: 100, omitBackground: true, path: `dist/meta/${person}.jpeg` })
  }

  await browser.close()
  await terminator.terminate()
}

await render("donotexist_A")
