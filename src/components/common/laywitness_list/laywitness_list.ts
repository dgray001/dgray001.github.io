import {CufElement} from '../../cuf_element';

import html from './laywitness_list.html';

import './laywitness_list.scss';

export class CufLaywitnessList extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufLaywitnessList parsed!');
  }
}

customElements.define('cuf-laywitness-list', CufLaywitnessList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-laywitness-list': CufLaywitnessList;
  }
}
