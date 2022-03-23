export const TIME = {
    COMINGSOON: 'coming soon',
    CLOSED: 'closed',
    OPENED: 'opened',
}

export default function comparefy(start: Date, end: Date) {
    const now = new Date()
    if (now < start) return 0
    if (now > end) return 1
    return 2
}

export function isExpired(start: Date) {
    const now = new Date()
    if ((start.getTime() - now.getTime()) / 1000 < 7 * 24 * 3600) return 1
    return 0
}