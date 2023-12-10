import {CufElement} from '../../cuf_element';

import html from './header_home.html';

import './header_home.scss';

export class CufHeaderHome extends CufElement {
  example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufHeaderHome parsed!');
  }
}

customElements.define('cuf-header-home', CufHeaderHome);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-header-home': CufHeaderHome;
  }
}
