import { apiPost } from '@core/scripts/api';
import { getCookie } from '@core/scripts/cookies';
import { recaptchaCallback } from '@core/scripts/recaptcha';
import { DwgForm } from '@core/components/form/form';
import { DwgInputText } from '@core/components/form/form_field/input_text/input_text';

import html from './change_password_form.html';

import './change_password_form.scss';

/** Data captured in a change password form */
export declare interface ChangePasswordFormData {
  user_email: string;
  old_password: string;
  new_password: string;
}

export class CufChangePasswordForm extends DwgForm<ChangePasswordFormData> {
  private open_form!: HTMLButtonElement;
  private change_password_form!: HTMLFormElement;
  private change_password_old!: DwgInputText;
  private change_password_new!: DwgInputText;
  private change_password_button!: HTMLButtonElement;
  private status_message!: HTMLDivElement;

  private form_open = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm(['change_password_old', 'change_password_new', 'change_password_confirm']);
    this.configureElements(
      'open_form',
      'change_password_form',
      'change_password_button',
      'status_message'
    );
  }

  protected override async _parsedCallback(): Promise<void> {
    this.setFormOpen(false);
    this.open_form.addEventListener('click', () => {
      this.setFormOpen(!this.form_open);
    });
    this.change_password_button.addEventListener('click', () => {
      if (!this.validate()) {
        return;
      }
      recaptchaCallback(
        async () => {
          const res = await apiPost('change_password', this.getData());
          if (res.success) {
            this.successStatus(this.status_message, 'Password successfully changed');
            this.setFormOpen(false);
          } else {
            this.errorStatus(
              this.status_message,
              res.error_message ?? 'An unknown error occurred trying to send verification email'
            );
          }
        },
        this.change_password_button,
        this.status_message,
        'Changing Password'
      );
    });
  }

  private setFormOpen(open: boolean) {
    this.form_open = open;
    this.change_password_form.classList.toggle('show', this.form_open);
    this.open_form.innerText = this.form_open ? 'Cancel' : 'Change Password';
    if (this.form_open) {
      this.clearData();
    }
  }

  override getData(): ChangePasswordFormData {
    return {
      user_email: getCookie('email'),
      old_password: this.change_password_old.getData(),
      new_password: this.change_password_new.getData(),
    };
  }

  protected override _setData(data: ChangePasswordFormData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-change-password-form', CufChangePasswordForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-change-password-form': CufChangePasswordForm;
  }
}
