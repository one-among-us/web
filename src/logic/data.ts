export interface PersonMeta
{
    path: string,
    id: string,
    name: string
    profileUrl: string
}

export interface Comment
{
    id: number
    content: string
    submitter: string
    date?: string
}

export interface Person
{
    id: string,
    name: string
    profileUrl: string

    info: [string, string][]
    websites: [string, string][]
    comments: Comment[]
}

export function parsePeopleJson(json: string): Person
{
    const p = JSON.parse(json)
    if (!p.info) p.info = []
    if (!p.websites) p.websites = []
    return p
}

export function url(base: string, params: {[id: string]: string}): string
{
    return base + '?' + new URLSearchParams(params)
}
