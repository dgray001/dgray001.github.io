import {CufForm} from '../../form';
import {CufInputText} from '../../form_field/input_text/input_text';
import {loggedIn} from '../../../../../scripts/session';

import html from './reset_password_form.html';

import './reset_password_form.scss';
import '../../form_field/input_text/input_text';
import { recaptchaCallback } from '../../../../../scripts/recaptcha';
import { apiPost } from '../../../../../scripts/api';
import { DEV } from '../../../../../scripts/util';

/** Data captured in a reset password form */
export declare interface ResetPasswordFormData {
  email: string;
  expect_activated: boolean;
  expect_logged_in: boolean;
  verification_code: string;
  password: string;
}

export class CufResetPasswordForm extends CufForm<ResetPasswordFormData> {
  email_field: CufInputText;
  code_field: CufInputText;
  password_field1: CufInputText;
  password_field2: CufInputText;
  form_button_email: HTMLButtonElement;
  status_message_email: HTMLDivElement;
  form_button_code: HTMLButtonElement;
  status_message_code: HTMLDivElement;
  form_button_password: HTMLButtonElement;
  status_message_password: HTMLDivElement;

  active_status_message: HTMLDivElement;

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
      // navigate to profile change password section
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
        console.log(res);
      }, this.form_button_email, this.status_message_email, 'Sending Verification Code');
    });
  }

  protected override postValidate(valid: boolean): void {
    if (valid) {
      this.messageStatus(this.active_status_message, '');
    } else {
      this.errorStatus(this.active_status_message, 'Please fix the validation errors');
    }
  }

  getData(): ResetPasswordFormData {
    return {
      email: this.email_field.getData(),
      expect_activated: true,
      expect_logged_in: false,
      verification_code: this.code_field.getData(),
      password: this.password_field1.getData(),
    };
  }

  setData(data: ResetPasswordFormData): void {
    console.error('Not implemented');
  }

  override setTestData(): void {
    this.email_field.setTestData();
  }
}

customElements.define('cuf-reset-password-form', CufResetPasswordForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-reset-password-form': CufResetPasswordForm;
  }
}
