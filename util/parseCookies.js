module.exports = function parseCookies(cookiesStr = "") {
    const pairs = cookiesStr.split(';');
    let cookies = {};
    pairs.forEach(e => {
        const pair = e.split('=');
        cookies[pair[0]] = pair[1];
    });
    return cookies;
};