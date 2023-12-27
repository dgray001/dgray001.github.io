import {CufElement} from '../../../../cuf_element';

import html from './activate_account_form.html';

import './activate_account_form.scss';

export class CufActivateAccountForm extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufActivateAccountForm parsed!');
  }
}

customElements.define('cuf-activate-account-form', CufActivateAccountForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-activate-account-form': CufActivateAccountForm;
  }
}
