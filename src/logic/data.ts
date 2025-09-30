export interface PersonMeta {
    path: string,
    id: string,
    name: string,
    profileUrl: string,
    sortKey?: any,
    desc?: string,
}

export interface CommentReply {
    content: string
    submitter: string
}

export interface Comment extends CommentReply {
    id: number
    date?: string
    replies: CommentReply[]
}

export interface Person {
    id: string,
    name: string
    profileUrl: string

    info: [string, string][]
    websites: [string, string][]
    comments: Comment[]
}

export interface BannerData {
    icon: string;
    title: string;
    text: string;
}

export function parsePeopleJson(json: string): Person {
    const p = JSON.parse(json)
    if (!p.info) p.info = []
    if (!p.websites) p.websites = []
    return p
}

export function url(base: string, params: { [id: string]: string }): string {
    return base + '?' + new URLSearchParams(params)
}

export interface Toast {
    title: string,
    text?: string,
    img: string,
    width?: number,
    height?: number,
    background?: string,
    color?: string
}

export type EggType = "open" | "tag" | "wait" | "keyword"
export type Tag = "p" | "summary" | "blockquote" | "div" | "pre"

export interface EasterEgg {
    type: EggType,
    userid: string[],
    id: string,
    toast: Toast,
    tag?: Tag,
    wait?: number,
    keyword?: string[]
}
