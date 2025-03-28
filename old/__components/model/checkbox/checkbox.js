// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormField} = await import(`../form_field/form_field.js?v=${version}`);

export class CufCheckbox extends CufFormField {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
  }

  // This should be called when children (and inner text) available
  async childrenAvailableCallback() {
    await super.childrenAvailableCallback();
    this.form_field_label.classList.remove('styled');
    this.form_field_wrapper.classList.remove('styled');
    const res = await fetch(`/__components/model/checkbox/checkbox.html?v=${version}`);
    await this.setFormFieldAttributes(res, true);
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/model/checkbox/checkbox.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    return this.form_field.checked.toString();
  }

  /**
   * Returns form data as a string
   * @param {string} data
   */
  setFormData(data) {
    this.form_field.checked = data === true.toString();
  }

  /**
   * Clears form data
   */
  clearFormData() {
    this.form_field.checked = false;
  }
}

customElements.define("cuf-checkbox", CufCheckbox);
