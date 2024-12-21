export interface Time {
    hour: number;
    minute: number;
    second: number;
}

function degToRad(deg: number): number {
    return deg * Math.PI / 180;
}

function radToDeg(rad: number): number {
    return rad * 180.0 / Math.PI;
}

function isLeap(year: number): boolean {
    return (year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0));
}

function numberOfDay(year: number, month: number, day: number): number {
    const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let n = day;
    if (month > 2) n += isLeap(year) ? 1 : 0;
    while ((--month) > 0) n += days[month];
    return n;
}

function sunset(year: number, month: number, day: number, latitude: number): number {
    const dec = -degToRad(23.44) * Math.cos(2 * Math.PI / (365 + (isLeap(year) ? 1 : 0)) * (numberOfDay(year, month, day) + 10));
    return -Math.tan(degToRad(latitude)) * Math.tan(dec);
}

function radToTime(rad: number): Time {
    if (rad > Math.PI) rad -= 2 * Math.PI;
    const sec = Math.floor(43200 + (rad * 43200 / Math.PI));
    const hour = Math.floor(sec / 3600);
    const minute = Math.floor((sec - 3600 * hour) / 60);
    const second = Math.floor((sec - 3600 * hour) % 60);
    return {
        hour: hour,
        minute: minute,
        second: second,
    }
}

export function sunsetTime(year: number, month: number, day: number, latitude: number): Time {
    return radToTime(Math.acos(sunset(year, month, day, latitude)));
}

export function sunriseTime(year: number, month: number, day: number, latitude: number): Time {
    return radToTime(-Math.acos(sunset(year, month, day, latitude)));
}