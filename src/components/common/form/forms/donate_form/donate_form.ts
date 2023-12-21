import {CufForm} from '../../form';
import {CufFormSectionName} from '../../form_section/form_section_name/form_section_name';
import {AddressOutputData, CufFormSectionAddress} from '../../form_section/form_section_address/form_section_address';
import {ContactData, CufFormSectionContact} from '../../form_section/form_section_contact/form_section_contact';
import {CufFormSectionMembership} from '../../form_section/form_section_membership/form_section_membership';
import {CufTextArea} from '../../form_field/text_area/text_area';
import {recaptchaCallback} from '../../../../../scripts/recaptcha';
import {CufInputText} from '../../form_field/input_text/input_text';
import {DEV} from '../../../../../scripts/util';
import {createContactEmail} from '../util';
import {apiGetPost, apiPost} from '../../../../../scripts/api';

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

/** Token response from authorize.net API */
export declare interface TokenReponse {
  token: string;
  messages: {
    resultCode: string;
    message: {
      code: string;
      text: string;
    }[];
  };
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
  private hidden_donate_form: HTMLFormElement;
  private hidden_token_input: HTMLInputElement;

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
    this.configureElement('hidden_donate_form');
    this.configureElement('hidden_token_input');
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
        const email_data = createContactEmail(this.getData(), false);
        const email_res = await apiPost('donate_email', email_data);
        if (!email_res.success) {
          this.errorStatus(this.donate_form_status_message, email_res.error_message ??
            'An unknown error occurred trying to send the donate form');
          return;
        }
        const token_res = await apiGetPost<TokenReponse>('donate', this.getTokenPostData());
        if (!token_res.success) {
          this.errorStatus(this.donate_form_status_message, email_res.error_message ??
            'An unknown error occurred trying to contact authorize.net servers');
          return;
        }
        if (token_res.result.messages.resultCode !== 'Ok') {
          const error = token_res.result?.messages?.message[0]?.text ?? 'No error returned';
          this.errorStatus(this.donate_form_status_message,
            `Authorize.net returned an error: ${error}`);
          return;
        }
        this.hidden_token_input.value = token_res.result.token;
        this.hidden_donate_form.submit();
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
      amount: this.getDonationAmount(),
    };
  }

  private getDonationAmount(): number {
    return parseInt(this.donate_amount.getData().replace('$', ''));
  }

  setData(data: DonateFormData): void {
    console.error('Not implemented');
  }

  private getTokenPostData() {
    const data_name = this.section_name.getData();
    const data_address = this.section_address.getData();
    const data_contact = this.section_contact.getData();
    const order = {
      'description': 'online donation',
    };
    const customer = {
      'email': data_contact.email,
    };
    const billTo = {
      'firstName': data_name.first,
      'lastName': data_name.last,
      'address': data_address.line1,
      'city': data_address.city,
      'state': data_address.state,
      'zip': data_address.zip,
      'country': data_address.country,
    };
    const transaction_request = {
      "transactionType": "authCaptureTransaction",
      "amount": this.getDonationAmount(),
      "order": order,
      "customer": customer,
      "billTo": billTo,
    };
    const base_url = window.location.origin;
    const hosted_payment_settings = {
      "setting": [{
        "settingName": "hostedPaymentReturnOptions",
        "settingValue": `{\"showReceipt\": true, \"url\": \"${base_url}/donate/receipt\", \"urlText\": \"Return to CUF\", \"cancelUrl\": \"${base_url}/donate\", \"cancelUrlText\": \"Cancel\"}`
      }, {
        "settingName": "hostedPaymentButtonOptions",
        "settingValue": "{\"text\": \"Donate\"}"
      }, {
        "settingName": "hostedPaymentStyleOptions",
        "settingValue": "{\"bgColor\": \"green\"}"
      }, {
        "settingName": "hostedPaymentPaymentOptions",
        "settingValue": "{\"cardCodeRequired\": true, \"showCreditCard\": true, \"showBankAccount\": false}"
      }, {
        "settingName": "hostedPaymentSecurityOptions",
        "settingValue": "{\"captcha\": true}"
      }, {
        "settingName": "hostedPaymentShippingAddressOptions",
        "settingValue": "{\"show\": false, \"required\": false}"
      }, {
        "settingName": "hostedPaymentBillingAddressOptions",
        "settingValue": "{\"show\": true, \"required\": true}"
      }, {
        "settingName": "hostedPaymentCustomerOptions",
        "settingValue": "{\"showEmail\": true, \"requiredEmail\": true, \"addPaymentProfile\": true}"
      }, {
        "settingName": "hostedPaymentOrderOptions",
        "settingValue": "{\"show\": true, \"merchantName\": \"CUF\"}"
      }, {
        "settingName": "hostedPaymentIFrameCommunicatorUrl",
        "settingValue": `{\"url\": \"${base_url}/donate/iframe_communicator.html\"}`
      }]
    };
    return {
      'getHostedPaymentPageRequest': {
        'transactionRequest': transaction_request,
        'hostedPaymentSettings': hosted_payment_settings
      }
    };
  }
}

customElements.define('cuf-donate-form', CufDonateForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-donate-form': CufDonateForm;
  }
}
