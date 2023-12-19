import {CufElement} from '../../../../cuf_element';

import html from './input_text.html';

import './input_text.scss';

export class CufInputText extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufInputText parsed!');
  }
}

customElements.define('cuf-input-text', CufInputText);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-input-text': CufInputText;
  }
}
