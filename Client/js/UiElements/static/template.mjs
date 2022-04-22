export class Template {

    static templateQueries = {
        // NavBar

        // Article
        articleHeading:                 '#article-heading',
        articleSubheading:              '#article-subheading',
        // Article-Card-Carousel
        articleCardCarousel:            '#article-carousel',
        articleCardCarouselList:        '#article-carousel-list',
        articleCarouselMemberCard:      '#article-carousel-member-card',
    }

    static initialize() {
        Object.keys(this.templateQueries).forEach((key) => {
            this[key] = document.querySelector(this.templateQueries[key]);
        });
    }

    static createTemplate(tempateHtml) {
        const template = document.createElement('template');
        template.innerHTML = tempateHtml;
        return template;
    } 

    static createElement(template, slots = {}) {
        // Slots:  { innerHTML: '', attributes: {}, addClasses: [], events: {}}
        let templateClone = template.content.cloneNode(true);
        Object.keys(slots).forEach((slot) => {   // Each slot
            const slotElement = templateClone.querySelector(`[slot=${slot}]`);
            const slotAttrs = slots[slot];

            if(slotAttrs.outerHTML) {
                slotElement.outerHTML = slotAttrs.outerHTML;
                delete slotAttrs.outerHTML;
            }
        
            Object.keys(slotAttrs).forEach((attr) => { // Each attr
                const attrValue = slotAttrs[attr];

                if(attrValue) {
                    if(attr === 'events')
                        Object.keys(attrValue).forEach((event) => { slotElement.addEventListener(event, attrValue[event]) }); 
                    else if(attr === 'addClasses') {
                        attrValue.forEach(classKey => {
                            if(classKey)
                                slotElement.classList.add(classKey);
                        });
                    } else if(attr === 'style')
                        slotElement.css(attrValue);
                    else if(attr === 'attrs')
                        Object.keys(attrValue).forEach((attr) => { slotElement.setAttribute(attr, attrValue[attr]); }); 
                    else if(attr === 'append')
                        attrValue.forEach((element) => { if(element) { slotElement.append(element); } }); 
                    else if(attrValue !== '') // add as properity
                        slotElement[attr] = attrValue;
                }
            });
        });

        if(templateClone.children.length === 1)
            return templateClone.children[0];
        else
            return templateClone;
    } 

}