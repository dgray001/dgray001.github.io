import { DwgElement } from '@core/components/dwg_element';

import html from './spinner.html';

import './spinner.scss';

export class DwgSpinner extends DwgElement {
  constructor() {
    super();
    this.htmlString = html;
  }
}

customElements.define('dwg-spinner', DwgSpinner);

declare global {
  interface HTMLElementTagNameMap {
    'dwg-spinner': DwgSpinner;
  }
}
