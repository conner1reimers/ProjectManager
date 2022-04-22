import { ArticleAbc } from './articleAbc.mjs';

import { Article } from '../UiElements/static/article.mjs';
import { Template } from '../UiElements/static/template.mjs';

import { CardCarousel } from '../UiElements/cards/cardCarousel.mjs'
import { Navbar } from '../UiElements/static/navbar.mjs';
import { Button, ButtonSet } from '../UiElements/headings/selectors/buttonSet.mjs';
import { SubHeading } from '../UiElements/headings/headings.mjs';
import { EmployeeCard } from '../UiElements/cards/employeeCard.mjs'
import { CardGrid } from '../UiElements/cards/cardGrid.mjs';
import { ProjectCard } from '../UiElements/cards/projectCard.mjs';
import { TaskCard } from '../UiElements/cards/taskCard.mjs';
import { DepartmentCard } from '../UiElements/cards/departmentCard.mjs';
import { Modal } from '../UiElements/static/modal.mjs';
import { SimpleForm } from '../UiElements/form/simpleForm.mjs';
import { SfTemplates } from '../UiElements/form/simpleFormTemplates.mjs';
import { SliderButton } from '../UiElements/headings/selectors/slider.js';
import { SelectorMenu } from '../UiElements/static/selectorMenu.mjs';

export class ProjectsArticle extends ArticleAbc {

    static userAccess = {
        'manager':  0,
        'overseer': 1,
        'standard':  2
    }

    static statuses = [
        'todo',
        'inProgress',
        'complete',
        'all'
    ]

    static data = {};
    static filter = {
        status: ['notStarted', 'inProgress'],
        duedate: [],
        priority: []
    };

    static initialize(pathname, isSoftReload) {
        super.initialize(pathname, isSoftReload, this.filter)
            .then(this.onInitialRequestReady.bind(this))
            .catch(this.onInitialRequestError.bind(this));
    }

    static onInitialRequestReady(data) {
        this.data = data;
        Navbar.setActiveDepartment(data.id);
        if(this.isSoftReload)
            this.renderCardGrid() 
        else
            this.renderArticle();
        super.onInitialRequestReady(data);
    }

    static onInitialRequestError(err) {

        super.onInitialRequestError(err);
    }

    static renderArticle() {
        const isManager = this.userAccess[this.data.access] <= this.userAccess.overseer;

        Article.clear();
        SelectorMenu.create({
            heading: 'Filter',
            groups: [
                {
                    type: 'checkbox',
                    label: 'Status', value: 'status',
                    options: [
                        { label: 'Not Started', value: 'notStarted'},
                        { label: 'In Progess', value: 'inProgress'},
                        { label: 'Complete', value: 'completed' },
                    ]
                },
                {
                    type: 'checkbox',
                    label: 'Deadline', value: 'duedate',
                    options: [
                        { label: 'Over Due', value: 'overdue' },
                        { label: 'Due Today', value: 'dueToday' },
                        { label: 'No Dealine', value: 'noDueDate' },
                    ]
                }
            ],
            onChange: (filterOptions) => {
                this.filter.status = [];
                this.filter.duedate = [];
                this.filter.priority = [];
                Object.keys(filterOptions).forEach(option => {
                    if(filterOptions[option].isChecked)
                        this.filter[filterOptions[option].group].push(option);
                });
            }
        });



        // Set breadcrumbs
        const breadcrumbsButtonSet = new ButtonSet(
            [
                [Button.icons.edit, () => { new ProjectCard(this.data).updateProject(); }, 'Update project details', true],
            ]
        );
        Article.setBreadcrumbsPath(`/Department/${this.data.name}/Projects`, breadcrumbsButtonSet.element);

        const newProjectForm = SimpleForm.createFromFormStruct(SfTemplates.newProject, '/api/project/add/' + this.data.id);
        const taskButtonSet = new ButtonSet(
            [
                [Button.icons.add, () => Modal.setContent('Create New Project', newProjectForm.reset().element), 'New project', true],
                [Button.icons.filter, (evt) => {
                    evt.stopPropagation();
                    SelectorMenu.show(evt.target);
                }]
            ]
        );
        Article.append( new SubHeading('Projects', undefined, taskButtonSet).element);

        this.renderCardGrid();


        
        if(!isManager)
            document.querySelectorAll('.manager-view').forEach(element => { element.remove(); });
    }

    static renderCardGrid() {
        Article.resetScroll();

        if(this.projectGrid)
            this.projectGrid.element.remove();

        this.projectGrid = new CardGrid(ProjectCard);
        this.data.projects.forEach(project => {
            this.projectGrid.addCardFromData(project);
        });

        Article.append(this.projectGrid.element);
    }

    static updateTaskForm() {
        
    }

}


