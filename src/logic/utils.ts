// ///////////////////// //
// Console Logging Utils //
// ///////////////////// //

export const logPrefixCss = 'border-radius: 10px; padding: 1px 5px;'

export function error(s: unknown) {
    s = s.toString()
    console.error(`%cERROR%c ${s}`, 'background: #ffe1e1; color: red;' + logPrefixCss, 'background: unset; color: red')
}

export function warning(s: unknown) {
    s = s.toString()
    console.warn(`%cWARN%c ${s}`, 'background: #fdf6ec; color: #E6A23C;' + logPrefixCss, 'background: unset')
}

export function info(s: unknown) {
    s = s.toString()
    console.log(`%cINFO%c ${s}`, 'background: #f0f9eb; color: #67C23A;' + logPrefixCss, 'background: unset')
}
