import {CufForm} from '../../form';
import {CufInputText} from '../../form_field/input_text/input_text';
import {recaptchaCallback} from '../../../../../scripts/recaptcha';
import {DEV} from '../../../../../scripts/util';
import {apiPost} from '../../../../../scripts/api';

import html from './login_form.html';

import './login_form.scss';
import '../../form_field/input_text/input_text';
import { loggedIn } from '../../../../../scripts/session';
import { getCookie } from '../../../../../scripts/cookies';

/** Data describing the contact form */
export declare interface LoginFormData {
  username: string;
  password: string;
}

export class CufLoginForm extends CufForm<LoginFormData> {
  private username_field: CufInputText;
  private password_field: CufInputText;
  private form_wrapper: HTMLDivElement;
  private login_form_button: HTMLButtonElement;
  private logout_form_wrapper: HTMLDivElement;
  private logout_form_button: HTMLButtonElement;
  private login_form_status_message: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'username_field',
      'password_field',
    ]);
    this.configureElement('form_wrapper');
    this.configureElement('login_form_button');
    this.configureElement('logout_form_wrapper');
    this.configureElement('logout_form_button');
    this.configureElement('login_form_status_message');
  }

  protected override async _parsedCallback(): Promise<void> {
    if (await loggedIn()) {
      this.form_wrapper.remove();
      this.messageStatus(this.login_form_status_message,
        `You are already logged in as <b>${getCookie('email')}</b><br>Please logout to switch accounts`);
    } else {
      this.logout_form_wrapper.remove();
      if (DEV) {
        this.setTestData();
      }
      this.login_form_button.addEventListener('click', () => {
        if (!this.validate()) {
          return;
        }
        recaptchaCallback(async () => {
          const res = await apiPost('login', this.getData());
          if (res.success) {
            //
          } else {
            this.errorStatus(this.login_form_status_message, res.error_message ??
              'An unknown error occurred trying to login');
          }
        }, this.login_form_button, this.login_form_status_message, 'Logging In');
      });
    }
  }

  protected override postValidate(valid: boolean): void {
    if (valid) {
      this.messageStatus(this.login_form_status_message, '');
    } else {
      this.errorStatus(this.login_form_status_message, 'Please fix the validation errors');
    }
  }

  /*protected override setTestData(): void {
    //
  }*/

  getData(): LoginFormData {
    return {
      username: this.username_field.getData(),
      password: this.password_field.getData(),
    };
  }

  setData(data: LoginFormData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-login-form', CufLoginForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-login-form': CufLoginForm;
  }
}
