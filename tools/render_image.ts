import puppeteer from 'puppeteer';
import './extensions.js';

import nodeStatic from 'node-static';
import * as http from "http";
import {createHttpTerminator} from "http-terminator";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Create HTTP server
const file = new nodeStatic.Server('./dist');
const server = http.createServer((request, response) => {
  request.addListener('end', () => file.serve(request, response)).resume()
})
server.listen(22745)
const terminator = createHttpTerminator({ server })

// Render HTML component using puppeteer
export async function render(...people: string[])
{
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  for (const person of people)
  {
    // Load page
    await page.goto(`http://localhost:22745/p/${person}`)
    await sleep(1000)

    // Take screenshot of an element
    const element = await page.$("#info")

  }
}

await render("donotexist_A")
await terminator.terminate()
