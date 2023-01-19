import {CufFormSection} from '../form_section/form_section.js';
import {CufSelect} from '../../select/select.js';
import {CufInputText} from '../../input_text/input_text.js';

class CufFormSectionContact extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_contact/form_section_contact.html');
    const form_section = await this.setFormSectionAttributes(res, 'Contact');
  }
}

customElements.define("cuf-form-section-contact", CufFormSectionContact);
