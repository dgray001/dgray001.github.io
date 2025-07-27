import { CufElement } from '../../cuf_element';

import html from './footer.html';

import './footer.scss';

export class CufFooter extends CufElement {
  constructor() {
    super();
    this.htmlString = html;
  }
}

customElements.define('cuf-footer', CufFooter);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-footer': CufFooter;
  }
}
