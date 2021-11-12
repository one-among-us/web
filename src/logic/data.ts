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

    info?: {[id: string]: string}
    websites?: {[id: string]: string}
}
