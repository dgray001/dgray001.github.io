import {CufElement} from '../../cuf_element';

import html from './content_card.html';

import './content_card.scss';

export class CufContentCard extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufContentCard parsed!');
  }
}

customElements.define('cuf-content-card', CufContentCard);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-content-card': CufContentCard;
  }
}
