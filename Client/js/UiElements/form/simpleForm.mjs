import { simplePost } from "../../request.mjs";
import { Template } from "../static/template.mjs";
import { Button } from "../headings/selectors/buttonSet.mjs";

export const SfJustify = {
    Left:   'left',
    Center: 'center',
    Right:  'right'
};


export class SimpleForm {
    static createFromFormStruct(struct, postPath, dataPreProccess, varParams, onSubmit) {
        const form = new SimpleForm(struct.width, postPath, dataPreProccess, onSubmit);

        struct.rows.forEach(rowData => {
            const row = new SfRow(rowData.options);

            rowData.elements.forEach(formElement => {
                formElement.params = this.replaceVarParam(formElement.params.slice(), varParams);
                row.addFormElement(new formElement.type(...formElement.params));
            });

            form.addRow(row);
        });

        return form;
    }

    static simpleSubmit(evt, form, postPath, dataPreProccess, onSubmit) {
        
        evt.preventDefault();
        console.log(evt)
        const formData = new FormData(evt.target);
        const jsonBody = {};
        for(let [key, value] of formData.entries()) {
            try {
                jsonBody[key] = JSON.parse(value);
            } catch {
                jsonBody[key] = value;
            }
        }

        if(dataPreProccess)
            dataPreProccess(jsonBody);
    
        simplePost(postPath, jsonBody)
            .then(async (res) =>  { 
                return {status: res.status, data: await res.json()};
            })
            .then(res => {
                if(res.status === 200) {
                    if(onSubmit)
                        onSubmit();
                    else {  // Default success evt
                        softReload();
                    }
                } else {
                    console.log(res.data)
                    Object.keys(res.data).forEach((key) => {
                        if(key === 'msg' && form.content.submitMsg)
                            form.content.submitMsg.setMessage(res.data[key]);
                        else if(form.content[key])
                            form.content[key].setError(res.data[key]);
                    });
                }
            })
            .catch(err => {
                console.log(err)
                loginForm.content.signInMsg.setMessage('Unexpected sign in error');
            });

    }

    static replaceVarParam(params, varParams) {
        for(let i=0; i<params.length; i++) {
            let param = params[i];
            
            if(typeof param === 'string') {
                if(this.isQueryString(param)) 
                    params[i] = varParams[param.substring(1)];
            } else if(Array.isArray(param)) {
                this.replaceVarParam(params[i], varParams);
            } else if(typeof param === 'object'){
                Object.keys(param).forEach((key) => {
                    if(this.isQueryString(param[key]))
                        params[i][key] = varParams[param[key].substring(1)];
                });
            }
        }

        return params;
    }
    static isQueryString(str) { return typeof str === 'string' && str.charAt(0) === '?'; }



    element;
    static template = Template.createTemplate(`<form slot="form"></form>`);

    content = {};
    rows = [];

    constructor(width, postPath, dataPreProccess, onSubmit) {
        this.element = Template.createElement( 
            SimpleForm.template,
            { 'form': { style: { width: width }, events: { submit: (evt) => SimpleForm.simpleSubmit(evt, this, postPath, dataPreProccess, onSubmit) } } } 
        );
    }

    addRow(formRowObj) {
        this.element.append(formRowObj.element);
        this.rows.push(formRowObj);
        this.content = Object.assign(this.content, formRowObj.content)
    }

    updateContent() {
        this.content = {};
        this.rows.forEach( row => this.content = Object.assign(this.content, row.content) );
    }

    reset(values) {
        Object.keys(this.content).forEach((key) => {
            this.content[key].reset();
            if(values && values[key])
                this.content[key].setValue(values[key]);
        });

        return this;
    }

    setContent(contentValues) {
        Object.keys(this.content).forEach((key) => {
            this.content[key].setContent(contentValues[key]);
        });
    }

}

export class SfRow {
    element;
    static template = Template.createTemplate(`<div slot="row" class="form-row"></div>`)

    content = {};
    
    constructor(options = {}) {
        this.element = Template.createElement( 
            SfRow.template, 
            { 'row': { style: options.style } }
        );
    }

    addFormElement(formElementObj) { 
        this.element.append(formElementObj.element); 
        this.content[formElementObj.name] = formElementObj;
    }
}


class SfElement {
    element;
    static template = Template.createTemplate(`<div slot='element' class="form-element"></div>`);

    name;

    constructor(name, options = {}) {
        this.name = name;
        this.element = Template.createElement( 
            SfElement.template, 
            {'element': { style: {maxWidth: options.width, minWidth: options.width} } }
        );
    }
    
    onFocus() { this.element.classList.add('focused'); }

    onBlur() { this.element.classList.remove('focused'); }

    setErrorFlair(setFlair) {
        if(setFlair)
            this.element.classList.add('error');
        else
            this.element.classList.remove('error');
    }

    setError() { this.setErrorFlair(true); }
    clearError() { this.setErrorFlair(false); }

    setContent(content) { this.element.append(content); }

    reset() { }

    setValue(value) { }
    clearValue() { }
}


export class SfTextInput extends SfElement {

    static template = Template.createTemplate(`
        <div slot="label-wrapper" class="form-element-label"><p slot="label"></p></div>
        <input slot="input" type="text" name="">
        <div slot="error" class="form-input-error invisible"><svg viewBox="0 0 512 512"><path d="M256,0C114.5,0,0,114.5,0,256c0,141.5,114.5,256,256,256c141.5,0,256-114.5,256-256C512,114.5,397.5,0,256,0z M256,476.3c-121.5,0-220.3-98.8-220.3-220.3S134.5,35.7,256,35.7S476.3,134.5,476.3,256S377.5,476.3,256,476.3z"/><path d="M371.7,371.7L371.7,371.7c8.9-8.9,8.9-23.2,0-32.1L172.4,140.3c-8.9-8.9-23.2-8.9-32.1,0l0,0c-8.9,8.9-8.9,23.2,0,32.1l199.2,199.2C348.4,380.5,362.8,380.5,371.7,371.7z"/><path d="M140.3,371.7L140.3,371.7c8.9,8.9,23.2,8.9,32.1,0l199.2-199.2c8.9-8.9,8.9-23.2,0-32.1l0,0c-8.9-8.9-23.2-8.9-32.1,0L140.3,339.6C131.5,348.4,131.5,362.8,140.3,371.7z"/></svg><p slot="error-msg"></p></div>
    `);

    paddedContent;

    constructor(name, label = '', options = {}) {
        super(name, options);
        this.type = options.type ? options.type : 'text';

        const input = Template.createElement( 
            SfTextInput.template, 
            { 
                'label': { innerHTML: label},
                'input': { 
                    type: this.type,
                    name: name, 
                    value: options.value ? options.value : '', 
                    events: {
                        'focus': this.onFocus.bind(this),
                        'blur': this.onBlur.bind(this),
                    }
                }
            } 
        );
        this.setContent(input);
       
        this.inputElement = this.element.querySelector('[slot=input]');
        if(options.disabled) {
            this.inputElement.setAttribute('disabled', '');
            this.inputElement.classList.add('disabled');
        }
        if(options.focus) {
            this.inputElement.focus();
            this.onFocus();
        }
        this.labelWrapperElement = this.element.querySelector('[slot=label-wrapper]');
        if(options.hidden) 
            this.element.css('display', 'none');
        this.labelElement = this.element.querySelector('[slot=label]');
        this.errorElement = this.element.querySelector('[slot=error]');
        this.errorMsgElement = this.element.querySelector('[slot=error-msg]');

        if(this.type === 'date')
            this.labelWrapperElement.classList.add('focused');

        if(options.paddedContent) {
            this.paddedContent = new SfElementPaddedContent(...options.paddedContent);
            this.element.append(this.paddedContent.element);

            // Temp to computed width
            const tempPaddedContent = new SfElementPaddedContent(...options.paddedContent).element;
            tempPaddedContent.classList.add('invisible', 'absolute');
            document.body.append(tempPaddedContent);

            setTimeout(() => {
                this.inputElement.css('paddingLeft', tempPaddedContent.clientWidth + 12 + 'px');
                this.labelWrapperElement.css('left', tempPaddedContent.clientWidth + 11 + 'px');
                tempPaddedContent.remove();
            }, 0);
        }
    }

    onFocus() {
        super.onFocus();
        this.labelWrapperElement.classList.add('focused');
    }

    onBlur() {
        super.onBlur();
        if(this.inputElement.value.length === 0 && this.type !== 'date')
            this.labelWrapperElement.classList.remove('focused');
    }

    setError(msg) {
        super.setError();
        if(msg) {
            this.errorElement.classList.remove('invisible');
            this.errorMsgElement.innerHTML = msg;
        }
    }

    clearError() {
        super.clearError();
        this.errorElement.classList.add('invisible');
    }

    reset() {
        this.clearError();
        this.clearValue();
    }

    setValue(value) {
        this.inputElement.value = value;
        this.onFocus();
        this.onBlur();
    }
    clearValue() { 
        this.inputElement.value = '';
        this.onBlur();
    }
}


export class SfButton extends SfElement {

    static template = Template.createTemplate(`<button slot="button" class="form-button"></button>`);

    constructor(name, label, options) {
        super(name, options);
        const button = Template.createElement( 
            SfButton.template, 
            { 
                'button': { 
                    innerHTML: label, 
                    type: options.type ? options.type : 'button', 
                    events: Object.assign({ 'focus': this.onFocus.bind(this), 'blur': this.onBlur.bind(this) }, options.events)
                } 
            } 
        );
        this.setContent(button);
       
        this.buttonElement = this.element.querySelector('[slot=button]');
    }

}


export class SfDropdown extends SfElement {

    static templates = {
        dropdownInput: Template.createTemplate(`
            <div slot="label-wrapper" class="form-element-label focused"><p slot="label"></p></div>
            <select slot="select" name="" id=""></select>
            <div slot="error" class="form-input-error invisible"><svg viewBox="0 0 512 512"><path d="M256,0C114.5,0,0,114.5,0,256c0,141.5,114.5,256,256,256c141.5,0,256-114.5,256-256C512,114.5,397.5,0,256,0z M256,476.3c-121.5,0-220.3-98.8-220.3-220.3S134.5,35.7,256,35.7S476.3,134.5,476.3,256S377.5,476.3,256,476.3z"/><path d="M371.7,371.7L371.7,371.7c8.9-8.9,8.9-23.2,0-32.1L172.4,140.3c-8.9-8.9-23.2-8.9-32.1,0l0,0c-8.9,8.9-8.9,23.2,0,32.1l199.2,199.2C348.4,380.5,362.8,380.5,371.7,371.7z"/><path d="M140.3,371.7L140.3,371.7c8.9,8.9,23.2,8.9,32.1,0l199.2-199.2c8.9-8.9,8.9-23.2,0-32.1l0,0c-8.9-8.9-23.2-8.9-32.1,0L140.3,339.6C131.5,348.4,131.5,362.8,140.3,371.7z"/></svg><p slot="error-msg"></p></div>
        `),
        selectOption: Template.createTemplate(`
            <option slot="option" value=""></option>
        `)
    };

    constructor(name, label, selectOption, options = {}) {
        super(name, options);

        this.options = options;
        const input = Template.createElement( 
            SfDropdown.templates.dropdownInput, 
            { 
                'label': { innerHTML: label},
                'select': { 
                    name: name,
                    events: { 'focus': this.onFocus.bind(this), 'blur': this.onBlur.bind(this) }
                }
            } 
        );
        this.setContent(input);
        
        this.selectElement = this.element.querySelector('[slot=select]');
        selectOption.forEach(option => {
            console.log(option)
            const selectOption = Template.createElement( 
                SfDropdown.templates.selectOption, 
                { 'option': { value: option.value, innerHTML: option.text } } 
            );

            this.selectElement.append(selectOption);
        });
        if(options.disabled) {
            this.selectElement.setAttribute('disabled', '');
            this.selectElement.classList.add('disabled');
        }
        if(options.focus) {
            this.selectElement.focus();
            this.onFocus();
        }
        this.labelWrapperElement = this.element.querySelector('[slot=label-wrapper]');
        this.labelElement = this.element.querySelector('[slot=label]');
        this.errorElement = this.element.querySelector('[slot=error]');
        this.errorMsgElement = this.element.querySelector('[slot=error-msg]');
    }


    setError(msg) {
        super.setError();
        this.errorElement.classList.remove('invisible');
        this.errorMsgElement.innerHTML = msg;
    }

    clearError() {
        super.clearError();
        this.errorElement.classList.add('invisible');
    }

    reset() {
        this.clearError();
        this.clearValue();
        if(this.options.focus)
            this.selectElement.focus();
    }

    setValue(value) {
        this.selectElement.value = value;
        this.onFocus();
        this.onBlur();
    }
    clearValue() { 
        this.selectElement.value = '';
        this.onBlur();
    }
}


export class SfTextArea extends SfElement {

    static template = Template.createTemplate(`
            <div slot="label-wrapper" class="form-element-label"><p slot="label"></p></div>
            <textarea slot="textarea"></textarea>
            <div slot="error" class="form-input-error invisible"><svg viewBox="0 0 512 512"><path d="M256,0C114.5,0,0,114.5,0,256c0,141.5,114.5,256,256,256c141.5,0,256-114.5,256-256C512,114.5,397.5,0,256,0z M256,476.3c-121.5,0-220.3-98.8-220.3-220.3S134.5,35.7,256,35.7S476.3,134.5,476.3,256S377.5,476.3,256,476.3z"/><path d="M371.7,371.7L371.7,371.7c8.9-8.9,8.9-23.2,0-32.1L172.4,140.3c-8.9-8.9-23.2-8.9-32.1,0l0,0c-8.9,8.9-8.9,23.2,0,32.1l199.2,199.2C348.4,380.5,362.8,380.5,371.7,371.7z"/><path d="M140.3,371.7L140.3,371.7c8.9,8.9,23.2,8.9,32.1,0l199.2-199.2c8.9-8.9,8.9-23.2,0-32.1l0,0c-8.9-8.9-23.2-8.9-32.1,0L140.3,339.6C131.5,348.4,131.5,362.8,140.3,371.7z"/></svg><p slot="error-msg"></p></div>
    `);


    constructor(name, label, options = {}) {
        super(name, options);
        this.options = options;
        const input = Template.createElement( 
            SfTextArea.template,
            { 
                'label': { innerHTML: label},
                'textarea': { 
                    name: name,
                    events: { 'focus': this.onFocus.bind(this), 'blur': this.onBlur.bind(this) },
                    style: {height: options.height}
                }
            } 
        );
        this.setContent(input);

        this.textarea = this.element.querySelector('[slot=textarea]');
        if(options.disabled) {
            this.textarea.setAttribute('disabled', '');
            this.textarea.classList.add('disabled');
        }
        this.labelWrapperElement = this.element.querySelector('[slot=label-wrapper]');
        this.labelElement = this.element.querySelector('[slot=label]');
        this.errorElement = this.element.querySelector('[slot=error]');
        this.errorMsgElement = this.element.querySelector('[slot=error-msg]');
    }

    onFocus() {
        super.onFocus();
        this.labelWrapperElement.classList.add('focused');
    }

    onBlur() {
        super.onBlur();
        if(this.textarea.value.length === 0)
            this.labelWrapperElement.classList.remove('focused');
    }

    setError(msg) {
        super.setError();
        this.errorElement.classList.remove('invisible');
        this.errorMsgElement.innerHTML = msg;
    }

    clearError() {
        super.clearError();
        this.errorElement.classList.add('invisible');
    }

    reset() {
        this.clearError();
        this.clearValue();
    }

    setValue(value) {
        this.textarea.value = value;
        this.onFocus();
        this.onBlur();
    }
    clearValue() {
        this.textarea.value = '';
        this.onBlur();
    }
}


export class SfInfoMessage extends SfElement {

    static MessageType = {
        Info: 'info',
        Warning: 'warning',
        Error: 'error'  
    };

    static template = Template.createTemplate(`
        <div class="form-element-info-msg" slot="wrapper">
            <svg slot="icon" viewBox="0 0 512 512"></svg>
            <p class="line-ellipsis-overflow" slot="msg"></p>
        </div>
    `);

    constructor(name, msg, options = {}) {
        super(name, options);
        this.setContent(Template.createElement(SfInfoMessage.template));

        this.wrapperElement = this.element.querySelector('[slot=wrapper]');
        this.iconElement = this.element.querySelector('[slot=icon]');
        this.msgElement = this.element.querySelector('[slot=msg]');

    }

    setMessage(msg, type = SfInfoMessage.MessageType.Error) {
        this.wrapperElement.className = "form-element-info-msg";
        if(msg) {
            switch(type) {
                case SfInfoMessage.MessageType.Info: { 
                    this.wrapperElement.classList.add('info'); 
                    this.iconElement.outerHTML = SfIcons.info;
                } break;
                case SfInfoMessage.MessageType.Warning: { 
                    this.wrapperElement.classList.add('warning'); 
                    this.iconElement.outerHTML = SfIcons.warning;
                } break;
                case SfInfoMessage.MessageType.Error: { 
                    this.wrapperElement.classList.add('error'); 
                    this.iconElement.outerHTML = SfIcons.error;
                } break;
                default: {
                    return;
                } break;
            }
            this.msgElement.innerHTML = msg;
        }
    }

    clearMessage() {
        this.setMessage();
    }

    reset() {
        this.clearMessage();
    }
}

export class SfMemberList extends SfElement {

    static templates = {
        list: Template.createTemplate(`
            <input slot="data" name="members" class="hidden">
            <p slot="heading" class="form-element-member-heading"></p>
            <div slot="memberCards" class="form-element-member-list"></div>
        `),
        projectMember: Template.createTemplate(`
            <div class="form-element-member-card">
                <div class="form-element-member-card-row">
                    <div slot="pfp" class="pfp"></div>
                    <select slot="name"></select>
                </div>
                <div class="form-element-member-card-row">
                    <div class="select-wrapper">
                        <div>Access</div>
                        <select slot="access">
                            <option value="standard">Standard</option>
                            <option value="projectLead">Project Lead</option>
                            <option value="viewOnly">View Only</option>
                        </select>
                    </div>
                    <svg slot="button"></svg>
                </div>
            </div>
        `),
        taskMember: Template.createTemplate(`
            <div class="form-element-member-card">
                <div class="select-wrapper">
                    <div slot="pfp"></div>
                    <select slot="name"></select>
                </div>
                <svg slot="button"></svg>
            </div>
        `),
    };

    constructor(heading, cardTemplate, ) {
        super('members');
        this.cardTemplate = cardTemplate;

        const list = Template.createElement(
            SfMemberList.templates.list,
            {
                heading: { innerHTML: heading }
            }
        );
        this.setContent(list);

        this.cardList = this.element.querySelector('[slot=memberCards]');
    }

    addMemberCards(memberData) {

    }

    addProjectMemberCard(memberData, departmentMembers) {
        let depMemberOptions = '';
        departmentMembers.forEach(depMember => {
            depMemberOptions += `<option value="${depMember.id}">${depMember.firstName} ${depMember.lastName}</option>`;
        });

        
    }

    reset() {
        this.clearError();
        this.clearValue();
    }

    setValue(value) {
        //this.textarea.value = value;
        this.onFocus();
        this.onBlur();
    }
    clearValue() { 
        //this.textarea.value = '';
        this.onBlur();
    }
}

class SFMemberCard {

    static types = {
        project:    0,
        task:       1
    }
    
    static templates = {
        projectMember: Template.createTemplate(`
            <div class="form-element-member-card">
                <div class="form-element-member-card-row">
                    <div slot="pfp" class="pfp"></div>
                    <select slot="name"></select>
                </div>
                <div class="form-element-member-card-row">
                    <div class="select-wrapper">
                        <div>Access</div>
                        <select slot="access">
                            <option value="standard">Standard</option>
                            <option value="projectLead">Project Lead</option>
                            <option value="viewOnly">View Only</option>
                        </select>
                    </div>
                    <svg slot="button"></svg>
                </div>
            </div>
        `),
        taskMember: Template.createTemplate(`
            <div class="form-element-member-card">
                <div class="select-wrapper">
                    <div slot="pfp"></div>
                    <select slot="name"></select>
                </div>
                <svg slot="button"></svg>
            </div>
        `),
    };
    element;
 
    constructor(cardType, cardData) {
        switch(cardType) {
            case SFMemberCard.types.project: { this.createProjectCard(cardData); } break;
            case SFMemberCard.types.task: { this.createTaskCard(cardData); } break;
        }
    }

    createProjectCard(cardData) {
        let card;
        if(cardData) {
            card = Template.createElement(
                SfMemberList.templates.projectMember,
                {
                    pfp: { style: { background: `url(/images/pfp/${memberData.id}.png)` } },
                    name: { innerHTML: depMemberOptions, addClasses: ['disabled'] },
                    button: { outerHTML: Button.icons.cancel }
                }
            );
        } else {
            card = Template.createElement(
                SfMemberList.templates.projectMember,
                {
                    name: { innerHTML: depMemberOptions, events: { change: this.onNameChange } },
                    button: { outerHTML: Button.icons.confirm, addClasses: ['disabled'], events: { change: this.onButtonClick }  }
                }
            );
        }
    }

    createTaskCard(cardData) {
        
    }

    onNameChange(evt) {
        const name = evt.target;
        if(name.value !== '')
            name.closest('svg').classList.remove('disabled');
        else
            name.closest('svg').classList.add('disabled');
    }

    onButtonClick(evt) {

    }

}


export class SfElementPaddedContent {
    element;
    static template = Template.createTemplate(`<p class="form-element-padded-label" slot="label"></p>`);

    constructor(content, options = {}) {
        this.element = Template.createElement( 
            SfElementPaddedContent.template, 
            { 
                'label': { 
                    innerHTML: content,
                    style: {
                        width: options.width ? options.width : '',
                        backgroundColor: options.hasBackground ? '' : 'transparent !important',
                    }
                },
            } 
        );
    }
}

const SfIcons = {
    info:       `<svg viewBox="0 0 512 512"><path d="M256,0C114.5,0,0,114.5,0,256s114.5,256,256,256s256-114.5,256-256S397.5,0,256,0z M256,476.3c-121.5,0-220.3-98.8-220.3-220.3S134.5,35.7,256,35.7S476.3,134.5,476.3,256S377.5,476.3,256,476.3z"/><path d="M255.2,213.4L255.2,213.4c-14.8,0-26.8,12-26.8,26.8V347c0,14.8,12,26.8,26.8,26.8l0,0c14.8,0,26.8-12,26.8-26.8V240.2C282,225.4,270,213.4,255.2,213.4z"/><path d="M255.8,188.9L255.8,188.9c-15.2,0-27.5-12.3-27.5-27.5l0,0c0-15.2,12.3-27.5,27.5-27.5l0,0c15.2,0,27.5,12.3,27.5,27.5l0,0C283.3,176.6,271,188.9,255.8,188.9z"/></svg>`,
    warning:    `<svg viewBox="0 0 486.5 486.5"><path d="M243.2,333.4c-13.6,0-25,11.4-25,25s11.4,25,25,25c13.1,0,25-11.4,24.4-24.4C268.2,344.7,256.9,333.4,243.2,333.4z"/><path d="M474.6,422c15.7-27.1,15.8-59.4,0.2-86.4L318.2,64.4c-15.5-27.3-43.5-43.5-74.9-43.5s-59.4,16.3-74.9,43.4L11.6,335.8c-15.6,27.3-15.5,59.8,0.3,86.9c15.6,26.8,43.5,42.9,74.7,42.9h312.8C430.7,465.6,458.8,449.3,474.6,422z M440.6,402.4c-8.7,15-24.1,23.9-41.3,23.9H86.5c-17,0-32.3-8.7-40.8-23.4c-8.6-14.9-8.7-32.7-0.1-47.7L202.4,83.8c8.5-14.9,23.7-23.7,40.9-23.7c17.1,0,32.4,8.9,40.9,23.8l156.7,271.4C449.3,369.9,449.2,387.5,440.6,402.4z"/><path d="M237,157.9c-11.9,3.4-19.3,14.2-19.3,27.3c0.6,7.9,1.1,15.9,1.7,23.8c1.7,30.1,3.4,59.6,5.1,89.7c0.6,10.2,8.5,17.6,18.7,17.6s18.2-7.9,18.7-18.2c0-6.2,0-11.9,0.6-18.2c1.1-19.3,2.3-38.6,3.4-57.9c0.6-12.5,1.7-25,2.3-37.5c0-4.5-0.6-8.5-2.3-12.5C260.8,160.8,248.9,155.1,237,157.9z"/></svg>`,
    error:      `<svg viewBox="0 0 512 512"><path d="M256,0C114.5,0,0,114.5,0,256c0,141.5,114.5,256,256,256c141.5,0,256-114.5,256-256C512,114.5,397.5,0,256,0z M256,476.3c-121.5,0-220.3-98.8-220.3-220.3S134.5,35.7,256,35.7S476.3,134.5,476.3,256S377.5,476.3,256,476.3z"/><path d="M371.7,371.7L371.7,371.7c8.9-8.9,8.9-23.2,0-32.1L172.4,140.3c-8.9-8.9-23.2-8.9-32.1,0l0,0c-8.9,8.9-8.9,23.2,0,32.1l199.2,199.2C348.4,380.5,362.8,380.5,371.7,371.7z"/><path d="M140.3,371.7L140.3,371.7c8.9,8.9,23.2,8.9,32.1,0l199.2-199.2c8.9-8.9,8.9-23.2,0-32.1l0,0c-8.9-8.9-23.2-8.9-32.1,0L140.3,339.6C131.5,348.4,131.5,362.8,140.3,371.7z"/></svg>`,
}


export const SfElements = {
    TextInput:  SfTextInput,
    Dropdown:   SfDropdown,
    Button:     SfButton,
    InfoMsg:    SfInfoMessage,
    TextArea:   SfTextArea,
    MemberList: SfMemberList
};
