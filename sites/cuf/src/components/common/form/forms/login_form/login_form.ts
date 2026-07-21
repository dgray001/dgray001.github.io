import { DwgForm } from '@core/components/form/form';
import { DwgInputText } from '@core/components/form/form_field/input_text/input_text';
import { recaptchaCallback } from '@core/scripts/recaptcha';
import { apiPost } from '@core/scripts/api';
import { loggedIn } from '@core/scripts/session';
import { getCookie } from '@core/scripts/cookies';
import { getUrlParam, internalHref, navigate, removeUrlParam } from '@core/scripts/url';

import html from './login_form.html';

import './login_form.scss';
import '@core/components/form/form_field/input_text/input_text';

/** Data describing the contact form */
export declare interface LoginFormData {
  username: string;
  password: string;
}

export class CufLoginForm extends DwgForm<LoginFormData> {
  private username_field!: DwgInputText;
  private password_field!: DwgInputText;
  private form_wrapper!: HTMLDivElement;
  private login_form_button!: HTMLButtonElement;
  private logout_form_wrapper!: HTMLDivElement;
  private logout_form_button!: HTMLButtonElement;
  private login_form_status_message!: HTMLDivElement;
  private activate_account!: HTMLAnchorElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm(['username_field', 'password_field']);
    this.configureElements(
      'form_wrapper',
      'login_form_button',
      'logout_form_wrapper',
      'logout_form_button',
      'login_form_status_message',
      'activate_account'
    );
  }

  protected override async _parsedCallback(): Promise<void> {
    this.activate_account.href = internalHref('login/activate');
    const reset_password_link =
      this.password_field.querySelector<HTMLAnchorElement>('#reset-password-link');
    if (reset_password_link) {
      reset_password_link.href = internalHref('login/reset_password');
    }
    const isLoggedIn = await loggedIn();
    if (isLoggedIn) {
      this.form_wrapper.remove();
      this.activate_account.remove();
      this.messageStatus(
        this.login_form_status_message,
        `You are already logged in as <b>${getCookie('email')}</b><br>Please logout to switch accounts`
      );
      this.logout_form_button.addEventListener('click', () => {
        recaptchaCallback(
          async () => {
            const res = await apiPost('logout', {});
            if (res.success) {
              location.reload();
            } else {
              this.errorStatus(
                this.login_form_status_message,
                res.error_message ?? 'An unknown error occurred trying to logout'
              );
            }
          },
          this.logout_form_button,
          this.login_form_status_message,
          'Logging Out'
        );
      });
    } else {
      this.logout_form_wrapper.remove();
      if (DEV) {
        this.setTestData();
      }
      if (getUrlParam('redirect')) {
        this.messageStatus(
          this.login_form_status_message,
          'Please login to gain access to this page'
        );
      }
      this.login_form_button.addEventListener('click', () => {
        if (!this.validate()) {
          return;
        }
        recaptchaCallback(
          async () => {
            const res = await apiPost('login', this.getData());
            if (res.success) {
              const redirect = getUrlParam('redirect');
              if (redirect) {
                removeUrlParam('redirect');
                navigate(redirect);
              } else {
                removeUrlParam('redirect');
                navigate('');
              }
            } else {
              this.errorStatus(
                this.login_form_status_message,
                res.error_message ?? 'An unknown error occurred trying to login'
              );
            }
          },
          this.login_form_button,
          this.login_form_status_message,
          'Logging In'
        );
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

  override getData(): LoginFormData {
    return {
      username: this.username_field.getData(),
      password: this.password_field.getData(),
    };
  }

  protected override _setData(data: LoginFormData): void {
    this.username_field.setData(data.username ?? '');
    this.password_field.setData(data.password ?? '');
  }
}

customElements.define('cuf-login-form', CufLoginForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-login-form': CufLoginForm;
  }
}
