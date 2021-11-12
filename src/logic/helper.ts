import moment from 'moment'

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
