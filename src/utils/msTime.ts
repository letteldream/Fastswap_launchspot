export const secondsToDhms = (dateFuture: any, dateNow: any) => {
    if (dateFuture - dateNow > 0) {
        let delta = (dateFuture - dateNow) / 1000;
        const dDisplay = Math.floor(delta / 86400);
        delta -= dDisplay * 86400;

        const hDisplay = Math.floor(delta / 3600) % 24;
        delta -= hDisplay * 3600;

        const mDisplay = Math.floor(delta / 60) % 60;
        delta -= mDisplay * 60;

        const sDisplay = Math.floor(delta % 60)
        return { dDisplay, hDisplay, mDisplay, sDisplay };
    }
    const dDisplay = 0
    const hDisplay = 0
    const mDisplay = 0
    const sDisplay = 0
    return { dDisplay, hDisplay, mDisplay, sDisplay };
}

export const db = ''