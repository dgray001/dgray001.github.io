import { CufForm } from '../../../common/form/form';
import { CufCheckbox } from '../../../common/form/form_field/checkbox/checkbox';
import { CufInputText } from '../../../common/form/form_field/input_text/input_text';
import { CufTextArea } from '../../../common/form/form_field/text_area/text_area';
import { FormFieldChangeEventData } from '../../../common/form/form_field/form_field';
import { apiPost } from '../../../../scripts/api';

import html from './mass_email_form.html';

import './mass_email_form.scss';
import '../../../common/form/form_field/checkbox/checkbox';
import '../../../common/form/form_field/text_area/text_area';
import { recaptchaCallback } from '../../../../scripts/recaptcha';

/** Data captured in a mass email form */
export declare interface MassEmailData {
  all_users: boolean;
  activated: boolean;
  subject: string;
  body: string;
}

export class CufMassEmailForm extends CufForm<MassEmailData> {
  private checkbox_all_users: CufCheckbox;
  private checkbox_activated_users: CufCheckbox;
  private email_subject: CufInputText;
  private email_body: CufTextArea;
  private send_emails_button: HTMLButtonElement;
  private status_message_send: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm(['checkbox_all_users', 'checkbox_activated_users', 'email_subject', 'email_body']);
    this.configureElement('send_emails_button');
    this.configureElement('status_message_send');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.checkbox_all_users.setData(true);
    this.send_emails_button.addEventListener('click', async () => {
      if (!this.validate()) {
        return;
      }
      recaptchaCallback(
        async () => {
          const res = await apiPost('mass_send_email', this.getData());
          console.log(res);
        },
        this.send_emails_button,
        this.status_message_send,
        'Sending Emails',
      );
    });
  }

  protected override formFieldChangedEvent(data: FormFieldChangeEventData) {
    if (data.form_field_key === 'checkbox_all_users') {
      if (data.new_data) {
        this.checkbox_activated_users.classList.add('hide');
      } else {
        this.checkbox_activated_users.classList.remove('hide');
      }
    }
  }

  getData(): MassEmailData {
    return {
      all_users: this.checkbox_all_users.getData() ?? false,
      activated: this.checkbox_activated_users.getData() ?? true,
      subject: this.email_subject.getData() ?? '',
      body: this.email_body.getData() ?? '',
    };
  }

  protected _setData(data: MassEmailData): void {
    this.checkbox_all_users.setData(data.all_users ?? false);
    this.checkbox_activated_users.setData(data.activated ?? true);
    this.email_subject.setData(data.subject ?? '');
    this.email_body.setData(data.body ?? '');
  }
}

customElements.define('cuf-mass-email-form', CufMassEmailForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-mass-email-form': CufMassEmailForm;
  }
}
