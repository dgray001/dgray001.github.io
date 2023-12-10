import {CufElement} from '../../cuf_element';

import html from './footer.html';

import './footer.scss';

export class CufFooter extends CufElement {
  example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufFooter parsed!');
  }
}

customElements.define('cuf-footer', CufFooter);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-footer': CufFooter;
  }
}
