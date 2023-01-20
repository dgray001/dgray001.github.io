import {CufFormField} from '../form_field/form_field.js';

export class CufInputText extends CufFormField {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/input_text/input_text.html');
    const form_field = await this.setFormFieldAttributes(res);
    form_field.setAttribute('placeholder', this.label);
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    return this.form_field.value;
  }
}

customElements.define("cuf-input-text", CufInputText);
