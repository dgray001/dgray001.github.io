import {CufFormField} from '../form_field/form_field.js';

class CufTextArea extends CufFormField {
  /** @type {number} */
  min_height = 0;

  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/text_area/text_area.html');
    const form_field = await this.setFormFieldAttributes(res);
    form_field.addEventListener('input', (evt) => {this.setTextAreaHeight(evt.target)});
    this.setMinHeight();
  }

  setMinHeight() {
    const min_rows = parseInt(this.attributes['min-rows']?.value || '1');
    const previous_value = this.form_field.value;
    this.form_field.value = '\n'.repeat(min_rows - 1);
    this.min_height = this.form_field.scrollHeight + 2;
    this.form_field.value = previous_value;
    this.setTextAreaHeight();
  }

  setTextAreaHeight() {
    this.form_field.style.height = "";
    const curr_scroll_height = this.form_field.scrollHeight + 2;
    this.form_field.style.height = Math.max(curr_scroll_height, this.min_height) + "px";
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    return this.form_field.value;
  }

  /**
   * Clears form data
   */
  clearFormData() {
    this.form_field.value = '';
  }
}

customElements.define("cuf-text-area", CufTextArea);
