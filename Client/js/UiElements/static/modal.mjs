import { Template } from "./template.mjs";

export class Modal {

    static templates = {
        heading: Template.createTemplate(`
            <div class="modal-heading flex-row">
                <p slot="heading" id="modal-header" class="flex-grow">Create new employee</p>
                <svg slot="exit" viewBox="0 0 512 512"><path d="M496.4,486.6l-9.6,9.6c-12.5,12.5-32.7,12.5-45.2,0L15.8,70.4c-12.5-12.5-12.5-32.7,0-45.2l9.6-9.6c12.5-12.5,32.7-12.5,45.2,0l425.9,425.9C508.9,453.9,508.9,474.2,496.4,486.6z"/><path d="M25.3,496.3l-9.6-9.6c-12.5-12.5-12.5-32.7,0-45.2L441.6,15.7c12.5-12.5,32.7-12.5,45.2,0l9.6,9.6c12.5,12.5,12.5,32.7,0,45.2L70.5,496.3C58.1,508.7,37.8,508.7,25.3,496.3z"/></svg> 
            </div>
        `)
    }
    static element;

    static initialize() {
        this.modalWrapper = document.querySelector('#modal-wrapper');
        this.modal = document.querySelector('#modal');

        this.foreground = document.querySelector('#black-foreground');
        this.foreground.addEventListener('click', this.hide.bind(this));
    }

    static show() { 
        this.modalWrapper.classList.remove('invisible'); 
        this.modal.classList.remove('invisible'); 
        this.foreground.classList.remove('invisible');
    }
    static hide() { 
        this.modalWrapper.classList.add('invisible'); 
        this.modal.classList.add('invisible'); 
        this.foreground.classList.add('invisible');
    }

    static setContent(heading, ...elements) {
        this.clear();
        if(heading)
            this.appendHeading(heading);
        elements.forEach(element => this.append(element));
        this.show();
    }

    static clear() { 
        this.hide();
        this.modal.innerHTML = ""; 
    }
    
    static append(element) { this.modal.append(element); }

    static appendHeading(heading) {
        const templateElement = Template.createElement( 
            this.templates.heading, 
            { 
                'heading': { 'innerHTML': heading },
                'exit': {'events': {click: this.hide.bind(this)}},
            } 
        );
        this.append(templateElement);
    }

}