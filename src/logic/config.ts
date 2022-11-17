import urljoin from "url-join";

export const backendHost = 'https://backend.one-among.us'
// export const backendHost = 'http://localhost:43482'
export const dataHost = 'https://data.one-among.us'
// export const dataHost = 'http://localhost:8009'
export const captchaSiteKey = '6LcbpzQdAAAAAN-J3dWZsi1t_ZRNT-ybUbmsQmH_'

export function peopleUrl(id: string): string
{
    return urljoin(dataHost, 'people', id)
}

export function replaceUrlVars(str: string, id: string): string
{
    return str.replace(/\${dataHost}/g, dataHost).replace(/\${path}/g, peopleUrl(id))
}

const zhMap = {'zh-tw': 'zh_hant', 'zh-hk': 'zh_hant', 'zh-sg': 'zh_hans', 'zh-cn': 'zh_hans'}
type Lang = 'zh_hans' | 'zh_hant'

/**
 * Get language
 *
 * @return 'hans' or 'hant'
 */
export function getLang(): Lang
{
    // Language preference set, return
    const pref = localStorage.getItem("lang")
    if (pref && (pref == 'zh_hans' || pref == 'zh_hant')) return pref

    // No language preference, infer from user agent
    const langs = navigator.languages.map(it => it.toLowerCase())

    // If user agent contains any langauges starting with zh-
    const zh = langs.filter(it => it.startsWith("zh-"))
    if (zh.length > 0 && zhMap[zh[0]]) return zhMap[zh[0]]

    return 'zh_hans'
}
