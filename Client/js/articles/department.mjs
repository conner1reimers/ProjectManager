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
import { DepartmentCard } from '../UiElements/cards/departmentCard.mjs';
import { Modal } from '../UiElements/static/modal.mjs';
import { SimpleForm } from '../UiElements/form/simpleForm.mjs';
import { SfTemplates } from '../UiElements/form/simpleFormTemplates.mjs';
import { ProfilePic } from '../tools/pfpGenerator.mjs';

export class DepartmentArticle extends ArticleAbc {

    static userAccess = {
        'manager':  0,
        'overseer': 1,
        'standard':  2
    }

    static data = {};

    static initialize(pathname, isSoftReload) {
        super.initialize(pathname, isSoftReload)
            .then(this.onInitialRequestReady.bind(this))
            .catch(this.onInitialRequestError.bind(this));
    }

    static onInitialRequestReady(data) {
        this.data = data;
        Navbar.setActiveDepartment(data.id);
        this.renderArticle();
        super.onInitialRequestReady(data);
    }

    static onInitialRequestError(err) {

        super.onInitialRequestError(err);
    }

    static renderArticle() {
        const isManager = this.userAccess[this.data.access] <= this.userAccess.overseer;

        Article.clear();
        if(!this.isSoftReload)
            Article.resetScroll();

        // Set breadcrumbs
        Article.setBreadcrumbsPath(`/Department/${this.data.name}`, (new ButtonSet([[Button.icons.edit, () => { new DepartmentCard(this.data).updateDepartment(); }, 'Update department details', true]])).element);


        // Member Carousel
        const departmentOptions = [{value: '', text:'Select a department'}, {value: this.data.id, text: this.data.name}]
        this.data.subdepartments.forEach(department => departmentOptions.push({value: department.id, text: department.name}));
        const addMemberForm = SimpleForm.createFromFormStruct(SfTemplates.newEmployee, '/api/employee/add/', 
            (data) => {
                data.pfp = ProfilePic.generate(data.firstname[0]+data.lastname[1]).substring(22);
            }, { 'departmentOptions': departmentOptions });
        const membersButtonSet = new ButtonSet( [[Button.icons.add, () => Modal.setContent('Add Member', addMemberForm.reset().element), 'New member', true]] );
        Article.append( 
            new SubHeading (
                'Department Members', 
                undefined,
                membersButtonSet
            ).element 
        );
        this.memberCarousel = new CardCarousel(EmployeeCard, 6);
        membersButtonSet.appendButton([this.memberCarousel.prevButton, this.memberCarousel.nextButton]);
        this.data.employees.forEach(employeeData => {
            employeeData.departmentId = this.data.id;
            this.memberCarousel.addCard(employeeData)
        });
        Article.append(this.memberCarousel.element);


        // Sub-department List
        if(isManager || this.data.subdepartments.length > 0) {
            const managerOptions = [{value: '', text:'Select a manager'}]
            this.data.employees.forEach(employee => managerOptions.push({value: employee.id, text: employee.firstname + " " + employee.lastname}));
            const addDepartmentForm = SimpleForm.createFromFormStruct(SfTemplates.addDepartment, '/api/department/add/' + this.data.id, undefined, { 'managerOptions': managerOptions });
            const subDepartButtonSet = new ButtonSet([[Button.icons.add, () => Modal.setContent('Add Sub-Department', addDepartmentForm.reset().element), 'New department', true]]);
            Article.append( new SubHeading('Sub-Departments', undefined, subDepartButtonSet).element );
            
            const departmentGrid = new CardGrid(DepartmentCard);
            this.data.subdepartments.forEach(department => departmentGrid.addCardFromData(department));
            for(let i=0; i<3-(this.data.subdepartments.length % 3); i++)
                departmentGrid.addCardFromData();
            Article.append(departmentGrid.element);
        }        
        

        // Project List
        const newProjectForm = SimpleForm.createFromFormStruct(SfTemplates.newProject, '/api/project/add/' + this.data.id);
        const projectButtonSet = new ButtonSet([[Button.icons.add, () => Modal.setContent('Create New Project', newProjectForm.reset().element), 'New project', true]]);
        Article.append( new SubHeading('Active Projects', {label: 'all projects', event: () => pushHistory(`/department/projects/${this.data.id}`)}, projectButtonSet).element);

        const projectGrid = new CardGrid(ProjectCard);
        this.data.projects.forEach(project => projectGrid.addCardFromData(project));
        Article.append(projectGrid.element);


        
        if(!isManager)
            document.querySelectorAll('.manager-view').forEach(element => { element.remove(); });
    }


}

