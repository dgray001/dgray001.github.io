import {CufFormSection} from '../form_section/form_section.js';
import {CufSelect} from '../../select/select.js';
import {CufInputText} from '../../input_text/input_text.js';

class CufFormSectionName extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_name/form_section_name.html');
    const form_section = await this.setFormSectionAttributes(res, 'Name');
  }

  /**
   * Returns map of name data for the name form section
   * @return {{prefix:string, first:string, last:string, suffix:string}}
   */
  getFormData() {
    const prefix = this.shadowRoot.getElementById('name-prefix').getFormData();
    const first = this.shadowRoot.getElementById('name-first').getFormData();
    const last = this.shadowRoot.getElementById('name-last').getFormData();
    const suffix = this.shadowRoot.getElementById('name-suffix').getFormData();
    return {'prefix': prefix, 'first': first, 'last': last, 'suffix': suffix};
  }

  /**
   * Returns map of form data for the form section
   * @return {string}
   */
  getDisplayableData() {
    const prefix = this.shadowRoot.getElementById('name-prefix').getFormData();
    const first = this.shadowRoot.getElementById('name-first').getFormData();
    const last = this.shadowRoot.getElementById('name-last').getFormData();
    const suffix = this.shadowRoot.getElementById('name-suffix').getFormData();
    let return_string = '';
    if (prefix) {
      return_string += prefix + ' ';
    }
    return_string += first + ' ' + last;
    if (suffix) {
      return_string += ' ' + suffix;
    }
    return return_string;
  }
}

customElements.define("cuf-form-section-name", CufFormSectionName);
