import json5 from "json5";

export interface PersonMeta
{
    path: string,
    id: string,
    name: string
    profileUrl: string
}

export interface KVPair {key: string, val: string}

export interface Person
{
    id: string,
    name: string
    profileUrl: string

    info?: KVPair[]
    websites?: KVPair[]
}

export function isPairEmpty(p: KVPair): boolean
{
    return !p.key && !p.val
}

export function removeEmpty(arr: KVPair[]): KVPair[]
{
    let i = 0;
    while (i < arr.length) {
        if (isPairEmpty(arr[i])) arr.splice(i, 1)
        else ++i
    }
    return arr
}

// This function keeps the order if the object is from a json
export function objectToList(info: {[id: string]: string}): KVPair[]
{
    const list = []
    for (const k of Object.keys(info))
        list.push({key: k, val: info[k]})
    return list
}

// NOTE: This function loses order information
export function listToObject(list: KVPair[]): {[id: string]: string}
{
    const obj: {[id: string]: string} = {}
    for (const item of list)
        obj[item.key] = item.val
    return obj
}

export function mapToList(info: Map<string, string>): KVPair[]
{
    const list: KVPair[] = []
    for (const k of info.keys())
        list.push({key: k, val: info.get(k)!})
    return list
}

export function listToMap(list: KVPair[]): Map<string, string>
{
    const obj: Map<string, string> = new Map()
    for (const item of list)
        obj.set(item.key, item.val)
    return obj
}

export function parsePeopleJson(json: string): Person
{
    const p = json5.parse(json)
    if (!p.info) p.info = {}
    if (!p.websites) p.websites = {}
    p.info = objectToList(p.info)
    p.websites = objectToList(p.websites)
    return p
}
