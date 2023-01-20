import {CufFormField} from '../form_field/form_field.js';

class CufTextArea extends CufFormField {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/text_area/text_area.html');
    const form_field = await this.setFormFieldAttributes(res);
    form_field.setAttribute('placeholder', this.label);
    form_field.addEventListener('input', (evt) => {this.setTextAreaHeight(evt.target)});
    this.setTextAreaHeight(form_field);
  }

  setTextAreaHeight(textarea) {
    textarea.style.height = "";
    textarea.style.height = textarea.scrollHeight + 2 + "px";
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    return this.form_field.value;
  }
}

customElements.define("cuf-text-area", CufTextArea);
