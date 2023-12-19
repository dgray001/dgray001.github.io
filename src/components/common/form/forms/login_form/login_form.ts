import {CufElement} from '../../../../cuf_element';

import html from './login_form.html';

import './login_form.scss';

export class CufLoginForm extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufLoginForm parsed!');
  }
}

customElements.define('cuf-login-form', CufLoginForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-login-form': CufLoginForm;
  }
}
