export function viaFetch(): void {
    //Deleted
}

export function viaBalloon(): void {
    for (let i = 0; i <= 6; ++i) {
        fetch(`/img/balloons/balloon-${i}.png`).then()
    }
    fetch(`/img/balloons/balloon-p.png`).then()
}