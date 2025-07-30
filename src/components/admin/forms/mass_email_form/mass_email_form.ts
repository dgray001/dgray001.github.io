import { CufForm } from '../../../common/form/form';
import { CufCheckbox } from '../../../common/form/form_field/checkbox/checkbox';
import { CufInputText } from '../../../common/form/form_field/input_text/input_text';
import { CufTextArea } from '../../../common/form/form_field/text_area/text_area';
import { FormFieldChangeEventData } from '../../../common/form/form_field/form_field';
import { apiPost } from '../../../../scripts/api';
import { clientCookies } from '../../../../scripts/cookies';

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
  private send_email_button: HTMLButtonElement;
  private checkbox_confirm_email: CufCheckbox;
  private checkbox_cancel_email: CufCheckbox;
  private send_emails_button: HTMLButtonElement;
  private status_message_send: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'checkbox_all_users',
      'checkbox_activated_users',
      'email_subject',
      'email_body',
      'checkbox_confirm_email',
      'checkbox_cancel_email',
    ]);
    this.configureElement('send_email_button');
    this.configureElement('send_emails_button');
    this.configureElement('status_message_send');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.checkbox_all_users.setData(true);
    this.send_email_button.addEventListener('click', async () => {
      if (!this.validate()) {
        return;
      }
      this.disable();
      const success = await recaptchaCallback(
        async () => {
          const cookies = clientCookies();
          const res = await apiPost('admin_dashboard/send_email', {
            email: cookies.get('email') ?? '',
            subject: `TEST: ${this.email_subject.getData() ?? ''}`,
            body: `<p>This email is a test so you can ensure the mass email looks correctly</p><hr><br>${this.email_body.getData() ?? ''}`,
          });
          if (!res.success) {
            this.errorStatus(this.status_message_send, res.error_message);
            console.error(res.error_message);
            this.reset();
            return false;
          }
          this.checkbox_confirm_email.classList.add('show');
          this.checkbox_confirm_email.enable();
          this.checkbox_cancel_email.classList.add('show');
          this.checkbox_cancel_email.enable();
          return true;
        },
        this.send_email_button,
        this.status_message_send,
        'Sending Test Email'
      );
      if (success) {
        this.send_email_button.disabled = true;
      }
    });
    this.send_emails_button.addEventListener('click', async () => {
      const success = await recaptchaCallback(
        async () => {
          const res = await apiPost('admin_dashboard/mass_send_email', this.getData());
          if (!res.success) {
            this.errorStatus(this.status_message_send, res.error_message);
            console.error(res.error_message);
            return false;
          }
          this.successStatus(
            this.status_message_send,
            `Successfully sent ${res.data?.sent_count ?? 0} emails and ${res.data?.errors?.length ?? 0} emails failed`
          );
        },
        this.send_emails_button,
        this.status_message_send,
        'Sending Emails'
      );
      if (success) {
        this.send_emails_button.disabled = true;
      }
    });
  }

  private reset() {
    this.checkbox_confirm_email.classList.remove('show');
    this.checkbox_cancel_email.classList.remove('show');
    this.send_emails_button.classList.remove('show');
    this.checkbox_confirm_email.setData(false);
    this.checkbox_cancel_email.setData(false);
    this.send_email_button.disabled = false;
    this.send_emails_button.disabled = false;
    this.enable();
  }

  protected override formFieldChangedEvent(data: FormFieldChangeEventData) {
    if (data.form_field_key === 'checkbox_all_users') {
      if (data.new_data) {
        this.checkbox_activated_users.classList.add('hide');
      } else {
        this.checkbox_activated_users.classList.remove('hide');
      }
    } else if (data.form_field_key === 'checkbox_confirm_email') {
      if (data.new_data) {
        this.send_emails_button.classList.add('show');
        this.checkbox_confirm_email.disable();
        this.checkbox_cancel_email.disable();
      }
    } else if (data.form_field_key === 'checkbox_cancel_email') {
      if (data.new_data) {
        this.reset();
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
