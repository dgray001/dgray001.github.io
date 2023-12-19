import {CufForm} from '../../form';

import html from './contact_form.html';

import './contact_form.scss';

interface ContactData {
  //
}

export class CufContactForm extends CufForm<ContactData> {

  constructor() {
    super();
    this.htmlString = html;
  }

  getData(): ContactData {
    return {};
  }

  setData(data: ContactData): void {
    //
  }
}

customElements.define('cuf-contact-form', CufContactForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-contact-form': CufContactForm;
  }
}
