import { simpleGet, simplePost } from '../../request.mjs';
import { SimpleForm } from '../form/simpleForm.mjs';
import { SfTemplates } from '../form/simpleFormTemplates.mjs';
import { Modal } from '../static/modal.mjs';
import { Template } from '../static/template.mjs';
import { ContextMenu } from '../static/contextMenu.mjs';

export class ProjectCard {

    static template = Template.createTemplate(`
        <a slot="card" class="project-card" href="">
            <div class="name-wrapper flex-row">
                <p slot="name" class="name flex-grow"></p>
                <svg slot="context-button" class="context-button manager-view" viewBox="0 0 200 500"><circle cx="100" cy="250" r="50"/><circle cx="100" cy="125" r="50"/><circle cx="100" cy="375" r="50"/></svg>            
            </div>
            <p slot="description" class="description"></p>
            <div class="status flex-row">
                <p class="label">Deadline:</p>
                <p slot="deadline"></p> 
                <div class="flex-grow"></div>
                <p slot="taskPercent" class="label"></p>
                <div class="progress-bar"><div slot="progessBar" class="progress"></div></div>                       
            </div>
        </a>
    `);
    element;
    
    constructor(cardData) {
        if(!cardData) {
            this.element = Template.createElement( EmployeeCard.template, { 'card': { addClasses: ['invisible-card'] } } );
            return;
        }

        this.cardData = cardData;
        console.log(cardData.numberOfTask , cardData.numberOfCompleteTask)
        this.element = Template.createElement(
            ProjectCard.template, 
            { 
                'card': { href: '/project/' + cardData.id, events: {'click': onAnchorClick} },
                'name': { innerHTML: cardData.name },
                'description': { innerHTML: cardData.description },
                'deadline': { innerHTML: new Date(cardData.deadline).toLocaleDateString() },
                'taskPercent': { innerHTML: ( cardData.numberOfTask === 0 ? 0 : Math.round(cardData.numberOfCompleteTask / cardData.numberOfTask * 100) ) + '%'},
                'progessBar': { style: {'width': ( cardData.numberOfTask === 0 ? 0 : Math.round(cardData.numberOfCompleteTask / cardData.numberOfTask * 100) ) + '%'} },
                'context-button': {
                    events: { 
                        click: (evt) => { 
                            ContextMenu.show(
                                evt.target, 
                                {
                                    width: 170, 
                                    elements: [
                                        {label: 'Update details', event: this.updateProject.bind(this)}, 
                                        {label: 'Delete project', event: this.removeProject.bind(this)}
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

    updateProject() {
        simpleGet(`/api/project/details/${this.cardData.id}`)
            .then(async (res) => { return {status: res.status, data: await res.json()}; })
            .then(res => {
                if(res.status === 200) {
                    const updateProjectForm = SimpleForm.createFromFormStruct(SfTemplates.updateProject, '/api/project/update/' + this.cardData.id);
                    Modal.setContent('Update project', updateProjectForm.reset(res.data).element)
                } else {
                    alert('Error updating project.')
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error updating project.')
            });
    }

    removeProject() {
        if(confirm(`Are you sure you want to delete project ${this.cardData.name}?`)) {
            simplePost('/api/project/delete/' + this.cardData.id, {})
                .then(async (res) => { return {status: res.status, data: await res.json()}; })
                .then(res => {
                    if(res.status === 200) {
                        softReload();
                    } else {
                        alert('Error removing project.')
                    }
                })
                .catch(err => {
                    alert('Error removing project.')
                });
        }
    }

}