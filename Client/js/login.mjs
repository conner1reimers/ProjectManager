import { simplePost } from './request.mjs';
import { SimpleForm, SfElements } from './UiElements/form/simpleForm.mjs';

const loginTemplate = {
    width: '400px',
    rows: [
        { elements: [ { type: SfElements.TextInput, params: ['username', 'Username'] } ]},
        { elements: [ { type: SfElements.TextInput, params: ['password', 'Password', { type: 'password' }] } ]},
        {
            options: { style: { paddingTop: '10px'} },
            elements: [ 
                { type: SfElements.InfoMsg, params: ['signInMsg', ''] },
                { type: SfElements.Button, params: ['signIn', 'Sign In', { width: '22%', type: 'submit' }] }
            ]
        }
    ]
};

const loginForm = SimpleForm.createFromFormStruct(loginTemplate, '/api/employee/auth', undefined, undefined, () => {window.location.reload()});

window.addEventListener('load', () => {
    const prompt = document.querySelector('#login-prompt');
    prompt.append(loginForm.element);
});

function onFormError(data) {
    console.log(data)
    Object.keys(data).forEach((key) => {
        if(key === 'msg')
            loginForm.content.signInMsg.setMessage(data[key]);
        else if(loginForm.content[key])
            loginForm.content[key].setError(data[key]);
    });
}