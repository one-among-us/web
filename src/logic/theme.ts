export type Theme = 'dark' | 'light' | 'unset'

export function getTheme(): Theme {
    if (localStorage.getItem('theme')) {
        return JSON.parse(localStorage.getItem('theme')) as Theme
    }
    if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
        }
        return 'light'
    }
    return 'unset'
}

export function setTheme(theme: Theme) {
    localStorage.setItem('theme', theme)
}