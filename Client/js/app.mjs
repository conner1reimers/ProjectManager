import { simpleGet } from './request.mjs';
import { pushHistory } from './UiElements/history.mjs'

// Static Elements
import { initializeStaticElements } from './UiElements/static/staticElements.mjs';
import { Navbar } from './UiElements/static/navbar.mjs';

// Articles
//import UserProfileArticle from './articles/userProfile.js';
import { DepartmentArticle } from './articles/department.mjs';
import { ProfilePic } from './tools/pfpGenerator.mjs';
import { ProjectArticle } from './articles/project.mjs';
import { ProjectsArticle } from './articles/projects.mjs';
import { EmployeeActivityArticle } from './articles/employeeActivity.mjs'
//import { ProjectListArticle } from './articles/projects.js';


//import { Form, FormRow, FormTextInput } from './UiElements/form/formElement.mjs';

import { SimpleForm } from './UiElements/form/simpleForm.mjs';
import { SfTemplates } from './UiElements/form/simpleFormTemplates.mjs';
import { ContextMenu } from './UiElements/static/contextMenu.mjs';
import { SelectorMenu } from './UiElements/static/selectorMenu.mjs';
import { Modal } from './UiElements/static/modal.mjs';

window.addEventListener('load', () => App.initialize(), { once: true } );
export class App {

    static Articles = {
        UserProfile:        0, 
        Department:         1,
        Project:            2,
        ProjectDetails:     3,
        Task:               4,
        ProjectsList:       5,
        Deadlines:          6,
        Error:              7
    };

    static UserAccess = {
        'root':         0,
        'lead':         1,
        'task-edit':    2,
        'task-modify':  3,
        'view-only':    4,
        'oversees':     5
    }

    static currentArticle;
    static currentPath;
    static user;

    static initialize() {
        simpleGet('/api/employee/account')
            .then(res => res.json())
            .then(data => { 
                this.user = data;
                Navbar.setUser(data);

                //if(this.)
                //pushHistory('/department/'+ );
            })
            .catch((err) => console.log(err)/*.error(err, 'Failed to load user data.')*/);
            
        initializeStaticElements();
        this.updateArticle(window.location.pathname);
        window.addEventListener('locationchange', () => { this.updateArticle(window.location.pathname); } );
        console.log(ProfilePic.generate('JH').substring(22));
        //
    }

    static updateArticle(pathname, query) {
        
        ContextMenu.hide();
        //SelectorMenu.hide();
        Modal.hide();

        const path = pathname.substring(1).split('/');
        switch(path[0]) {
            case 'employee':    { 
                if(path[1] === 'activity')
                    App.currentArticle = EmployeeActivityArticle;
                else
                    return; 
            } break;
            case 'department':  { 
                if(path[1] === 'projects')
                    App.currentArticle = ProjectsArticle;
                else
                    App.currentArticle = DepartmentArticle; 
            } break;
            case 'project':     { App.currentArticle = ProjectArticle; } break;
            //case 'task':        { App.currentArticle = TaskArticle; } break;   
            //case 'projects':    { App.currentArticle = ProjectListArticle; } break;   
            //case 'deadlines':   { App.currentArticle = DeadlinesArticle; } break;   
            default:            { return } break;   
        }
        console.log(this.currentPath, pathname);
        App.currentArticle.initialize(pathname, this.currentPath === pathname);
        this.currentPath = pathname;
    }

    static error(err, msg) {
        console.log(msg);
        console.error(err);
    }

}