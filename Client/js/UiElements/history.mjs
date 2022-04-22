import { App } from "../app.mjs";


export function pushHistory(path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('locationchange'));
}

