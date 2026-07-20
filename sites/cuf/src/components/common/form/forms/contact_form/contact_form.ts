import { DwgForm } from '@core/components/form/form';
import { DwgFormSectionName } from '@core/components/form/form_section/form_section_name/form_section_name';
import {
  AddressOutputData,
  DwgFormSectionAddress,
} from '@core/components/form/form_section/form_section_address/form_section_address';
import {
  ContactData,
  DwgFormSectionContact,
} from '@core/components/form/form_section/form_section_contact/form_section_contact';
import { CufFormSectionMembership } from '../../form_section/form_section_membership/form_section_membership';
import { DwgTextArea } from '@core/components/form/form_field/text_area/text_area';
import { recaptchaCallback } from '@core/scripts/recaptcha';
import { apiPost } from '@core/scripts/api';
import { createContactEmail } from '../util';
import { scrollToElement } from '@core/scripts/util';
import { internalHref } from '@core/scripts/url';

import html from './contact_form.html';

import './contact_form.scss';
import '@core/components/form/form_section/form_section_name/form_section_name';
import '@core/components/form/form_section/form_section_address/form_section_address';
import '@core/components/form/form_section/form_section_contact/form_section_contact';
import '../../form_section/form_section_membership/form_section_membership';
import '@core/components/form/form_field/text_area/text_area';

/** Data describing the contact form */
export declare interface ContactFormData {
  name: string;
  address: AddressOutputData;
  contact: ContactData;
  membership: string;
  message: string;
}

export class CufContactForm extends DwgForm<ContactFormData> {
  private section_name: DwgFormSectionName;
  private section_address: DwgFormSectionAddress;
  private section_contact: DwgFormSectionContact;
  private section_membership: CufFormSectionMembership;
  private message: DwgTextArea;
  private form_wrapper: HTMLDivElement;
  private contact_form_button: HTMLButtonElement;
  private contact_form_status_message: HTMLDivElement;
  private contact_form_receipt_message: HTMLDivElement;
  private lay_witness_link: HTMLAnchorElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'section_name',
      'section_address',
      'section_contact',
      'message',
      'section_membership',
    ]);
    this.configureElement('form_wrapper');
    this.configureElement('contact_form_button');
    this.configureElement('contact_form_status_message');
    this.configureElement('contact_form_receipt_message');
    this.configureElement('lay_witness_link');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.lay_witness_link.href = internalHref('lay_witness');
    if (DEV) {
      this.setTestData();
    }
    this.contact_form_button.addEventListener('click', () => {
      if (!this.validate()) {
        return;
      }
      recaptchaCallback(
        async () => {
          const post_data = createContactEmail(this.getData(), true);
          const res = await apiPost(STAGING ? 'con_tac' : 'contact', post_data);
          if (res.success) {
            this.successStatus(this.contact_form_status_message, 'Message sent!');
            this.successStatus(
              this.contact_form_receipt_message,
              'Thank you for contacting us. We will be in touch with you soon.'
            );
            this.form_wrapper.remove();
            scrollToElement(this.contact_form_status_message);
          } else {
            this.errorStatus(
              this.contact_form_status_message,
              res.error_message ?? 'An unknown error occurred trying to send the contact form'
            );
          }
        },
        this.contact_form_button,
        this.contact_form_status_message,
        'Sending'
      );
    });
  }

  protected override postValidate(valid: boolean): void {
    if (valid) {
      this.messageStatus(this.contact_form_status_message, '');
    } else {
      this.errorStatus(this.contact_form_status_message, 'Please fix the validation errors');
    }
  }

  override getData(): ContactFormData {
    return {
      name: this.section_name.getOutputData(),
      address: this.section_address.getOutputData(),
      contact: this.section_contact.getOutputData(),
      membership: this.section_membership.getOutputData(),
      message: this.message.getData(),
    };
  }

  protected override _setData(data: ContactFormData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-contact-form', CufContactForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-contact-form': CufContactForm;
  }
}
