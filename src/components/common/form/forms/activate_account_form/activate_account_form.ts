import {apiPost} from '../../../../../scripts/api';
import {getCookie} from '../../../../../scripts/cookies';
import {recaptchaCallback} from '../../../../../scripts/recaptcha';
import {hasPermission, loggedIn} from '../../../../../scripts/session';
import {getUrlParam} from '../../../../../scripts/url';
import {DEV} from '../../../../../scripts/util';
import {CufForm} from '../../form';
import {CufInputText} from '../../form_field/input_text/input_text';

import html from './activate_account_form.html';

import './activate_account_form.scss';

/** Data captured in a reset password form */
export declare interface ActivateAccountFormData {
  email: string;
  expect_activated: boolean;
  expect_logged_in: boolean;
  verification_code: string;
  password: string;
}

export class CufActivateAccountForm extends CufForm<ActivateAccountFormData> {
  private email_field: CufInputText;
  private code_field: CufInputText;
  private password_field1: CufInputText;
  private password_field2: CufInputText;
  private form_button_email: HTMLButtonElement;
  private status_message_email: HTMLDivElement;
  private form_button_code: HTMLButtonElement;
  private status_message_code: HTMLDivElement;
  private form_button_password: HTMLButtonElement;
  private status_message_password: HTMLDivElement;

  private active_status_message: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'email_field',
      'code_field',
      'password_field1',
      'password_field2',
    ]);
    this.configureElement('form_button_email');
    this.configureElement('status_message_email');
    this.configureElement('form_button_code');
    this.configureElement('status_message_code');
    this.configureElement('form_button_password');
    this.configureElement('status_message_password');
  }

  protected override async _parsedCallback(): Promise<void> {
    if (await loggedIn()) {
      location.href = '/profile?h=account_management';
      return;
    }
    if (DEV) {
      this.setTestData();
    }
    this.active_status_message = this.status_message_email;
    this.form_button_email.addEventListener('click', () => {
      if (!this.validate()) {
        return;
      }
      recaptchaCallback(async () => {
        const res = await apiPost('verify_email_code', this.getData());
        if (res.success) {
          this.email_field.disable();
          this.form_button_email.classList.remove('show');
          this.status_message_email.classList.remove('show');
          this.code_field.classList.add('show');
          this.code_field.addValidators('required');
          this.form_button_code.classList.add('show');
          this.status_message_code.classList.add('show');
          this.active_status_message = this.status_message_code;
        } else {
          this.errorStatus(this.status_message_email, res.error_message ??
            'An unknown error occurred trying to send verification email');
        }
      }, this.form_button_email, this.status_message_email, 'Sending Verification Code');
    });
    this.form_button_code.addEventListener('click', () => {
      if (!this.validate()) {
        return;
      }
      recaptchaCallback(async () => {
        const res = await apiPost('verify_email', this.getData());
        if (res.success) {
          this.code_field.disable();
          this.form_button_code.classList.remove('show');
          this.status_message_code.classList.remove('show');
          this.password_field1.classList.add('show');
          this.password_field1.addValidators('required', 'password');
          this.password_field2.classList.add('show');
          this.password_field2.addValidators('required', 'password', 'equals=password_field1=Passwords must match');
          this.form_button_password.classList.add('show');
          this.status_message_password.classList.add('show');
          this.active_status_message = this.status_message_password;
        } else {
          this.errorStatus(this.status_message_code, res.error_message ??
            'An unknown error occurred trying to verify email');
        }
      }, this.form_button_code, this.status_message_code, 'Verifying Email');
    });
    this.form_button_password.addEventListener('click', () => {
      if (!this.validate()) {
        return;
      }
      recaptchaCallback(async () => {
        const res = await apiPost('activate_account', this.getData());
        if (res.success) {
          const redirect = getUrlParam('redirect');
          if (redirect) {
            document.location.href = redirect;
          } else {
            location.href = hasPermission(getCookie('role'), 'viewAdminDashboard') ?
              '/admin_dashboard' : '/profile';
          }
        } else {
          this.errorStatus(this.status_message_password, res.error_message ??
            'An unknown error occurred trying to reset password');
        }
      }, this.form_button_password, this.status_message_password, 'Verifying Email');
    });
  }

  protected override postValidate(valid: boolean): void {
    if (valid) {
      this.messageStatus(this.active_status_message, '');
    } else {
      this.errorStatus(this.active_status_message, 'Please fix the validation errors');
    }
  }

  override getData(): ActivateAccountFormData {
    return {
      email: this.email_field.getData(),
      expect_activated: false,
      expect_logged_in: false,
      verification_code: this.code_field.getData(),
      password: this.password_field1.getData(),
    };
  }

  protected override _setData(data: ActivateAccountFormData): void {
    console.error('Not implemented');
  }

  override setTestData(): void {
    this.email_field.setTestData();
  }
}

customElements.define('cuf-activate-account-form', CufActivateAccountForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-activate-account-form': CufActivateAccountForm;
  }
}
