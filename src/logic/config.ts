import urljoin from "url-join";

export const backendHost = 'https://backend.one-among.us'
// export const backendHost = 'http://localhost:43482'
export const dataHost = 'https://data.one-among.us'
// export const dataHost = 'http://localhost:8080'
export const captchaSiteKey = '6LcbpzQdAAAAAN-J3dWZsi1t_ZRNT-ybUbmsQmH_'

export function peopleUrl(id: string): string
{
    return urljoin(dataHost, 'people', id)
}
export function backupUrl(id: string, platform: string): string
{
    return urljoin(peopleUrl(id), 'backup', platform, 'posts.json')
}

export function replaceUrlVars(str: string, id: string): string
{
    return str.replace(/\${dataHost}/g, dataHost).replace(/\${path}/g, peopleUrl(id))
}

const zhMap = {'zh-tw': 'zh_hant', 'zh-hk': 'zh_hant', 'zh-sg': 'zh_hans', 'zh-cn': 'zh_hans', 'en':'en'}
export type Lang = 'zh_hans' | 'zh_hant' | 'en'
export const supportedLang: Record<Lang, string> = {
    'zh_hans': '简',
    'zh_hant': '繁',
    'en': 'En'
}

/**
 * Get language
 *
 * @return 'zh_hans', 'zh_hant' or 'en'
 */
export function getLang(): Lang
{
    // Language preference set, return
    const pref = localStorage.getItem("lang")
    if (pref && (pref == 'zh_hans' || pref == 'zh_hant' || pref =='en')) return pref

    // No language preference, infer from user agent
    const langs = navigator.languages.map(it => it.toLowerCase())

    // If user agent contains any langauges starting with en[-]
    const en = langs.filter(it => it.startsWith("en"))
    if (en.length > 0) return 'en'

    // If user agent contains any langauges starting with zh-
    const zh = langs.filter(it => it.startsWith("zh-"))
    if (zh.length > 0 && zhMap[zh[0]]) return zhMap[zh[0]]

    // default
    return 'zh_hans'
}

export function setLang(name: Lang)
{
    if (name in zhMap) name = zhMap[name]
    localStorage.setItem('lang', name)
}

export const i18n = {
    "en": {
        "nav_home": "Home",
        "nav_contact": "Contact",
        "nav_website": "Website",
        "nav_what_to_edit": "What to edit?",
        "nav_profile_card": "Profile Card",
        "nav_introduction": "Introduction",
        "nav_submit": "Submit",
        "nav_unable_submit": "Unable to submit: nothing changed",
        "nav_ok_0": "ok",
        "nav_ok_1": "ok",
        "nav_creating_pull_request": "Working...",
        "nav_description_pull_request": "Creating Pull Request...",
        "nav_comment_submit": "Submitting...",
        "nav_success": "Success",
        "nav_failed": "Failed",
        "nav_success_text": "Thank you! We will review your changes as soon as possible.",
        "nav_success_text_reply": "Thank you! We will email you after review.",
        "nav_fail_reason": "Reason: ",
        "nav_anonymous": "——Anonymous",
        "nav_will_submit": "Submit?",
        "nav_req_name": "Thank you! Your nickname, Please?",
        "nav_req_anonymous": "Anonymous is available if you don't want to leave a nickname.",
        "nav_reCAPTCHA": "Click the reCAPTCHA below to submit.",
    },
    "zh_hans": {
        "nav_home": "首页",
        "nav_contact": "联系",
        "nav_website": "网站",
        "nav_what_to_edit": "要编辑什么呢",
        "nav_profile_card": "信息卡片",
        "nav_introduction": "简介条目",
        "nav_submit": "提交",
        "nav_unable_submit": "什么都没改怎么提交啦",
        "nav_ok_0": "好好好",
        "nav_ok_1": "好诶",
        "nav_creating_pull_request": "正在创建更改请求...",
        "nav_description_pull_request": "其实就是 Pull Request 啦",
        "nav_comment_submit": "正在提交留言...",
        "nav_success": "提交成功",
        "nav_failed": "提交失败",
        "nav_success_text": "谢谢你. 我们将尽快审核您的更改. ",
        "nav_success_text_reply": "谢谢你. 我们审核之后会给你发邮件.",
        "nav_fail_reason": "失败原因: ",
        "nav_anonymous": "——匿名小可爱",
        "nav_will_submit": "要提交编辑嘛?",
        "nav_req_name": "谢谢你! 请留下你的昵称",
        "nav_req_anonymous": " (如果不想留名字也可以填匿名哦) ",
        "nav_reCAPTCHA": "点击下面的验证码就可以提交啦! ",
    },
    "zh_hant": {
        "nav_home": "首頁",
        "nav_contact": "聯繫",
        "nav_website": "網路站點",
        "nav_what_to_edit": "要編輯什麼呢",
        "nav_profile_card": "訊息卡片",
        "nav_introduction": "簡介條目",
        "nav_submit": "提交",
        "nav_unable_submit": "什麼都沒有改怎麼提交啦",
        "nav_ok_0": "好好好",
        "nav_ok_1": "好誒",
        "nav_creating_pull_request": "創建更改請求中...",
        "nav_description_pull_request": "其實就是 Pull Request 啦",
        "nav_comment_submit": "提交留言中...",
        "nav_success": "提交完成",
        "nav_failed": "提交失败",
        "nav_success_text": "謝謝你. 我們將儘快審覈您的更改. ",
        "nav_success_text_reply": "谢谢你. 我們審覈之後會給你發郵件.",
        "nav_fail_reason": "失敗原因: ",
        "nav_anonymous": "——沒留名字的小可愛",
        "nav_will_submit": "要提交編輯嘛?",
        "nav_req_name": "謝謝你! 請留下你的暱稱",
        "nav_req_anonymous": " (不想留名字的話...匿名也是可以的哦) ",
        "nav_reCAPTCHA": "點擊下面的reCAPTCHA就可以提交啦! ",
    }
}

export const info_i18n = {
    "en": {
        "alias": "Alias",
        "location": "Location",
        "born": "Born",
        "died": "Departed",
        "age": "Age",
    },
    "zh_hans": {
        "alias": "昵称",
        "location": "地区",
        "born": "出生",
        "died": "逝世",
        "age": "年龄",
    },
    "zh_hant": {
        "alias": "暱稱",
        "location": "地區",
        "born": "誕生",
        "died": "去世",
        "age": "年齡",
    }
}