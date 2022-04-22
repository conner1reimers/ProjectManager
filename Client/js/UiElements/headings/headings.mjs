import { Template } from "../static/template.mjs";

export class Heading {

    static template = Template.createTemplate(`
        <div class="heading flex-row">
            <h1 slot="heading"></h1>
            <div slot="right-selector" class="subheading-section right flex-row"></div>
        </div>
    `);
    element;

    constructor(heading, rightSelector = {}) {
        this.element = Template.createElement( 
            Heading.template, 
            { 
                'heading': { innerHTML: heading },
                'right-selector': {append: [rightSelector.element]},
            } 
        );
    }

}

export class SubHeading {

    static template = Template.createTemplate(`
        <div class="subheading flex-row">
            <div class="subheading-section flex-row">
                <h2 slot="heading"></h2>
                <p slot="alt-text" class="alt-text-link"></p>
            </div>
            <div slot="center-selector" class="subheading-section center flex-row"></div>
            <div slot="right-selector" class="subheading-section right flex-row"></div>
        </div>
    `);
    element;

    constructor(heading, altLink = {}, rightSelector = {}, centerSelector = {}) {
        this.element = Template.createElement( 
            SubHeading.template, 
            { 
                'heading': { innerHTML: heading },
                'alt-text': {innerHTML: altLink.label, events: {'click': altLink.event}},
                'center-selector': {append: [centerSelector.element]},
                'right-selector': {append: [rightSelector.element]},
            } 
        );
    }

}