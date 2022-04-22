import { Template } from './template.mjs';
import { Breadcrumbs } from './breadcrumbs.mjs';
import { Modal } from './modal.mjs';

export class Article {

    static element;

    static initialize() {
        this.element = document.querySelector('article');
        this.scrollWrapper = document.querySelector('.scroll-wrapper');
    }

    static resetScroll() { this.element.scrollTo(0, 0); }

    static clear() { 
        this.element.innerHTML = "";
        Modal.hide(); 
    }

    static setBreadcrumbsPath(path, selector) { Breadcrumbs.updatePath(path, selector); } 
    
    static append(element) { this.element.append(element); }

    static appendHeading(heading) {
        const templateElement = Template.createElement( 
            Template.articleHeading, 
            { 
                'heading': { 'innerHTML': heading, 'events': {}}
            } 
        );
        this.element.append(templateElement);
    }

    static appendSubheading(subheading, altText='') {
        const templateElement = Template.createElement( 
            Template.articleSubheading, 
            { 
                'label': {'innerHTML': subheading, 'events': {}},
                'alt-text': {'innerHTML': altText, 'events': {}}
            } 
        );
        this.element.appendChild(templateElement);
    }

}