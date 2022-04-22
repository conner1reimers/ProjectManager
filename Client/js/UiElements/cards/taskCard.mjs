import { simpleGet, simplePost } from '../../request.mjs';
import { SimpleForm } from '../form/simpleForm.mjs';
import { SfTemplates } from '../form/simpleFormTemplates.mjs';
import { Modal } from '../static/modal.mjs';
import { Template } from '../static/template.mjs';
import { ContextMenu } from '../static/contextMenu.mjs';

export class TaskCard {

    static template = Template.createTemplate(`
        <div slot="card" class="task-card">
            <div class="flex-row task-card-header-row">
                <p slot="name" class="name flex-grow">Task name 69</p>
                <svg slot="context-button" class="context-button manager-view" viewBox="0 0 200 500"><circle cx="100" cy="250" r="50"></circle><circle cx="100" cy="125" r="50"></circle><circle cx="100" cy="375" r="50"></circle></svg>            
            </div>
            <div slot="description" class="task-card-description"></div>
            <div class="flex-row task-card-details-row">
                <div class="flex-row task-card-detail noPadding">
                    <select slot="status-value">
                        <option value="todo">To-do</option>
                        <option value="inProgress">In-progress</option>
                        <option value="complete">Complete</option>
                    </select>
                    <p class="label">Status</p>
                </div>
                <div class="flex-row task-card-detail">
                    <p slot="priority-value" class="value">HNL</p>
                    <p class="label">Priority</p>
                </div>
                <div slot="duedate" class="flex-row task-card-detail">
                    <p slot="duedate-value" class="value">04-20-1969</p>
                    <p class="label">Deadline</p>
                </div>
                <div class="flex-grow"></div>
                <div>
                    <div slot="logTask" class="heading-button">
                        <svg viewBox="0 0 512 512"><path d="M207,479.4c-1,0-2-0.1-3.1-0.2c-56.3-8.7-107.9-37.3-145.3-80.6C20.8,354.9,0,298.9,0,241c0-64.4,25.1-124.9,70.6-170.4S176.6,0,241,0c58.7,0,115.2,21.3,159.2,60c43.6,38.4,71.9,91,79.6,148.3c1.5,10.9-6.2,21-17.1,22.5c-11,1.5-21-6.2-22.5-17.1C426.7,114.7,341.1,40,241,40C130.2,40,40,130.2,40,241c0,98.3,73.1,183.7,170.1,198.6c10.9,1.7,18.4,11.9,16.7,22.8C225.2,472.3,216.7,479.4,207,479.4z M181.2,330l74-75c3.7-3.7,5.8-8.8,5.8-14V92c0-11-9-20-20-20c-11,0-20,9-20,20v140.8L152.8,302c-7.8,7.9-7.7,20.5,0.2,28.3c3.9,3.8,9,5.8,14,5.8C172.2,336,177.3,334,181.2,330L181.2,330z M511.7,401.6c2-10.9-5.2-21.3-16-23.3c-10.9-2-21.3,5.2-23.3,16c-8.3,45-47.6,77.6-93.4,77.6c-52.4,0-95-42.6-95-95s42.6-95,95-95c8.7,0,17.3,1.2,25.6,3.5c10.6,3,21.7-3.2,24.6-13.9c3-10.6-3.2-21.7-13.9-24.6c-11.8-3.3-24-5-36.4-5c-74.4,0-135,60.6-135,135s60.6,135,135,135C444,512,499.9,465.6,511.7,401.6L511.7,401.6z M403.6,411.7l87.4-86.5c7.9-7.8,7.9-20.4,0.1-28.3c-7.8-7.9-20.4-7.9-28.3-0.1l-83.9,83l-25.9-25.9c-7.8-7.8-20.5-7.8-28.3,0s-7.8,20.5,0,28.3l29.4,29.4c6.8,6.8,15.8,10.2,24.7,10.2C387.9,421.8,396.8,418.4,403.6,411.7L403.6,411.7z"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    `);
    element;
    
    constructor(cardData) {
        if(!cardData) {
            this.element = Template.createElement( TaskCard.template, { 'card': { addClasses: ['invisible-card'] } } );
            return;
        }

        this.cardData = cardData;
        console.log(this.cardData)
        this.element = Template.createElement(
            TaskCard.template, 
            { 
                'name': { innerHTML: cardData.name },
                'status-value': {
                    value: cardData.status,
                    events: {
                        'change': (evt) => {
                            simplePost(`/api/task/updateStatus/${this.cardData.id}/${this.cardData.pid}/${this.cardData.did}`, {status: evt.target.value})
                                .then(async (res) => { return {status: res.status, data: await res.json()}; })
                                .then(res => {
                                    if(res.status === 200) {
                                        softReload();
                                    } else {
                                        alert('Error updating status.')
                                    }
                                })
                                .catch(err => {
                                    alert('Error updating status.')
                                });
                        }
                    }
                },
                'description': { innerHTML: cardData.description },
                'priority-value': { innerHTML: cardData.priority },
                'duedate': { addClasses: [cardData.deadline ? '' : 'hidden'] },
                'duedate-value': { innerHTML: cardData.deadline ? new Date(cardData.deadline).toLocaleDateString() : '' },
                'context-button': {
                    events: { 
                        click: (evt) => { 
                            ContextMenu.show(
                                evt.target, 
                                {
                                    width: 170, 
                                    elements: [
                                        {label: 'Update task details', event: this.updateTask.bind(this)},
                                        {label: 'Delete task', event: this.removeTask.bind(this)}
                                    ]
                                }, 
                                ['top', 'right']
                            ); 
                            evt.stopPropagation();
                            evt.preventDefault();
                        } 
                    } 
                },
                'logTask': {
                    events: {
                        'click': () => simpleGet(`/api/project/setActivity/${this.cardData.pid}/${this.cardData.id}`)
                    }
                }
            } 
        );
    }

    updateTask() {
        simpleGet(`/api/task/details/${this.cardData.id}/${this.cardData.pid}/${this.cardData.did}`)
            .then(async (res) => { return {status: res.status, data: await res.json()}; })
            .then(res => {
                if(res.status === 200) {
                    const updateDepartmentForm = SimpleForm.createFromFormStruct(SfTemplates.updateTask, `/api/task/update/${this.cardData.id}/${this.cardData.pid}/${this.cardData.did}`);
                    Modal.setContent('Update Task Details', updateDepartmentForm.reset(res.data).element)
                } else {
                    alert('Error updating department.')
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error updating department.')
            });
    }

    removeTask() {
        if(confirm(`Are you sure you want to delete task ${this.cardData.name}?`)) {
            simplePost(`/api/task/delete/${this.cardData.id}/${this.cardData.pid}/${this.cardData.did}`, {})
                .then(async (res) => { return {status: res.status, data: await res.json()}; })
                .then(res => {
                    if(res.status === 200) {
                        softReload();
                    } else {
                        alert('Error removing task.')
                    }
                })
                .catch(err => {
                    alert('Error removing task.')
                });
        }
    }

}