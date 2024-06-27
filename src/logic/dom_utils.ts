interface FitTextOptions {
    width?: number
    minFontSize?: number
    maxFontSize?: number
}

export function fullWidth(el: HTMLElement) {
    const style = window.getComputedStyle(el)
    const width = el.offsetWidth
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    // const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)

    return width + margin + padding
}

export function fitText(el: HTMLElement, opts: FitTextOptions = {}) {
    if (el.hasAttribute("fit-initialized")) return

    function resize() {
        // Check if the text needs to be resized
        const targetWidth = opts.width ?? el.parentElement.clientWidth
        if (el.clientWidth <= targetWidth) return

        // Compute current font size
        const cs = window.getComputedStyle(el)

        // Compute required font size by applying the width scale to the existing font size
        let fontSize = targetWidth / el.clientWidth * parseFloat(cs.fontSize)

        // Preserve height for centering
        el.style.height = (el.clientHeight + 'px')

        // Bound
        if (opts.maxFontSize) fontSize = Math.min(fontSize, opts.maxFontSize)
        if (opts.minFontSize) fontSize = Math.max(fontSize, opts.minFontSize)

        el.style.fontSize = fontSize + 'px'
    }

    // Call once to set.
    resize()

    el.addEventListener('resize', resize)
    el.addEventListener('orientationchange', resize)
    el.setAttribute("fit-initialized", "y")
}
