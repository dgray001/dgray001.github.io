import {CufElement} from '../../../../cuf_element';

import html from './form_section_address.html';

import './form_section_address.scss';

export class CufFormSectionAddress extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufFormSectionAddress parsed!');
  }
}

customElements.define('cuf-form-section-address', CufFormSectionAddress);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-address': CufFormSectionAddress;
  }
}
