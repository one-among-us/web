import json5 from "json5";

export interface PersonMeta
{
    path: string,
    id: string,
    name: string
    profileUrl: string
}

export interface Person
{
    id: string,
    name: string
    profileUrl: string

    info: [string, string][]
    websites: [string, string][]
}

export function parsePeopleJson(json: string): Person
{
    const p = json5.parse(json)
    if (!p.info) p.info = []
    if (!p.websites) p.websites = []
    return p
}

export function toJson(p: Person): string
{
    return json5.stringify(p, {space: 4})
        .replace(/ {8}\[\n {12}'/g, "        ['")
        .replace(/',\n {12}'/g, "', '")
        .replace(/',\n {8}],/g, "'],")
}

export function url(base: string, params: {[id: string]: string}): string
{
    return base + '?' + new URLSearchParams(params)
}

// TODO: Separate this into a new file
export const markdownTop = `
我一直记得《寻梦环游记》里面一句话：死亡不是生命的终点，遗忘才是。那些离开了我们的人，或许正在某个地方对我们说：「请你们不要忘记我。」

存在过的痕迹可能会随着时间慢慢抹消。旧照片会褪色，一段时间没有登录的社交账号可能会被注销。然而，引起波澜的却未必总是那些现实存在着的东西。突然在某个瞬间想起曾经聊过的话题，一起去过的地方，记忆的闸门就此打开，音容笑貌宛在。

我们中的许多人并不是因为地缘、业缘而相识，而是因为共同的生存境遇，才走到了这样一个被称为「社群」的地方。或许从未在现实中谋面，或许相隔甚远，跨过了语言、国籍的界限，或许……正在和我聊天的那个人，ta 的「真实存在」，我都无法确证。可何者为真实，何者为虚妄呢？即使我们不是 ta 们现实中的家人、朋友、恋人，那份友情甚至是亲情难道是可以被轻易否定的吗？当 ta 们逝去的时候，当那个头像永远不会再上线的时候，我总有一种私心，想要找一个地方为 ta 们做些真实的纪念，让 ta 继续存在下去，一直陪伴着我们前行。

于是就有了这个网站：那些因为各种原因过早离开我们的生命，那些跨性别者和我们的顺性别伙伴们（allies），仍然是我们中的一员（one among us），在默默照顾着、陪伴着我们，赋予我们继续生活的勇气。或许现实中的纪念碑上写着的并不是 ta 们所中意的姓名，也未必体现了 ta 们真实的认同，但我们仍然可以在自己的纪念中实现这一切。

「我们会在没有黑暗的地方相见。」
`

export const markdownBottom = `
# 拒绝对跨性别的暴力

联合国人权高专办的 [小册子](https://www.unfe.org/zh-hans/learn-more/) 指出，「在世界各地，跨性别者遭受暴力、骚扰和歧视的风险非常高。侵犯他们人权的行为包括欺凌和言语虐待，拒绝提供卫生保健服务、教育、工作机会和住房，刑罪化、任意逮捕和羁押，暴力、攻击、酷刑、强奸和谋杀。而年龄、族裔、职业、社会经济阶层和残障状况等其他因素可能加重他们所面临的暴力和歧视。」

除了呼吁一个更好的社会环境之外，个人能够做的事情还有很多：
- 了解跨性别者的经历、问题和关切。
- 以当事人自选的概念、人称代词、性别和名字来称呼他们。
- 见到任何形式的针对跨性别者的污名、歧视和暴力时，要敢于说不。

每年11月20日是跨性别追念日（[Transgender Day of Remembrance](https://www.glaad.org/tdor)）。在这一天，我们纪念那些因为恐跨人士的暴力而去世的跨性别者，呼吁终结对跨性别者的暴力。


# 如何贡献

你可以通过在我们的 [Github 数据库](https://github.com/hykilpikonna/our-data) 中递交 Pull Request 来更新或创建新的纪念者条目。Pull Request 被管理员合并后，新的条目会自动显示在网站里。

如果不知道怎么做，欢迎你来 [联系我们](/about)。
`

export const aboutMarkdown = `
# 联系我们

这个网页目前是由 [Shu Lin](https://twitter.com/sauricat/) 和 [Hykilpikonna](https://github.com/hykilpikonna) 共同维护，如有需要可以通过邮件联系我们！邮箱地址如下：

* Shu: linshu1729@protonmail.com
* Hykilpikonna: me@hydev.org
`
