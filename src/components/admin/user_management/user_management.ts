import { CufElement } from '../../cuf_element';
import { CufMassEmailForm } from '../forms/mass_email_form/mass_email_form';

import html from './user_management.html';

import './user_management.scss';
import '../forms/mass_email_form/mass_email_form';

export class CufUserManagement extends CufElement {
  private mass_email_form: CufMassEmailForm;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('mass_email_form');
  }

  protected override parsedCallback(): void {}
}

customElements.define('cuf-user-management', CufUserManagement);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-user-management': CufUserManagement;
  }
}
