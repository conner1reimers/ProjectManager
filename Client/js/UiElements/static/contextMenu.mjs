import { Article } from "./article.mjs";
import { Template } from "./template.mjs";

export class ContextMenu {

    static templates = {
        menu: Template.createTemplate(`<div slot="menu" class="flex-column context-menu"></div>`),
        row: Template.createTemplate(`<p slot="row" class="context-menu-row"></div>`),
    };
    static element;

    static initialize() {
        window.addEventListener('click', (evt) => {
            if(this.element && (!evt.target.classList.contains('context-menu')))
                this.hide();
        })
        window.addEventListener('resize', (evt) => {
            this.hide();
        })
        Article.scrollWrapper.addEventListener('scroll', (evt) => {
            this.hide();
        })
    }

    static show(contextButton, struct, openDir) {
        if(this.element)
            this.element.remove();
        
        contextButton = contextButton.classList.contains('context-button') ? contextButton : contextButton.closest('.context-button')
        const contextLocation = contextButton.getBoundingClientRect();
        this.element = Template.createElement(
            ContextMenu.templates.menu,
            { 
                'menu': { 
                    style: {
                        width: struct.width + 'px', 
                        top: openDir[0] === 'top' ? contextLocation.top + 'px' : '', 
                        bottom: openDir[0] === 'bottom' ? document.body.clientHeight-contextLocation.bottom + 'px' : '', 
                        left: openDir[1] === 'left' ? contextLocation.left + 'px' : '', 
                        right: openDir[1] === 'right' ? document.body.clientWidth-contextLocation.right + 'px' : '', 
                    },
                } 
            }
        );     

        struct.elements.forEach(elem => {
            const row = Template.createElement(
                ContextMenu.templates.row,
                {
                    row: {
                        innerHTML: elem.label,
                        events: { click: elem.event }
                    }
                }
            );
           this.element.append(row) 
        });

        console.log(struct.width)
        document.body.append(this.element);
    }

    static hide() {
        if(this.element) {
            this.element.remove();
            this.element = undefined;
        }
    }

}