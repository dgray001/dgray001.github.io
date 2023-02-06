import {Validator, validate} from '../../../scripts/validation.js';

export class CufFormField extends HTMLElement {
  /**
   * reference to actual form field element
   * @type {HTMLElement}
   */
  form_field;
  /**
   * reference to wrapper element
   * @type {HTMLElement}
   */
  form_field_wrapper;
  /**
   * reference to label element
   * @type {HTMLElement}
   */
  form_field_label;
  /**
   * reference to helper text element
   * @type {HTMLElement}
   */
  form_field_helper_text;
  /** @type {string} */
  id = '';
  /** @type {string} */
  label = '';
  /** @type {string} */
  default_helper_text = '';
  /** @type {Set<Validator>} */
  validators;
  /** @type {boolean} */
  valid;
  /** @type {string} */
  validation_error_text = '';

  constructor() {
    super();
  }

  async connectedCallback() {
    // Need to have the setTimeout to ensure innerText is set loaded
    return new Promise((resolve) => {
      setTimeout(async () => {
        this.id = this.attributes.id?.value || '';
        this.default_helper_text = this.attributes["helper-text"]?.value || '';
        const flex_option = this.attributes.flex_option?.value || '';
        const validators_array = JSON.parse(this.attributes.validators?.value || '[]');
        this.validators = new Set(validators_array);
        this.label = this.innerText.replace('\n', '');
        this.innerText = '';
        const shadow = this.attachShadow({mode: 'open'});
        const res = await fetch('./__components/model/form_field/form_field.html');
        shadow.innerHTML = await res.text();
        this.form_field_wrapper = shadow.querySelector('.form-field-wrapper');
        this.form_field_wrapper.setAttribute('id', this.id + '-wrapper');
        this.classList.add('form-field');
        if (flex_option) {
          this.setAttribute('style', `flex: ${flex_option} 0 0`)
        }
        this.form_field_label = shadow.querySelector('.form-field-label');
        this.form_field_label.setAttribute('for', this.id);
        this.form_field_label.innerText = this.label;
        if (this.validators.has('required')) {
          this.form_field_label.innerText += ' *';
        }
        resolve();
      });
    });
  }

  /**
   * Given response to child html, wrap it in wrapper and set attributes
   * @return {Promise<HTMLElement>}
   */
  async setFormFieldAttributes(res, insert_before_label = false) {
    const new_html = await res.text();
    if (insert_before_label) {
      this.form_field_wrapper.innerHTML = new_html + this.form_field_wrapper.innerHTML;
    }
    else {
      this.form_field_wrapper.innerHTML += new_html;
    }
    this.form_field_helper_text = document.createElement('span');
    this.updateHelperText();
    this.form_field_helper_text.classList.add('helper-text');
    this.form_field_wrapper.appendChild(this.form_field_helper_text);
    this.form_field = this.shadowRoot.querySelector('.form-field');
    this.form_field.setAttribute('id', this.id);
    this.form_field.setAttribute('name', this.id);
    this.form_field.addEventListener('focus', () => {
      this.form_field_wrapper.classList.add('focused');
    });
    this.form_field.addEventListener('blur', () => {
      this.form_field_wrapper.classList.remove('focused');
      this.validate();
    });
    return this.form_field;
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    console.log(`CufFormField::getFormData not implemented for ${this.constructor.name}.`);
    return 'error';
  }

  /**
   * Validates the form field based on input validators.
   * This function sets valid, validation_error_text, and updates helper text.
   * @return {boolean} whether form field is valid.
   */
  validate() {
    this.valid = true;
    for (const validator of this.validators) {
      this.validation_error_text = validate(validator, this.getFormData(), this);
      if (this.validation_error_text) {
        this.valid = false;
        break;
      }
    }
    this.updateHelperText();
    return this.valid;
  }

  /**
   * Sets helper text if there is any.
   * Error text always overrides default helper text.
   */
  updateHelperText() {
    if (this.validation_error_text) {
      this.form_field_wrapper.setAttribute('style',
        '--box-shadow-color: rgb(255, 0, 0);' +
        '--box-shadow-width: 2px;');
      this.form_field_helper_text.setAttribute('style',
        'background-color: rgb(255, 200, 180);' +
        'border-color: rgb(255, 0, 0);' +
        'color: darkred; display: block;');
      this.form_field_helper_text.innerText = this.validation_error_text;
    }
    else if (this.default_helper_text) {
      this.form_field_wrapper.setAttribute('style', '');
      this.form_field_helper_text.setAttribute('style',
        'background-color: rgb(231, 224, 217);' +
        'border-color: rgb(0, 0, 0);' +
        'color: black; display: block;');
      this.form_field_helper_text.innerText = this.default_helper_text;
    }
    else {
      this.form_field_wrapper.setAttribute('style', '');
      this.form_field_helper_text.setAttribute('style', 'display: none;');
    }
  }
}

customElements.define("cuf-form-field", CufFormField);
