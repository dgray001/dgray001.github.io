import {CufElement} from '../../../../cuf_element';

import html from './form_section_membership.html';

import './form_section_membership.scss';

export class CufFormSectionMembership extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufFormSectionMembership parsed!');
  }
}

customElements.define('cuf-form-section-membership', CufFormSectionMembership);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-membership': CufFormSectionMembership;
  }
}
