import {CufElement} from '../../../../cuf_element';

import html from './donate_form.html';

import './donate_form.scss';

export class CufDonateForm extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufDonateForm parsed!');
  }
}

customElements.define('cuf-donate-form', CufDonateForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-donate-form': CufDonateForm;
  }
}
