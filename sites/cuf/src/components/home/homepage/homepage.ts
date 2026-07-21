import { DwgElement } from '@core/components/dwg_element';

import html from './homepage.html';

import './homepage.scss';
import '../header_home/header_home';
import '../slider/slider';

export class CufHomepage extends DwgElement {
  constructor() {
    super();
    this.htmlString = html;
    this.configureElements('header', 'slider', 'footer');
  }
}

customElements.define('cuf-homepage', CufHomepage);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-homepage': CufHomepage;
  }
}
