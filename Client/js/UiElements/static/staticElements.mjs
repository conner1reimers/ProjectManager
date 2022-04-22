import { Breadcrumbs }  from './breadcrumbs.mjs';
import { Navbar }       from './navbar.mjs';
import { Article }      from './article.mjs';
import { Template }     from './template.mjs'
import { Modal } from './modal.mjs';
import { ContextMenu } from './contextMenu.mjs';
import { SelectorMenu } from './selectorMenu.mjs';

const StaticElements = [
    Breadcrumbs,
    Navbar,
    Article,
    Template,
    Modal,
    ContextMenu,
    SelectorMenu
];

export function initializeStaticElements() {
    StaticElements.forEach((e) => e.initialize());
}
