import {CufElement} from '../../cuf_element';

import html from './sidebar.html';

import './sidebar.scss';

export class CufSidebar extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufSidebar parsed!');
  }
}

customElements.define('cuf-sidebar', CufSidebar);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-sidebar': CufSidebar;
  }
}
