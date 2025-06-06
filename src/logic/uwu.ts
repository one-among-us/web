import {getLang} from "@/logic/config";
import Uwuifier from 'uwuifier';

export function getParams(key: string): string {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(key)) {
        return urlParams.get(key);
    }
    return null;
}

export function isUwU(): boolean {
    return (!!getParams('uwu')) || (!!getParams('kawai'));
}

export function UwU() {
    if (getLang() != 'en') return;
    const plist = document.getElementsByTagName('p');
    for (const v of plist) {
        const uwu = new Uwuifier();
        if (v.innerHTML.includes('<')) continue;
        v.innerText = uwu.uwuifySentence(v.innerText);
    }
}