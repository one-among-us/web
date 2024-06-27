const easterImage = ['betelgeuse.png', 'bridge.png', 'cake.png', 'cat-face-emoji-2048x1828.png', 'clip.png', 'easterEgg.png', 'flowers.png', 'fog.png', 'lifeline.png', 'lollipop_1f36d.png', 'musical-score.png', 'ship.png', 'stardust.jpg', 'tumb.png']

export function viaFetch(): void {
    for (const v of easterImage) {
        fetch(`/img/${v}`).then()
    }
}

export function viaBalloon(): void {
    for (let i = 0; i <= 6; ++i) {
        fetch(`/img/balloons/balloon-${i}.png`).then()
    }
    fetch(`/img/balloons/balloon-p.png`).then()
}