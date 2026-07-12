import { CufElement } from '../../cuf_element';

import html from './spinner.html';

import './spinner.scss';

export class CufSpinner extends CufElement {
  constructor() {
    super();
    this.htmlString = html;
  }
}

customElements.define('cuf-spinner', CufSpinner);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-spinner': CufSpinner;
  }
}
