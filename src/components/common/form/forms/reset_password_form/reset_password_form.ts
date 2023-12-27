import {CufElement} from '../../../../cuf_element';

import html from './reset_password_form.html';

import './reset_password_form.scss';

export class CufResetPasswordForm extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufResetPasswordForm parsed!');
  }
}

customElements.define('cuf-reset-password-form', CufResetPasswordForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-reset-password-form': CufResetPasswordForm;
  }
}
