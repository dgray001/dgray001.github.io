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

  /**
   * Returns map of name data for the name form section
   * @return {{address1:string, address2:string, city:string, state:string, zip:string, country:string}}
   */
  getFormData() {
    const address1 = this.shadowRoot.getElementById('address-first').getFormData();
    const address2 = this.shadowRoot.getElementById('address-second').getFormData();
    const city = this.shadowRoot.getElementById('address-city').getFormData();
    const state = this.shadowRoot.getElementById('address-state').getFormData();
    const zip = this.shadowRoot.getElementById('address-zip').getFormData();
    const country = this.shadowRoot.getElementById('address-country').getFormData();
    return {'address1': address1, 'address2': address2, 'city': city, 'state': state, 'zip': zip, 'country': country};
  }
}

customElements.define("cuf-form-section-address", CufFormSectionAddress);