import { simpleGet, simplePost } from '../../request.mjs';
import { SimpleForm } from '../form/simpleForm.mjs';
import { SfTemplates } from '../form/simpleFormTemplates.mjs';
import { Modal } from '../static/modal.mjs';
import { ContextMenu } from '../static/contextMenu.mjs';
import { Template } from '../static/template.mjs';

export class DepartmentCard {

    static template = Template.createTemplate(`
        <a slot="card" class="department-card" href="">
            <div class="name-wrapper flex-row">
                <p slot="name" class="name flex-grow"></p>
                <svg slot="context-button" class="context-button manager-view" viewBox="0 0 200 500"><circle cx="100" cy="250" r="50"/><circle cx="100" cy="125" r="50"/><circle cx="100" cy="375" r="50"/></svg>            
            </div>
            ${/*<div class="status flex-row">
                <p slot="memberCount" class="count"></p>    
                <p>Members</p>
                <p class="divider">·</p>
                <p slot="projectCount" class="count"></p> 
                <p>Active Projects</p>
            </div>*/''}
        </a>
    `);
    element;
    
    constructor(cardData) {
        if(!cardData) {
            this.element = Template.createElement( DepartmentCard.template, { 'card': { addClasses: ['invisible-card'] } } );
            return;
        }

        this.cardData = cardData;
        this.element = Template.createElement(
            DepartmentCard.template, 
            { 
                'card': { href: '/department/' + cardData.id, events: {'click': onAnchorClick} },
                'name': { innerHTML: cardData.name },
                /*'memberCount': { innerHTML: '6' },
                'projectCount': { innerHTML: '8' },*/
                'context-button': {
                    events: { 
                        click: (evt) => { 
                            ContextMenu.show(
                                evt.target, 
                                {
                                    width: 200, 
                                    elements: [
                                        {label: 'Update details', event: this.updateDepartment.bind(this) }, 
                                        {label: 'Delete sub-department', event: this.removeDepartment.bind(this) }
                                    ]
                                }, 
                                ['top', 'right']
                            ); 
                            evt.stopPropagation();
                            evt.preventDefault();
                        } 
                    } 
                }
            } 
        );
    }

    updateDepartment() {
        simpleGet(`/api/department/details/${this.cardData.id}`)
            .then(async (res) => { console.log(res); return {status: res.status, data: await res.json()}; })
            .then(res => {
                if(res.status === 200) {
                    const updateDepartmentForm = SimpleForm.createFromFormStruct(SfTemplates.updateDepartment, '/api/department/update/' + this.cardData.id);
                    Modal.setContent('Update Department', updateDepartmentForm.reset(res.data).element)
                } else {
                    alert('Error updating department.')
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error updating department.')
            });
    }

    removeDepartment() {
        if(confirm(`Are you sure you want to delete department ${this.cardData.name}?`)) {
            simplePost('/api/department/delete/' + this.cardData.id, {})
                .then(async (res) => { return {status: res.status, data: await res.json()}; })
                .then(res => {
                    if(res.status === 200) {
                        softReload();
                    } else {
                        alert('Error removing department.')
                    }
                })
                .catch(err => {
                    alert('Error removing department.')
                });
        }
    }

}