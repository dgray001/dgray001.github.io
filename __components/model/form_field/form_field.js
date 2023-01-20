export class CufFormField extends HTMLElement {
  /**
   * reference to actual form field element
   * @type {HTMLElement}
   */
  form_field;
  /** @type {string} */
  id = '';
  /** @type {string} */
  label = ''

  constructor() {
    super();
  }

  async connectedCallback() {
    this.id = this.attributes.id?.value || '';
    const flex_option = this.attributes.flex_option?.value || '';
    this.label = this.innerText;
    this.innerText = '';
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/model/form_field/form_field.html');
    shadow.innerHTML = await res.text();
    const wrapper = shadow.querySelector('.form-field-wrapper');
    wrapper.setAttribute('id', this.id + '-wrapper');
    this.classList.add('form-field');
    if (flex_option) {
      this.setAttribute('style', `flex: ${flex_option} 0 0`)
    }
  }

  /**
   * Given response to child html, wrap it in wrapper and set attributes
   * @return {Promise<HTMLElement>}
   */
  async setFormFieldAttributes(res) {
    const wrapper = this.shadowRoot.querySelector('span');
    wrapper.innerHTML = await res.text();
    this.form_field = this.shadowRoot.querySelector('.form-field');
    this.form_field.setAttribute('id', this.id);
    this.form_field.setAttribute('name', this.id);
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
}

customElements.define("cuf-form-field", CufFormField);
