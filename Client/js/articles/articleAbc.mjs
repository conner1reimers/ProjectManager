import { simpleGet, simplePost } from '../request.mjs';
import { Article } from '../UiElements/static/article.mjs';

export class ArticleAbc {

    static data = {};

    static initialize(pathname, isSoftReload, reqBody) {
        this.isSoftReload = isSoftReload;
        if(reqBody) {
            return simplePost('/api' + pathname, reqBody)
                .then(response => response.json());
        } else {
            return simpleGet('/api' + pathname)
                .then(response => response.json());
        }
    }

    static onInitialRequestReady(res) {
        
    }

    static onInitialRequestError(err) {
        console.error(err);
    }

    static renderArticle() { console.error('Render article has not been implemented'); }
    static updateArticle() { console.error('Update article has not been implemented'); }

}