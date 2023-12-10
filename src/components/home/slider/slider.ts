import {CufElement} from '../../cuf_element';

import html from './slider.html';

import './slider.scss';

export class CufSlider extends CufElement {
  example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
  }
}

customElements.define('cuf-slider', CufSlider);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-slider': CufSlider;
  }
}
