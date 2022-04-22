import { Template } from "../static/template.mjs";

export class CardGrid {

    static template = Template.createTemplate(`
        <div slot="grid" class="card-grid flex-row"></div>
    `);
    element;

    constructor(cardType) {
        this.cardType = cardType;
        
        this.element = Template.createElement(CardGrid.template);
    }

    addCardFromData(cardData) {
        this.addCard( new this.cardType(cardData) );
    }

    addCard(card) {
        this.element.append(card.element);
    }

}