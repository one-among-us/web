import moment from 'moment'
import {getLang} from "@/logic/config";

/**
 * Download a string
 * @param filename File name
 * @param text Content
 */
export function download(filename: string, text: string): void
{
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * https://github.com/moh3n9595/js-abbreviation-number
 *
 * @param num
 * @param digit
 */
export function abbreviateNumber(
    num: number,
    digit = 1,
): string {
    const symbols = ["", "k", "M", "G", "T", "P", "E"]
    const padding = true

    // handle negatives
    const sign = Math.sign(num) >= 0;
    num = Math.abs(num);

    // what tier? (determines SI symbol)
    const tier = (Math.log10(num) / 3) | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return (!sign ? "-" : "") + num.toString();

    // get suffix and determine scale
    const suffix = symbols[tier];
    if (!suffix) throw new RangeError();

    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = num / scale;

    let rounded = scaled.toFixed(digit);
    if (!padding) {
        rounded = String(Number(rounded));
    }

    // format number and add suffix
    return (!sign ? "-" : "") + rounded + suffix;
}

/**
 * Get date in YYYY-MM-DD
 */
export function getTodayDate(): string
{
    return moment().format('YYYY-MM-DD')
}

export function randint(min: number, max: number): number
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function rand(min: number, max: number): number
{
    return Math.random() * (max - min + 1) + min
}

interface RequestInitWithParams extends RequestInit
{
    params?: {[index: string]: string}
}

/**
 * Modify a fetch url
 *
 * @param input Fetch url input
 * @param callback Callback for modification
 */
export function reconstructUrl(input: URL | RequestInfo, callback: (URL) => URL | void): RequestInfo | URL
{
    let u = new URL((input instanceof Request) ? input.url : input);
    const result = callback(u)
    if (result) u = result
    if (input instanceof Request) return {url: u, ...input}
    return u
}

/**
 * Fetch with url parameters
 */
export function fetchWithParams(input: URL | RequestInfo, init?: RequestInitWithParams): Promise<Response>
{
    return fetch(reconstructUrl(input, u => { u.search = new URLSearchParams(init?.params ?? {}).toString() }), init)
}

/**
 * Fetch with langauge
 */
export function fetchWithLang(input: RequestInfo, init?: RequestInitWithParams): Promise<Response>
{
    const lang = getLang()
    if (lang == 'zh_hans') return fetchWithParams(input, init)

    return fetchWithParams(reconstructUrl(input, (u: URL) => {
        // Insert language into the file name of the request
        const p = u.pathname.split('/')
        const last = p.length - 1
        const lsp = p[last].split('.')
        if (lsp.length < 2) return u
        lsp.splice(1, 0, lang)
        p[last] = lsp.join('.')
        u.pathname = p.join('/')

        console.log(`Detected language: ${lang}. Changing request to ${u.pathname}`)
    }), init)
}

/**
 * Fetch but handles errors better
 */
export function fetchText(url: string, init?: RequestInitWithParams): Promise<string>
{
    return new Promise((resolve, reject) => {
        fetchWithParams(url, init).then(response => response.text().then(text =>
            {
                if (response.ok) resolve(text)
                else throw new Error(text)
            })).catch(error => reject(error))
    })
}
