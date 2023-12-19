import {CufElement} from '../../../../cuf_element';

import html from './text_area.html';

import './text_area.scss';

export class CufTextArea extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufTextArea parsed!');
  }
}

customElements.define('cuf-text-area', CufTextArea);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-text-area': CufTextArea;
  }
}
