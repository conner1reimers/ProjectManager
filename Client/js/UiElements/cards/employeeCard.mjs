import { simpleGet, simplePost } from '../../request.mjs';
import { SimpleForm } from '../form/simpleForm.mjs';
import { ContextMenu } from '../static/contextMenu.mjs';
import { Modal } from '../static/modal.mjs';
import { Template } from '../static/template.mjs';
import { SfTemplates } from '../form/simpleFormTemplates.mjs';

export class EmployeeCard {

    static template = Template.createTemplate(`
        <div slot="card" class="employee-card flex-column">
            <div slot="pfp" class="pfp"></div>
            <p slot="name" class="name flex-grow">Firstname Lastname</p>
            <div class="wrapper flex-row">
                <p slot="role" class="role flex-grow"></p>
                <svg slot="context-button" class="context-button manager-view" viewBox="0 0 200 500"><circle cx="100" cy="250" r="50"/><circle cx="100" cy="125" r="50"/><circle cx="100" cy="375" r="50"/></svg>
            </div>
        </div>
    `);
    element;
    
    constructor(cardData) {
        if(!cardData) {
            this.element = Template.createElement( EmployeeCard.template, { 'card': { addClasses: ['invisible-card'] } } );
            return;
        }

        this.cardData = cardData;

        this.element = Template.createElement(
            EmployeeCard.template, 
            { 
                'pfp': { style: { backgroundImage: `url(/images/pfp/${cardData.id}.png)` } },
                'name': { innerHTML: cardData.firstname + " " + cardData.lastname },
                'role': { innerHTML: cardData.role },
                'context-button': {
                    events: { 
                        click: (evt) => { 
                            ContextMenu.show(
                                evt.target, 
                                {
                                    width: 154, 
                                    elements: [
                                        {label: 'Employee activity', event: () => pushHistory(`/employee/activity/${this.cardData.id}/${this.cardData.departmentId}`)},
                                        {label: 'Update details', event: this.updateMember.bind(this)}, 
                                        {label: 'Remove member', event: this.removeMember.bind(this)}
                                    ]
                                }, 
                                ['bottom', 'right']
                            ); 
                            evt.stopPropagation();
                            evt.preventDefault();
                        } 
                    } 
                }
            } 
        );

    }

    updateMember() {
        simpleGet(`/api/employee/${this.cardData.id}/${this.cardData.departmentId}`)
            .then(async (res) => { return {status: res.status, data: await res.json()}; })
            .then(res => {
                if(res.status === 200) {
                    const updateMemberForm = SimpleForm.createFromFormStruct(SfTemplates.updateEmployee, `/api/employee/update/${this.cardData.id}/${this.cardData.departmentId}`);
                    Modal.setContent('Update Member', updateMemberForm.reset(res.data).element)
                } else {
                    alert('Error updating member.')
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error updating member.')
            });
    }

    removeMember() {
        if(confirm(`Are you sure you want to remove member ${this.cardData.firstname} ${this.cardData.lastname}?`)) {
            simplePost('/api/employee/delete/' + this.cardData.departmentId, {id: this.cardData.id, departmentOnly: true})
                .then(async (res) => { return {status: res.status, data: await res.json()}; })
                .then(res => {
                    if(res.status === 200) {
                        softReload();
                    } else {
                        alert('Error removing member.')
                    }
                })
                .catch(err => {
                    alert('Error removing member.')
                });
        }
    }

}