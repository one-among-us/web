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

export function removeEmpty(arr: [string, string][]): void
{
    let i = 0;
    while (i < arr.length) {
        if (!arr[i][0] && !arr[i][1]) arr.splice(i, 1)
        else ++i
    }
}

export function parsePeopleJson(json: string): Person
{
    const p = json5.parse(json)
    if (!p.info) p.info = {}
    if (!p.websites) p.websites = {}
    return p
}

export function toJson(p: Person): string
{
    return json5.stringify(p, {space: 4})
        .replace(/ {8}\[\n {12}'/g, "        ['")
        .replace(/',\n {12}'/g, "', '")
        .replace(/',\n {8}],/g, "'],")
}
