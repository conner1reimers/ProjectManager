export class Breadcrumbs {

    static element;

    static initialize() {
        this.element = document.querySelector('#breadcrumbs');
    }

    static _appendPathPart(part) {
        const lastChild = this.element.lastElementChild;
        if(lastChild)
            lastChild.classList.remove("active");

        this.element.innerHTML += (
            `   <p class="divider">/</p> 
                <p class="link active">${part.capitalize()}</p>`
        );
    }

    static appendPath(path, selector) {
        const pathParts = path.substring(1).split('/');
        pathParts.forEach((element) => {
            this._appendPathPart(element);
        });

        this.element.innerHTML += `<div class="flex-grow"></div>`;
        console.log(selector)
        if(selector) {
            this.element.append(selector);
        }
    }

    static updatePath(path, selector) {
        this.element.innerHTML = '';
        this.appendPath(path, selector)
    }

}