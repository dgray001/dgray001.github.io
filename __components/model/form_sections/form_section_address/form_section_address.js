import {CufFormSection} from '../form_section/form_section.js';
import {CufSelect} from '../../select/select.js';
import {CufInputText} from '../../input_text/input_text.js';

class CufFormSectionAddress extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_address/form_section_address.html');
    const form_section = await this.setFormSectionAttributes(res, 'Address');
  }
}

customElements.define("cuf-form-section-address", CufFormSectionAddress);
