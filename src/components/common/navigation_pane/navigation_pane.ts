import {CufElement} from '../../cuf_element';

import html from './navigation_pane.html';

import './navigation_pane.scss';

export class CufNavigationPane extends CufElement {
  example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufNavigationPane parsed!');
  }
}

customElements.define('cuf-navigation-pane', CufNavigationPane);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-navigation-pane': CufNavigationPane;
  }
}
