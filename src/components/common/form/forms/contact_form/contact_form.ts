import {CufForm} from '../../form';
import {CufFormSectionName} from '../../form_section/form_section_name/form_section_name';
import {CufFormSectionAddress} from '../../form_section/form_section_address/form_section_address';
import {CufFormSectionContact} from '../../form_section/form_section_contact/form_section_contact';
import {CufFormSectionMembership} from '../../form_section/form_section_membership/form_section_membership';

import html from './contact_form.html';

import './contact_form.scss';
import '../../form_section/form_section_name/form_section_name';
import '../../form_section/form_section_address/form_section_address';
import '../../form_section/form_section_contact/form_section_contact';
import '../../form_section/form_section_membership/form_section_membership';

interface ContactData {
  //
}

export class CufContactForm extends CufForm<ContactData> {
  private section_name: CufFormSectionName;
  private section_address: CufFormSectionAddress;
  private section_contact: CufFormSectionContact;
  private section_membership: CufFormSectionMembership;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('section_name');
    this.configureElement('section_address');
    this.configureElement('section_contact');
    this.configureElement('section_membership');
  }

  getData(): ContactData {
    return {};
  }

  setData(data: ContactData): void {
    //
  }
}

customElements.define('cuf-contact-form', CufContactForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-contact-form': CufContactForm;
  }
}
