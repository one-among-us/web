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
    const isFirstCall = !el.hasAttribute("fit-original-size")
    const cs = window.getComputedStyle(el)
    const originalFontSize = parseFloat(el.getAttribute("fit-original-size") || cs.fontSize)

    function resize() {
        // Check if the text needs to be resized
        const targetWidth = opts.width ?? el.parentElement.clientWidth

        // Compute required font size by applying the width scale to the existing font size
        let fontSize = targetWidth / el.clientWidth * parseFloat(cs.fontSize)

        // Preserve height for centering
        el.style.height = (el.clientHeight + 'px')

        // Bound the font size - never exceed original size
        fontSize = Math.min(fontSize, originalFontSize)
        if (opts.maxFontSize) fontSize = Math.min(fontSize, opts.maxFontSize)
        if (opts.minFontSize) fontSize = Math.max(fontSize, opts.minFontSize)

        el.style.fontSize = fontSize + 'px'
    }

    // Call once to set.
    resize()

    if (isFirstCall) {
        el.addEventListener('resize', resize)
        el.addEventListener('orientationchange', resize)
        el.setAttribute("fit-original-size", originalFontSize.toString())
    }
}
