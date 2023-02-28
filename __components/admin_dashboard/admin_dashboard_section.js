// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {until} = await import(`/scripts/util.js?v=${version}`);
const {verifyRecaptcha, public_recaptcha_site_key} = await import(`/scripts/recaptcha.js?v=${version}`);
const {CufFormSection} = await import(`../model/form_sections/form_section/form_section.js?v=${version}`);

export class CufAdminDashboardSection extends HTMLElement {
  /** @type {HTMLHeadingElement} */
  section_title;

  /** @type {HTMLDivElement} */
  section_body;

  /** @type {HTMLButtonElement} */
  edit_button;

  /** @type {HTMLDivElement} */
  current_list;

  /** @type {?HTMLInputElement} */
  file_input;

  /** @type {?HTMLButtonElement} */
  add_button;

  /** @type {HTMLFormElement} */
  new_form;

  /** @type {CufFormSection} */
  new_form_section;

  /** @type {HTMLButtonElement} */
  submit_button;

  /** @type {HTMLDivElement} */
  status_message;

  constructor() {
    super();
  }

  /**
   * Waits for parsing to be complete and sets parameters.
   * Should be called first in connectedCallback.
   * @param {string} path 
   * @param {string} name 
   */
  async setHTML(path, name) {
    const res = await fetch(`/__components/admin_dashboard/${path}/${path}.html?v=${version}`);
    this.innerHTML = await res.text();
    const overall_stylesheet = document.createElement('link');
    overall_stylesheet.setAttribute('rel', 'stylesheet');
    overall_stylesheet.setAttribute('href', `/__components/admin_dashboard/admin_dashboard_section.css?v=${version}`);
    this.appendChild(overall_stylesheet);
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/admin_dashboard/${path}/${path}.css?v=${version}`);
    this.appendChild(stylesheet);

    await until(() => !!this.querySelector('.section-title'));
    this.section_title = this.querySelector('.section-title');
    await until(() => !!this.querySelector('.section-body'));
    this.section_body = this.querySelector('.section-body');
    await until(() => !!this.section_body.querySelector('.edit-button'));
    this.edit_button = this.section_body.querySelector('.edit-button');
    await until(() => !!this.section_body.querySelector('.current-list'));
    this.current_list = this.section_body.querySelector('.current-list');
    await until(() => !!this.section_body.querySelector('.file-upload') ||
      !!this.section_body.querySelector('.add-button'));
    this.file_input = this.section_body.querySelector('.file-upload');
    this.add_button = this.section_body.querySelector('.add-button');
    await until(() => !!this.section_body.querySelector('.new-form'));
    this.new_form = this.section_body.querySelector('.new-form');
    await until(() => !!this.new_form.querySelector('.form-section'));
    this.new_form_section = this.new_form.querySelector('.form-section');
    await until(() => !!this.new_form.querySelector('.form-submit-button'));
    this.submit_button = this.new_form.querySelector('.form-submit-button');
    await until(() => !!this.section_body.querySelector('.status-message'));
    this.status_message = this.section_body.querySelector('.status-message');

    this.section_title.addEventListener('click', () => {
      if (this.section_body.hasAttribute('style')) {
        this.section_body.removeAttribute('style');
      }
      else {
        this.section_body.setAttribute('style', 'display: none;');
      }
    });

    if (this.file_input) {
      this.file_input.addEventListener('change', () => {
        const file = this.file_input.files[0];
        if (!file) {
          this.new_form.setAttribute('style', 'display: none; visibility: visible;');
          return;
        }
        if (file.type !== 'application/pdf') {
          this.file_input.value = '';
          this.new_form.setAttribute('style', 'display: none;');
          this.status_message.setAttribute('style', 'display: block; color: red');
          this.status_message.innerText = 'Invalid filetype; please upload a pdf.';
          return;
        }
        this.new_form.removeAttribute('style');
        this.status_message.setAttribute('style', 'display: none;');
        this.new_form_section.focusFirst();
      });
    }
    else if (this.add_button) {
      this.add_button.addEventListener('click', () => {
        if (this.new_form.hasAttribute('style')) {
          this.new_form.removeAttribute('style');
          this.add_button.innerText = 'Cancel';
          return;
        }
        this.new_form.setAttribute('style', 'display: none;');
        this.add_button.innerText = `New ${name}`;
      });
    }

    this.submit_button.addEventListener('click', async () => {
      if (!this.validateForm(this.new_form_section)) {
        return;
      }
      await this.submitForm(this.submit_button, this.status_message, this.newFormSubmit.bind(this));
    });

    await this.updateCurrentList();
    this.edit_button.addEventListener('click', () => {
      if (this.current_list.getAttribute('style').includes('display: block')) {
        this.current_list.setAttribute('style', 'display: none; visibility: visible;');
        this.edit_button.innerText = `Edit ${name}`;
        return;
      }
      this.edit_button.innerText = 'Cancel';
      this.current_list.setAttribute('style', 'display: block; visibility: visible;');
    });
  }

  /**
   * Validates and returns whether the input section is valid
   * @param {CufFormSection} form_section
   * @return {boolean}
   */
  validateForm(form_section) {
    return form_section.validate();
  }

  /**
   * @callback submitCallback
   * @return {Promise<void>}
   */
  /**
   * Submits form if recaptcha check passes
   * @param {HTMLButtonElement} button
   * @param {HTMLDivElement} status_message
   * @param {submitCallback} callback
   * @param {string} button_text
   */
  async submitForm(button, status_message, callback, button_text = 'Uploading') {
    button.disabled = true;
    button.innerText = button_text;
    button.setAttribute('style', 'box-shadow: none;');
    grecaptcha.ready(async function() {
      const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
      if (await verifyRecaptcha(token)) {
        await callback();
      }
      else {
        status_message.setAttribute('style', 'display: block; color: red');
        status_message.innerText = 'reCaptcha validation has failed. ' +
          'If you are human, please report this false positive.';
      }
    });
  }

  /**
   * Submit the form to add a new piece
   */
  async newFormSubmit() {
    throw new Error(`Must implement newFormSubmit for ${this.constructor.name}.`);
  }

  /**
   * Updates the current_list div. Must be implemented
   */
  async updateCurrentList() {
    throw new Error(`Must implement updateCurrentList for ${this.constructor.name}.`);
  }
}