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
    const p = JSON.parse(json)
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
