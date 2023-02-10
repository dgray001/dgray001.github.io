import {CufFormField} from '../form_field/form_field.js';

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
    const res = await fetch('./__components/model/checkbox/checkbox.html');
    await this.setFormFieldAttributes(res, true);
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    return this.form_field.checked.toString();
  }

  /**
   * Clears form data
   */
  clearFormData() {
    this.form_field.checked = false;
  }
}

customElements.define("cuf-checkbox", CufCheckbox);
