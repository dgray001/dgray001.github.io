import {CufElement} from '../../cuf_element';

import html from './header.html';

import './header.scss';

export class CufHeader extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufHeader parsed!');
  }
}

customElements.define('cuf-header', CufHeader);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-header': CufHeader;
  }
}
