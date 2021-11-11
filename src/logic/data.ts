
export interface Person
{
    id: string,
    name: string
    profileUrl: string

    info?: string[]

    profilePageUrl?: string
    profilePageFormat?: string
}

export const exampleData: Person[] = [
    {
        id: 'hykilpikonna',
        name: '小桂桂',
        profileUrl: 'https://pbs.twimg.com/profile_images/1445198854429810690/TzeMf5yX_400x400.jpg'
    },
    {
        id: 'shiinamota',
        name: '椎名もた',
        profileUrl: 'https://pbs.twimg.com/profile_images/591631266937638913/AtOAlQpd_400x400.jpg'
    },
    {
        id: 'donotexist_A',
        name: '不存在',
        profileUrl: 'https://pbs.twimg.com/profile_images/1374397593594122242/bPfn-Zzk_400x400.jpg'
    },
    {
        id: 'Uekawakuyuurei',
        name: '萤',
        profileUrl: 'https://pbs.twimg.com/profile_images/1378912446782394368/icyGMaK5_400x400.jpg'
    },
]
