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

export class ProjectArticle extends ArticleAbc {

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
        status: ['todo'],
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
        Navbar.setActiveDepartment(data.department.id);
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
                    label: 'Deadline', value: 'duedate',
                    options: [
                        { label: 'Over Due', value: 'overdue' },
                        { label: 'Due Today', value: 'dueToday' },
                        { label: 'No Dealine', value: 'noDueDate' },
                    ]
                },
                {
                    type: 'checkbox',
                    label: 'Priority', value: 'priority',
                    options: [
                        { label: 'Low', value: 'low' },
                        { label: 'Normal', value: 'normal' },
                        { label: 'High', value: 'high' },
                    ]
                }
            ],
            onChange: (filterOptions) => {
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
                [Button.icons.timecard, undefined, 'Log project hours'],
            ]
        );
        Article.setBreadcrumbsPath(`/Department/${this.data.department.name}/${this.data.name}`, breadcrumbsButtonSet.element);


        // Task List
        const taskSlider = new SliderButton(
            [
                {label: 'To-do', event: this.onSliderClick.bind(this, 'todo')}, 
                {label: 'In-progress', event: this.onSliderClick.bind(this, 'inProgress')}, 
                {label: 'Complete', event: this.onSliderClick.bind(this, 'complete')}, 
                {label: 'All', event: this.onSliderClick.bind(this, 'all')}
            ], 
            this.statuses.indexOf(this.filter.status[0])
        );
        const addTaskForm = SimpleForm.createFromFormStruct(SfTemplates.addTask, `/api/task/add/${this.data.id}/${this.data.department.id}`);
        const taskButtonSet = new ButtonSet(
            [
                [Button.icons.add, () => Modal.setContent('Add New Task', addTaskForm.reset().element), 'New task', true],
                [Button.icons.filter, (evt) => {
                    evt.stopPropagation();
                    SelectorMenu.show(evt.target);
                }]
            ]
        );
        Article.append( new SubHeading('Project Tasks', undefined, taskButtonSet, taskSlider).element);

        this.renderCardGrid();


        
        if(!isManager)
            document.querySelectorAll('.manager-view').forEach(element => { element.remove(); });
    }

    static renderCardGrid() {
        Article.resetScroll();

        if(this.taskGrid)
            this.taskGrid.element.remove();

        this.taskGrid = new CardGrid(TaskCard);
        this.data.tasks.forEach(task => {
            task.pid = this.data.id;
            task.did = this.data.department.id;
            this.taskGrid.addCardFromData(task);
        });
        for(let i=0; i<3-(this.data.tasks.length % 3); i++)
            this.taskGrid.addCardFromData();
        Article.append(this.taskGrid.element);
    }

    static onSliderClick(status) {
        this.filter.status = [status];
        softReload();
    }

    static updateTaskForm() {
        
    }

}


