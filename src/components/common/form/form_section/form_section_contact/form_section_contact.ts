import {CufElement} from '../../../../cuf_element';

import html from './form_section_contact.html';

import './form_section_contact.scss';

export class CufFormSectionContact extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufFormSectionContact parsed!');
  }
}

customElements.define('cuf-form-section-contact', CufFormSectionContact);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-contact': CufFormSectionContact;
  }
}
