import { Button } from '../headings/selectors/buttonSet.mjs';
import { Template } from '../static/template.mjs';

export class CardCarousel {

    static templates = {
        'carousel': Template.createTemplate(`
            <div class="carousel">
                <div class="carousel-lists-wrapper"></div>
            </div>
        `),
        'list': Template.createTemplate(`<div slot='list' class="carousel-list flex-row"></div>`)
    }
    element;

    cardData = [];
    currentSetIndex = 0;
    numDisplayableCards = 0;

    nextButton;
    prevButton;
    listWrapperElement;
    listElement;

    constructor(cardType, numDisplayableCards) {
        this.cardType = cardType;
        this.numDisplayableCards = numDisplayableCards;

        this.nextButton = new Button(Button.icons.next, this.nextSet.bind(this));
        this.nextButton.setDisabled(true);
        this.prevButton = new Button(Button.icons.prev, this.prevSet.bind(this));
        this.prevButton.setDisabled(true);
        
        this.element = Template.createElement( CardCarousel.templates.carousel );        
        this.listWrapperElement = this.element.querySelector('.carousel-lists-wrapper');
        this.listWrapperElement.append( this.createCardElement() );

        this.listElement = this.createCardList();
        this.listWrapperElement.append(this.listElement);
    }

    addCard(cardData) { 
        this.cardData.push(cardData);
        this.listElement.remove();
        this.listElement = this.createCardList(this.currentSetIndex * this.numDisplayableCards);
        this.listWrapperElement.append(this.listElement);
    }

    nextSet() {
        if(this.currentSetIndex < Math.floor(this.cardData.length / this.numDisplayableCards )) {
            this.currentSetIndex++;

            const bufferList = this.createCardList(this.currentSetIndex * this.numDisplayableCards, ['start-right']);
            this.listWrapperElement.append(bufferList);

            this.listElement.classList.add('start-left');
            this.listElement.addEventListener('transitionend', this.onListTransitionEnd.bind(this));
            
            this.listElement = bufferList;
            if(this.listElement.children.length < this.numDisplayableCards)
                this.nextButton.setDisabled(true);
            this.prevButton.setDisabled(false);
            
            setTimeout(() => { this.listElement.classList.remove('start-right'); }, 0);             
        }
    }

    prevSet() {
        if(this.currentSetIndex >= 0) {
            this.currentSetIndex--;
            
            const bufferList = this.createCardList(this.currentSetIndex * this.numDisplayableCards, ['start-left']);
            this.listWrapperElement.append(bufferList);

            this.listElement.classList.add('start-right');
            this.listElement.addEventListener('transitionend', this.onListTransitionEnd.bind(this));

            this.listElement = bufferList;
            if(this.currentSetIndex === 0)
                this.prevButton.setDisabled(true);
            this.nextButton.setDisabled(false);
            
            setTimeout(() => { this.listElement.classList.remove('start-left'); }, 0);  
        }
    }

    createCardList(startIndex = 0, addClasses = []) {
        const listElement = Template.createElement( CardCarousel.templates.list, { 'list': { addClasses: addClasses } } );
        let i;
        for(i=startIndex; i < startIndex + this.numDisplayableCards; i++) {
            listElement.append( this.createCardElement(this.cardData[i]) );
            if(!this.cardData[i])
                this.nextButton.setDisabled(true);
        }
        if(this.cardData[i])
            this.nextButton.setDisabled(false);
        return listElement;
    }  

    createCardElement(cardData) { 
        return (new this.cardType(cardData)).element; 
    }

    onListTransitionEnd(evt) { evt.srcElement.remove(); }
}