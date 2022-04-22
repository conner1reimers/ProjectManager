import { simpleGet, simplePost } from "../../request.mjs";


import { pushHistory } from "../history.mjs";
import { Template } from "./template.mjs";
import { App } from '../../app.mjs';


export class Navbar {

    static templates = {
        departmentTab: Template.createTemplate(`
            <div slot="tab" class="navbar-tab flex-row">
                <svg class="icon" viewBox="0 0 512 512"><circle cx="256.5" cy="271.5" r="82.5"/></svg>
                <p slot="name" class="label flex-grow">Department Name</p> 
            </div>`),
        userSessionDetails: Template.createTemplate(`
            <p slot="heading" class="heading">Working on</p>
            <p class="label">Project:</p>
            <p slot="project" class="link line-ellipsis-overflow"></p>
            <p class="label">Task:</p>
            <p slot="task" class="link line-ellipsis-overflow"></p>
        `),
        clockInResumeSessionPrompt: Template.createTemplate(`
            <p class="confirmation-message">Continue from last session?</p>
            <svg slot="accept" class="confirmation-icon accept icon" viewBox="0 0 512 512"><path d="M463.4,73.8c-7.8-7.8-20.6-7.8-28.4,0L198.6,310.1L76.9,187.6c-7.8-7.9-20.5-7.9-28.4,0L5.9,230.2c-7.8,7.8-7.8,20.6,0,28.4l178.5,179.6c7.8,7.8,20.5,7.8,28.4,0l293.3-293.4c7.9-7.8,7.9-20.7,0-28.5L463.4,73.8z"/></svg>
            <svg slot="reject" class="confirmation-icon reject icon" viewBox="0 0 512 512"><path d="M340.3,258.4c-1.3-1.3-1.3-3.5,0-4.8L501.5,92.3c13.8-13.8,13.8-36.2,0-50l-32-32C462.9,3.7,454,0,444.6,0c-9.4,0-18.3,3.7-25,10.4L258.4,171.6c-0.8,0.8-1.7,1-2.4,1c-0.6,0-1.6-0.2-2.4-1L92.4,10.4C85.8,3.7,76.9,0,67.4,0s-18.3,3.7-25,10.4l-32,32c-13.8,13.8-13.8,36.2,0,50l161.2,161.3c1.3,1.3,1.3,3.5,0,4.8L10.5,419.7c-13.8,13.8-13.8,36.2,0,50l32,32c6.7,6.7,15.6,10.4,25,10.4s18.3-3.7,25-10.4l161.2-161.3c0.8-0.8,1.7-1,2.4-1c0.6,0,1.6,0.2,2.4,1l161.2,161.3c6.7,6.7,15.6,10.4,25,10.4c9.4,0,18.3-3.7,25-10.4l32-32c13.8-13.8,13.8-36.2,0-50L340.3,258.4z"/></svg>
        `),
        clockInClockOutPrompt: Template.createTemplate(`
            <div class="icon"></div>
            <p class="clock-out-label label flex-grow">Clock-Out</p> 
        `),
        clockInErrorPrompt: Template.createTemplate(``)
    }

    static elements = {};

    static departments = { };
    static activeTabElement;

    static activeSession = {project: {name: '', id: '0'}, task: {name: '', id: '0'}, clockedInTime: undefined};
    static clockInTimerInterval = undefined;

    static maxUserMenuHeight = 186;

    static initialize() {
        this.elements.navbar = document.querySelector('#navbar');
        
        // Main navbar tabs
        this.elements.departmentsGroup = document.querySelector('#departments-tab');
        //this.elements.projectsTab = document.addEvents('#projects-tab', 'click', pushHistory.bind(null, `/department/projects/`));
        //this.elements.dealinesTab = document.addEvents('#deadlines-tab', 'click', pushHistory.bind(null, '/deadlines'));
        //this.elements.notifications = document.addEvents('#notifications-tab', 'click', alert.bind(null, 'Todo: notifications modal'));
        

        // User tab and menu
        this.elements.userMenu = document.querySelector('#navbar-user-tab-menu');
        this.elements.userTab = document.addEvents('#navbar-user-tab', 'click', this.toggleUserMenu.bind(this));
        
        this.elements.userPfp = document.querySelector('#navbar-pfp');
        this.elements.username = document.querySelector('#navbar-username'); 
        this.elements.userClockInStatus = document.querySelector('#navbar-user-clock-in-status');
        this.elements.userClockInIndicator = document.querySelector('#navbar-clock-in-indicator');
        this.elements.userClockInIndicatorLabel = document.querySelector('#navbar-clock-in-status-label');
        this.elements.userClockInTimeCount = document.querySelector('#navbar-clock-in-time-count');

        this.elements.settings = document.addEvents('#settings-tab', 'click', () => { 
            //document.cookie = "SID=";
            window.location.reload();
            //this.toggleUserMenu(false);       
            //alert('Todo: user settings modal');
        });
        this.elements.clockInGroup = document.querySelector('#clock-in-group');
        this.elements.clockInTab = document.addEvents('#clock-in-tab', 'click', this.clockInOut.bind(this));
        this.elements.clockInTabLabel = this.elements.clockInTab.querySelector('.label'),
        this.elements.clockInInfoPrompt = document.querySelector('#clock-in-info-prompt');
        this.elements.clockInSessionDetails = document.querySelector('#navbar-user-clock-in-session');

    }

    static setUser(user) {
        console.log(user)
        this.elements.username.innerHTML = user.firstname + ' ' + user.lastname.initial();
        this.elements.userPfp.css('backgroundImage', `url(/images/pfp/${user.id}.png)`);
        this.activeSession = user.activeSession;
        this.addDepartmentTabs(user.departments);
    }


    // Main navbar tabs
    static onDepartmentClick(id) {
        pushHistory('/department/' + id);
        console.log(id);
    }

    static addDepartmentTabs(departmentData) {
        this.removeDepartmentTabs();
        departmentData.forEach(department => {
            const tab = Template.createElement( 
                this.templates.departmentTab, 
                { 
                    'tab': { events: {'click': this.onDepartmentClick.bind(this, department.id)} },
                    'name': { innerHTML: department.name }
                } 
            );
            this.elements.departmentsGroup.append(tab);
            this.departments[department.id] = tab;
        });
    }

    static removeDepartmentTabs() {
        let tabs = this.elements.departmentsGroup.children
        for(let i=1; i<tabs.length; i++)
            tabs[i].remove();
        this.departments = {};
    }

    static setActiveDepartment(id) {
        this.clearActiveElement();
        if(this.departments[id]) {
            this.activeTabElement = this.departments[id];
            this.activeTabElement.classList.add('active');
        } else
            this.activeTabElement = undefined;
    }

    static clearActiveElement() {
        if(this.activeTabElement)
            this.activeTabElement.classList.remove('active');
    }



    // User tab and menu
    static setClockInIndicator(clockedIn) {
        const indicatorBubbleCl = this.elements.userClockInIndicator.classList;
        const indicatorLabel = this.elements.userClockInIndicatorLabel;
        if(clockedIn) {
            indicatorBubbleCl.add('clocked-in');
            indicatorLabel.innerHTML = 'Clocked-In';
            /*this.elements.userClockInTimeCount.classList.remove('hidden');
            this.clockInTimerInterval = setInterval(() => {
                if(this.activeSession.clockedInTime) {
                    const timeDifference = (Date.now() - this.activeSession.clockedInTime) / 60000;
                    this.elements.userClockInTimeCount.innerHTML = Math.floor(timeDifference / 60) + ':' + Math.round(timeDifference);
                }
            }, 30 * 1000);*/
        } else {
            indicatorBubbleCl.remove('clocked-in');
            indicatorLabel.innerHTML = 'Clocked-Out';
            /*this.elements.userClockInTimeCount.classList.add('hidden');
            clearInterval(this.clockInTimerInterval);*/
        }
    }

    static setUserMenuSize() {
        if(this.elements.userMenu.classList.contains('open'))
            this.elements.userMenu.css('height', this.maxUserMenuHeight+'px');
        else
            this.elements.userMenu.css('height', '60px');
    }

    static toggleUserMenu(show) { 
        const userMenuCl = this.elements.userMenu.classList;
        const userTabCl = this.elements.userTab.classList;

        if((show || show === undefined) && !userMenuCl.contains('open')) { // Open
            // Reset Menu
            this.elements.clockInGroup.classList.remove('disable-transitions');
            userMenuCl.add('open');
            userTabCl.add('active');
            window.addEventListener('click', this.onClickAway);
        } else {
            userMenuCl.remove('open');
            userTabCl.remove('active');
            window.removeEventListener('click', this.onClickAway);

            if(this.elements.clockInGroup.classList.contains('flair-prompt')) {
                this.elements.clockInGroup.classList.add('disable-transitions');
                this.setClockInGroupFlair('flair-clock-in');
                this.toggleClockInInfoPrompt(false);
                this.setClockInMenuSessionDetails();
            }
            
        }
        this.setUserMenuSize();
    }

    static onClickAway = ((evt) => {
        if (!this.elements.userMenu.contains(evt.target)) {
            this.toggleUserMenu(false);
        }
    }).bind(this); // Javascipt is really fucking stupid, bind() provides different signatures

    static setClockInGroupFlair(flairClass) {
        const clockInGroupCl = this.elements.clockInGroup.classList;
        clockInGroupCl.forEach((e) => {
            if(e.substring(0, 6) === 'flair-')
                clockInGroupCl.remove(e);
        });
        clockInGroupCl.add(flairClass);
    }

    // Clock-in proccess
    static clockInOut() {
        if(this.elements.clockInGroup.classList.contains('flair-clock-in')) { // Clock-in
            if(this.activeSession.project) {
                const resumePrompt = Template.createElement( 
                    this.templates.clockInResumeSessionPrompt, 
                    { 
                        'accept': { events: {'click': this.resumeSession.bind(this, true)} },
                        'reject': { events: {'click': this.resumeSession.bind(this, false)} }
                    } 
                );
                this.elements.clockInInfoPrompt.replaceChildren(...resumePrompt.children);
                
                // Toggle prompt
                this.setClockInGroupFlair('flair-prompt');
                this.toggleClockInInfoPrompt(true);
                this.setClockInMenuSessionDetails("Last Session Activty", false);
            } else
                this.clockInRequest({});
        } else { // Clock-out
            this.clockOutRequest();
        }
    }

    static toggleClockInInfoPrompt(show) {
        const clockInInfoPromptCl = this.elements.clockInInfoPrompt.classList;
        const clockInTabCl = this.elements.clockInTab.classList;

        if(show === undefined) {
            if(clockInInfoPromptCl.toggle('invisible'))
                clockInTabCl.remove('invisible');
            else
                clockInTabCl.add('invisible');
        } if(show) {
            clockInInfoPromptCl.remove('invisible');
            clockInTabCl.add('invisible');
        } else {
            clockInInfoPromptCl.add('invisible');
            clockInTabCl.remove('invisible');
        }  
    }

    static setClockInMenuSessionDetails(sessionDetailsHeading, isLinkable = true) {
        const clockInGroupCl = this.elements.clockInGroup.classList;
        console.log(this.activeSession)
        if(sessionDetailsHeading && this.activeSession.project) { // Open or update menu
            console.log(isLinkable)
            const sessionDetails = Template.createElement( 
                this.templates.userSessionDetails, 
                { 
                    'heading': { innerHTML: sessionDetailsHeading },
                    'project': { 
                        innerHTML: this.activeSession.project.name, 
                        events: { click: pushHistory.bind(null, '/project/' + this.activeSession.project.id) },
                        addClasses: [isLinkable ? 'active' : undefined]
                    },
                    'task': { 
                        innerHTML: this.activeSession.task ? this.activeSession.task.name : 'unspecified', 
                        events: { click: pushHistory.bind(null, '/task/' + (this.activeSession.task ? this.activeSession.task.id : this.activeSession.project.id) ) },
                        addClasses: [(isLinkable && this.activeSession.task) ? 'active' : undefined]
                    } 
                }
            );
            this.elements.clockInSessionDetails.replaceChildren(...sessionDetails.children);
            
            if(!clockInGroupCl.contains('open')) {
                this.maxUserMenuHeight += 110;
                this.setUserMenuSize();
                clockInGroupCl.add('open');
            }
        } else if(clockInGroupCl.contains('open')) { // Close menu
            this.maxUserMenuHeight -= 110;
            this.setUserMenuSize();
            clockInGroupCl.remove('open');
        }
    }

    static setClockInOutStyle(clockIn) {
        if(clockIn) {
            this.elements.clockInTabLabel.innerHTML = 'Clock-in';
            this.setClockInGroupFlair('flair-clock-in');
        } else {
            this.elements.clockInTabLabel.innerHTML = 'Clock-out';
            this.setClockInGroupFlair('flair-clock-out');
        }
    }

    static clockInRequest(body) {
        simplePost('/api/employee/clockIn', body)
            .then(res => {
                if(res.status > 400)
                    throw 'Login error';
                return res.json();
            })
            .then(jsonData => {
                // Set Clocked-in tab activeSession
                this.activeSession = jsonData;
                this.setClockInIndicator(true);
                this.setClockInOutStyle(false);
                this.toggleClockInInfoPrompt(false);
                this.setClockInMenuSessionDetails('Current Session Activity', true);
            })
            .catch((err) => { App.error(err, 'Clock in post failed.'); alert('Error clocking-in'); });
    }

    static clockOutRequest() {
        simplePost('/api/employee/clockOut')
            .then(res => {
                // Set Clocked-in tab
                this.setClockInOutStyle(true);
                this.setClockInIndicator(false);
                this.setClockInMenuSessionDetails();
            })
            .catch((err) => { App.error(err, 'Clock out failed.'); alert('Error clocking-out'); });
    }

    static resumeSession(resume) {
        if(resume)
            this.clockInRequest(this.activeSession);
        else 
            this.clockInRequest({});
    }

}