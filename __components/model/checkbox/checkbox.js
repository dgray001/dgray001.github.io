import {CufFormField} from '../form_field/form_field.js';

export class CufCheckbox extends CufFormField {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/checkbox/checkbox.html');
    const form_field = await this.setFormFieldAttributes(res);
    // The following will be removed when labels are added to all form fields
    const label_element = document.createElement('label');
    label_element.setAttribute('for', form_field.id);
    label_element.textContent = this.label;
    this.shadowRoot.querySelector('.form-field-wrapper').appendChild(label_element);
  }
}

customElements.define("cuf-checkbox", CufCheckbox);
