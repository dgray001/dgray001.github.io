import {CufElement} from '../../../../cuf_element';

import html from './select.html';

import './select.scss';

export class CufSelect extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufSelect parsed!');
  }
}

customElements.define('cuf-select', CufSelect);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-select': CufSelect;
  }
}
