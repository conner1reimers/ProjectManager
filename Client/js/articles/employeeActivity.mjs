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

export class EmployeeActivityArticle extends ArticleAbc {


    static statuses = [
        'todo',
        'inProgress',
        'complete',
        'all'
    ]

    static data = {};
    static filter = {
        timePeriod: [0]
    };

    static initialize(pathname, isSoftReload) {
        super.initialize(pathname, isSoftReload, this.filter)
            .then(this.onInitialRequestReady.bind(this))
            .catch(this.onInitialRequestError.bind(this));
    }

    static onInitialRequestReady(data) {
        this.data = data;
        if(this.isSoftReload)
            this.renderList() 
        else
            this.renderArticle();
        super.onInitialRequestReady(data);
    }

    static onInitialRequestError(err) {

        super.onInitialRequestError(err);
    }

    static renderArticle() {

        Article.clear();
        SelectorMenu.create({
            heading: 'Filter',
            groups: [
                {
                    type: 'radio',
                    label: 'Time Period', value: 'timePeriod',
                    options: [
                        { label: 'Today',           value: 1440 },
                        { label: 'Last 5 Days',     value: 7200 },
                        { label: 'Last 30 Days',    value: 43200 },
                        { label: 'Last 6 Months',   value: 262800 },    
                        { label: 'Last 12 Months',  value: 525601 },        
                        { label: 'All Time',        value: 0 }        
                    ]
                }
            ],
            onChange: (filterOptions, changed) => {
                this.filter.timePeriod = [parseInt(changed.value)];
            }
        });



        // Set breadcrumbs
        Article.setBreadcrumbsPath(`/Department/${this.data.firstname} ${this.data.lastname}/Activity`);


        // Activity List
        const activityButtonSet = new ButtonSet(
            [
                [Button.icons.filter, (evt) => {
                    evt.stopPropagation();
                    SelectorMenu.show(evt.target);
                }]
            ]
        );
        Article.append( new SubHeading(`Member Activity`, undefined, activityButtonSet).element);

        this.renderList();

    }

    static renderList() {
        Article.resetScroll();

        if(this.list)
            this.list.remove();

        this.list = document.createElement('div');
        this.list.classList.add('flex-column', 'activity-list');

        let innerHTML = `
            <div class="flex-row activity-list-heading">
                <p class="activity-list-label project">Project</p>
                <p class="activity-list-label task">Task</p>       
                <p class="activity-list-label duration">Duration</p>
                <p class="activity-list-label startTime">Start Time</p>
                <p class="activity-list-label endTime">End Time</p>         
            </div>
        `;

        this.data.activity.forEach((activity) => {
            innerHTML += `
                <div class="flex-row activity-list-entry">
                    <p class="activity-list-label project">${activity.project}</p>
                    <p class="activity-list-label task">${activity.task}</p>       
                    <p class="activity-list-label duration">${Math.round((new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime()) / 60000)} minutes</p>
                    <p class="activity-list-label startTime">${this.formatedDateTime(activity.startTime)}</p>
                    <p class="activity-list-label endTime">${this.formatedDateTime(activity.endTime)}</p>         
                </div>
            `;
        });

        this.list.innerHTML = innerHTML;
        Article.append(this.list);

    }

    static formatedDateTime(time) {
        const date = new Date(time);
        return date.getDate()+
                "/"+(date.getMonth()+1)+
                "/"+date.getFullYear()+
                " "+date.getHours()+
                ":"+date.getMinutes()+
                ":"+date.getSeconds();
    }
}


