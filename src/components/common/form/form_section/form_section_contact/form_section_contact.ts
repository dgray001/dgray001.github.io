import {CufFormSection} from '../form_section';
import {CufInputText} from '../../form_field/input_text/input_text';

import html from './form_section_contact.html';

import './form_section_contact.scss';
import '../../form_field/input_text/input_text';

interface AddressData {
  //
}

export class CufFormSectionContact extends CufFormSection<AddressData> {
  private contact_email: CufInputText;
  private contact_phone: CufInputText;

  constructor() {
    super();
    this.configureFormSection(html, 'Contact', [
      'contact_email',
      'contact_phone',
    ]);
  }

  getData(): AddressData {
    return {};
  }

  setData(data: AddressData): void {
    //
  }
}

customElements.define('cuf-form-section-contact', CufFormSectionContact);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-contact': CufFormSectionContact;
  }
}
