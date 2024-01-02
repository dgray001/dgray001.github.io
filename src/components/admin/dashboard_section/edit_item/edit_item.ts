import {CufElement} from '../../../cuf_element';

import html from './edit_item.html';

import './edit_item.scss';

export class CufEditItem extends CufElement {
  private item_title: HTMLButtonElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('item_title');
  }

  protected override parsedCallback(): void {
    console.log('CufEditItem parsed!');
  }
}

customElements.define('cuf-edit-item', CufEditItem);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-edit-item': CufEditItem;
  }
}
