import urljoin from "url-join";

export const backendHost = 'https://backend.one-among.us'
// export const backendHost = 'http://localhost:43482'
export const dataHost = 'https://data.one-among.us'
// export const dataHost = 'http://localhost:8009'

export function peopleUrl(id: string): string
{
    return urljoin(dataHost, 'people', id)
}

export function replaceUrlVars(str: string, id: string): string
{
    return str.replace(/\${dataHost}/g, dataHost).replace(/\${path}/g, peopleUrl(id))
}
