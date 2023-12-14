import {CufElement} from '../../cuf_element';
import {CufHeader} from '../header/header';

import html from './secondary_page.html';

import './secondary_page.scss';
import '../header/header';

export class CufSecondaryPage extends CufElement {
  private header: CufHeader;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufSecondaryPage parsed!');
  }
}

customElements.define('cuf-secondary-page', CufSecondaryPage);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-secondary-page': CufSecondaryPage;
  }
}
