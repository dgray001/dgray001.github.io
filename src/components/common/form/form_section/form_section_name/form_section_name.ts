import {CufElement} from '../../../../cuf_element';

import html from './form_section_name.html';

import './form_section_name.scss';

export class CufFormSectionName extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufFormSectionName parsed!');
  }
}

customElements.define('cuf-form-section-name', CufFormSectionName);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-name': CufFormSectionName;
  }
}
