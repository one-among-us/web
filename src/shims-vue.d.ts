/// <reference types="vite/client" />
/// <reference types="gtag.js" />

/* eslint-disable */

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '*.md' {
    const html: string;
    export default html;
}

declare global {
    interface Window {
        gtag?: Gtag.Gtag;
    }
}
