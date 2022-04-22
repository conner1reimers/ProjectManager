
function onAnchorClick(evt) {
    evt.preventDefault();
    pushHistory(evt.target.closest("a").getAttribute('href'));
}
function pushHistory(path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('locationchange'));
}
function softReload() {
    window.dispatchEvent(new Event('locationchange'));
}

window.addEventListener('popstate', () => { window.dispatchEvent(new Event('locationchange')); });



String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.initial = function() {
    return this.charAt(0);
}

Math.randomRange = function(min, max) {
    return this.floor(this.random() * (max - min + 1)) + min;
}

/* css(key, value), css(Object {key: value, ...}) */
Element.prototype.css = function(key, value) {
    if(typeof key === 'object') {
        Object.keys(key).forEach((cssKey) => { this.style[cssKey] = key[cssKey]; });
    } else {
        if(value)
            this.style[key] = value;
        else
            return getComputedStyle(this)[key];
    }
};

document.addEvents = function(query, events, optionalCb) {
    let element;
    if(typeof query === 'object')
        element = query;
    else
        element = document.querySelector(query);

    if(typeof events === 'object') {
        Object.keys(events).forEach((type) => {
            if(events[type] !== null) {
                element.addEventListener(type, events[type]);
            }
        });
    } else 
        element.addEventListener(events, optionalCb);
        
    return element;
}