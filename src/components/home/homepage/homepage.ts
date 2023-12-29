import {CufElement} from '../../cuf_element';

import html from './homepage.html';

import './homepage.scss';
import '../header_home/header_home';
import '../slider/slider';

export class CufHomepage extends CufElement {
  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('header');
    this.configureElement('slider');
    this.configureElement('footer');
  }
}

customElements.define('cuf-homepage', CufHomepage);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-homepage': CufHomepage;
  }
}
