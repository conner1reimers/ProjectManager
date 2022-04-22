import { Template } from "../../static/template.mjs";

export class SliderButton {

    static templates = {
        slider: Template.createTemplate(`
            <div class="heading-button-slider">
                <div slot="selector" class="heading-button-slider-selector"></div>
                <div class="heading-button-slider-option-wrapper"></div>
            </div>
        `),
        option: Template.createTemplate(`<div slot="option" class="heading-button-slider-option"></div>`) 
    }
    element;
    optionWidth = 0;

    constructor (options, startingIndex = 0) {
        this.element = Template.createElement(SliderButton.templates.slider); 
        this.optionWrapper = this.element.querySelector('.heading-button-slider-option-wrapper')

        options.forEach((option, i) => {
            const optionElem = Template.createElement(
                SliderButton.templates.option, 
                {
                    'option': {
                        innerHTML: option.label,
                        events: {'click': () => {
                            if(option.event)
                                option.event();
                            this.setSliderIndex(i)
                        }}
                    }
                }
            );
            this.optionWrapper.append(optionElem);
        });

        this.selector = this.element.querySelector('[slot=selector]');

        setTimeout(() => {
            for(let i=0; i<this.optionWrapper.children.length; i++) {
                const elem = this.optionWrapper.children[i];
                if(elem.clientWidth > this.optionWidth)
                    this.optionWidth = elem.clientWidth;
                console.log(this.optionWidth)
            }
            for(let i=0; i<this.optionWrapper.children.length; i++)
                this.optionWrapper.children[i].css('width', this.optionWidth + 'px');

            this.selector.css('width', this.optionWidth - 6 + 'px');
            this.setSliderIndex(startingIndex);
        }, 0);

    }

    setSliderIndex(index) {
        for(let i=0; i<this.optionWrapper.children.length; i++)
            this.optionWrapper.children[i].classList.remove('active');
        this.optionWrapper.children[index].classList.add('active');
        this.selector.css('left', index * this.optionWidth + 2 + 'px')
    }

}