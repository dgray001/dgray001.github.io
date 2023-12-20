import {CufFormSection} from '../form_section';
import {CufInputText} from '../../form_field/input_text/input_text';

import html from './form_section_contact.html';

import './form_section_contact.scss';
import '../../form_field/input_text/input_text';

/** Data describing a person's contact information */
export declare interface ContactData {
  email: string;
  phone: string;
}

export class CufFormSectionContact extends CufFormSection<ContactData, ContactData> {
  private contact_email: CufInputText;
  private contact_phone: CufInputText;

  constructor() {
    super();
    this.configureFormSection(html, 'Contact', [
      'contact_email',
      'contact_phone',
    ]);
  }

  getData(): ContactData {
    return {
      email: this.contact_email.getData(),
      phone: this.contact_phone.getData(),
    };
  }

  getOutputData(): ContactData {
    return this.getData();
  }

  setData(data: ContactData): void {
    this.contact_email.setData(data.email);
    this.contact_phone.setData(data.phone);
  }
}

customElements.define('cuf-form-section-contact', CufFormSectionContact);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-contact': CufFormSectionContact;
  }
}
