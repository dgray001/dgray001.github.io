import {CufFormSection} from '../form_section/form_section.js';
import {CufInputText} from '../../input_text/input_text.js';

class CufFormSectionContact extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_contact/form_section_contact.html');
    await this.setFormSectionAttributes(res, 'Contact');
  }

  /**
   * Returns map of contact data for the contact form section
   * @return {{email:string, phone:string}}
   */
  getFormData() {
    const email = this.shadowRoot.getElementById('contact-email').getFormData();
    const phone = this.shadowRoot.getElementById('contact-phone').getFormData();
    return {'email': email, 'phone': phone};
  }

  /**
   * Returns map of contact data for the contact form section
   * @return {{email:string, phone:string}}
   * @todo maybe add dashes between phone number sections
   */
  getDisplayableData() {
    return this.getFormData();
  }
}

customElements.define("cuf-form-section-contact", CufFormSectionContact);
