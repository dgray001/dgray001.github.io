import {CufForm} from '../../form';
import {CufFormSectionName} from '../../form_section/form_section_name/form_section_name';
import {AddressOutputData, CufFormSectionAddress} from '../../form_section/form_section_address/form_section_address';
import {ContactData, CufFormSectionContact} from '../../form_section/form_section_contact/form_section_contact';
import {CufFormSectionMembership} from '../../form_section/form_section_membership/form_section_membership';
import {CufTextArea} from '../../form_field/text_area/text_area';
import {recaptchaCallback} from '../../../../../scripts/recaptcha';
import {CufInputText} from '../../form_field/input_text/input_text';
import {DEV} from '../../../../../scripts/util';

import html from './donate_form.html';

import './donate_form.scss';
import '../../form_section/form_section_name/form_section_name';
import '../../form_section/form_section_address/form_section_address';
import '../../form_section/form_section_contact/form_section_contact';
import '../../form_section/form_section_membership/form_section_membership';
import '../../form_field/text_area/text_area';
import '../../form_field/input_text/input_text';

/** Data describing the contact form */
export declare interface DonateFormData {
  name: string;
  address: AddressOutputData;
  contact: ContactData;
  membership: string;
  message: string;
  amount: number;
}

export class CufDonateForm extends CufForm<DonateFormData> {
  private section_name: CufFormSectionName;
  private section_address: CufFormSectionAddress;
  private section_contact: CufFormSectionContact;
  private section_membership: CufFormSectionMembership;
  private message: CufTextArea;
  private donate_amount: CufInputText;
  private donate_form_button: HTMLButtonElement;
  private donate_form_status_message: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'section_name',
      'section_address',
      'section_contact',
      'message',
      'section_membership',
      'donate_amount',
    ]);
    this.configureElement('donate_form_button');
    this.configureElement('donate_form_status_message');
  }

  protected override async _parsedCallback(): Promise<void> {
    if (DEV) {
      this.setTestData();
    }
    this.donate_form_button.addEventListener('click', () => {
      if (!this.validate()) {
        return;
      }
      recaptchaCallback(async () => {
        console.log(this.getData());
        // TODO: implement
      }, this.donate_form_button, this.donate_form_status_message, 'Sending');
    });
  }

  protected override postValidate(valid: boolean): void {
    if (valid) {
      this.donate_form_status_message.classList.remove('error');
      this.donate_form_status_message.innerText = '';
    } else {
      this.donate_form_status_message.classList.add('error');
      this.donate_form_status_message.innerText = 'Please fix the validation errors';
    }
  }

  getData(): DonateFormData {
    return {
      name: this.section_name.getOutputData(),
      address: this.section_address.getOutputData(),
      contact: this.section_contact.getOutputData(),
      membership: this.section_membership.getOutputData(),
      message: this.message.getData(),
      amount: parseInt(this.donate_amount.getData().replace('$', '')),
    };
  }

  setData(data: DonateFormData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-donate-form', CufDonateForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-donate-form': CufDonateForm;
  }
}
