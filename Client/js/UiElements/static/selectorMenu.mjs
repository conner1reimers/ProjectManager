import { Article } from "./article.mjs";
import { Template } from "./template.mjs";

export class SelectorMenu {

    static templates = {
        menu: Template.createTemplate(`
            <div slot="menu" class="flex-column selector-menu">
                <p slot="heading" class="selector-menu-heading"></p>
            </div>
        `),
        group: Template.createTemplate(`
            <div class="flex-column selector-menu-group">
                <p slot="label" class="selector-menu-label"></p>
            </div>
        `),
        option: Template.createTemplate(`
            <div class="flex-row selector-menu-option">
                <input slot="input" type="radio" name="option" value="coding">
                <label slot="label" for="option"></label>
            </div>
        `),
    };
    static element;
    static filterOptions = {};

    static initialize() {
        window.addEventListener('click', (evt) => {
            if(this.element && !(evt.target.classList.contains('selector-menu') || evt.target.closest('.selector-menu') ))
                this.hide();
        })
        window.addEventListener('resize', (evt) => {
            this.hide();
        })
        Article.scrollWrapper.addEventListener('scroll', (evt) => {
            this.hide();
        })
    }


    static show(selectorButton) {
        if(this.element) {
            selectorButton = selectorButton.classList.contains('heading-button') ? selectorButton : selectorButton.closest('.heading-button');
            const selectorLocation = selectorButton.getBoundingClientRect();
            this.element.css({
                top: selectorLocation.top + 'px', 
                right: document.body.clientWidth-selectorLocation.right + 37 + 'px', 
            });
            document.body.append(this.element);
        }
    }

    static create(struct) {
        if(this.element)
            this.element.remove();

        this.element = Template.createElement(
            SelectorMenu.templates.menu,
            { 
                'menu': {},
                'heading': { innerHTML: struct.heading } 
            }
        );     

        struct.groups.forEach(groupData => {
            const group = Template.createElement(
                SelectorMenu.templates.group,
                { 'label': { innerHTML: groupData.label } }
            );

            groupData.options.forEach(optionData => {
                const option = Template.createElement(
                    SelectorMenu.templates.option,
                    {
                        'input': { 
                            type: groupData.type,
                            value: optionData.value,
                            //checked: optionData.checked ? optionData.checked : 'false',
                            events: {
                                change: (evt) => {
                                    this.filterOptions[optionData.value].isChecked = evt.target.checked;
                                    struct.onChange(this.filterOptions, evt.target);
                                    softReload();
                                }
                            } 
                        },
                        'label': { innerHTML: optionData.label }
                    }
                );
                group.append(option);

                this.filterOptions[optionData.value] = { group: groupData.value, isChecked: false, element: option.querySelector('[slot="input"]') };
            });

            this.element.append(group);
        });

    }

    static hide() {
        if(this.element) {
            this.element.remove();
            //this.element = undefined;
        }
    }

}