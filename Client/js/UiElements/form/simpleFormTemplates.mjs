import { SfElements, SfJustify } from './simpleForm.mjs';

export const SfTemplates = {

    newEmployee: {
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['pfp', 'pfp', {hidden: true}] },
                { type: SfElements.TextInput, params: ['firstname', 'Firstname'] }, 
                { type: SfElements.TextInput, params: ['lastname', 'Lastname'] }
            ]},
            { elements: [ 
                { type: SfElements.TextInput, params: ['email', 'Email Address', { width: '55%' }] },
                { type: SfElements.TextInput, params: ['username', 'Username'] }, 
            ]},
            { elements: [ 
                { type: SfElements.Dropdown, params: ['department', 'Department',
                    '?departmentOptions',
                    {width: '70%'}
                ]},
                { type: SfElements.TextInput, params: ['wage', 'Wage', {type: 'number', paddedContent: ['$'] }] } 
            ]},
            { elements: [
                { type: SfElements.Dropdown, params: ['access', 'Access level',
                    [
                        {value: '', text:'Select access level'},
                        {value: 'standard', text:'Standard'},
                        {value: 'asstManager', text:'Assistant Manager'},
                        {value: 'manager', text:'Manager'},
                        {value: 'overseer', text:'Overseer'},
                    ]
                ]}, 
                { type: SfElements.TextInput, params: ['role', 'Role'] }
            ]},
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Create', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },
    
    updateEmployee: {
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['firstname', 'Firstname'] }, 
                { type: SfElements.TextInput, params: ['lastname', 'Lastname'] }
            ]},
            { elements: [ 
                { type: SfElements.TextInput, params: ['email', 'Email Address'] },
            ]},
            { elements: [ 
                { type: SfElements.TextInput, params: ['username', 'Username', {width: '70%'}] },
                { type: SfElements.TextInput, params: ['wage', 'Wage', {type: 'number', paddedContent: ['$'] }] } 
            ]},
            { elements: [
                { type: SfElements.Dropdown, params: ['access', 'Access level',
                    [
                        {value: '', text:'Select access level'},
                        {value: 'standard', text:'Standard'},
                        {value: 'asstManager', text:'Assistant Manager'},
                        {value: 'manager', text:'Manager'},
                        {value: 'overseer', text:'Overseer'},
                    ]
                ]}, 
                { type: SfElements.TextInput, params: ['role', 'Role'] }
            ]},
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Update', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },

    addDepartment: {
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['name', 'Department Name'] }, 
                { type: SfElements.Dropdown, params: ['manager', 'Manager', '?managerOptions', {width: '40%'}]}
            ]},
            { elements: [ 
                { type: SfElements.TextArea, params: ['description', 'Description'] }
            ]},
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Create', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },

    updateDepartment: { 
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['name', 'Department Name'] }, 
            ]},
            { elements: [ 
                { type: SfElements.TextArea, params: ['description', 'Description'] }
            ]},
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Update', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },


    newProject: { // Name, description, deadline, budget
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['name', 'Project Name'] }, 
                { type: SfElements.TextInput, params: ['deadline', 'Deadline', {width: '40%', type: 'date'}] }, 
            ]},
            { elements: [ 
                { type: SfElements.TextArea, params: ['description', 'Description'] }
            ]},
            /*{ elements: [ 
                { type: SfElements.MemberList, params: ['Assigned to Project'] }
            ]},*/
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Create', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },

    updateProject: { // Name, description, deadline, budget
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['name', 'Project Name'] }, 
                { type: SfElements.TextInput, params: ['deadline', 'Deadline', {width: '40%', type: 'date'}] }, 
            ]},
            { elements: [ 
                { type: SfElements.TextArea, params: ['description', 'Description'] }
            ]},
            /*{ elements: [ 
                { type: SfElements.MemberList, params: ['Assigned to Project'] }
            ]},*/
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Update', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },


    addTask: { // Name, description, deadline, budget
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['name', 'Task Name'] }, 
                { type: SfElements.Dropdown, params: ['status', 'Status',
                    [
                        {value: '', text:'Select start status'},
                        {value: 'todo', text:'Todo'},
                        {value: 'inProgress', text:'In Progress'},
                        {value: 'complete', text:'Complete'}
                    ],
                    {width: '30%', focus: 'true'}
                ]}, 
            ]},
            { elements: [ 
                { type: SfElements.Dropdown, params: ['priority', 'Priority',
                    [
                        {value: '', text:'Select priority'},
                        {value: 'low', text:'Low'},
                        {value: 'normal', text:'Normal'},
                        {value: 'high', text:'High'}
                    ]
                ]}, 
                { type: SfElements.TextInput, params: ['deadline', 'Deadline', { type: 'date' }] }
            ]},
            { elements: [ 
                { type: SfElements.TextArea, params: ['description', 'Description'] }
            ]},
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Create', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },
    
    updateTask: { // Name, description, deadline, budget
        width: '550px',
        rows: [
            { elements: [ 
                { type: SfElements.TextInput, params: ['name', 'Task Name'] }, 
                { type: SfElements.Dropdown, params: ['status', 'Status',
                    [
                        {value: '', text:'Select start status'},
                        {value: 'todo', text:'Todo'},
                        {value: 'inProgress', text:'In Progress'},
                        {value: 'complete', text:'Complete'}
                    ],
                    {width: '30%', focus: 'true'}
                ]}, 
            ]},
            { elements: [ 
                { type: SfElements.Dropdown, params: ['priority', 'Priority',
                    [
                        {value: '', text:'Select priority'},
                        {value: 'low', text:'Low'},
                        {value: 'normal', text:'Normal'},
                        {value: 'high', text:'High'}
                    ]
                ]}, 
                { type: SfElements.TextInput, params: ['deadline', 'Deadline', { type: 'date' }] }
            ]},
            { elements: [ 
                { type: SfElements.TextArea, params: ['description', 'Description'] }
            ]},
            {
                options: { style: { paddingTop: '12px'} },
                elements: [ 
                    { type: SfElements.InfoMsg, params: ['submitMsg', ''] },
                    { type: SfElements.Button, params: ['submit', 'Update', { width: '22%', type: 'submit' }] }
                ]
            }
        ]
    },

    userActivity: { // Name, description, deadline, budget
        width: '550px',
        rows: [

        ]
    },


    /*project&TaskMemberAssignment: { // Not simple form
        width: '550px',
        rows: [

        ]
    },*/



}