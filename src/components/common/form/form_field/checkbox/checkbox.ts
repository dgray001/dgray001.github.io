import {CufFormField} from '../form_field';

import html from './checkbox.html';

import './checkbox.scss';

export class CufCheckbox extends CufFormField<HTMLInputElement, boolean> {
  constructor() {
    super();
    this.htmlString = html + this.htmlString;
  }

  protected _enable(): void {
    this.form_field.disabled = false;
  }

  protected _disable(): void {
    this.form_field.disabled = true;
  }

  getData(): boolean {
    return this.form_field.checked;
  }

  _setData(data: boolean): void {
    this.form_field.checked = data;
  }

  clearData(): void {
    this.form_field.checked = false;
  }
}

customElements.define('cuf-checkbox', CufCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-checkbox': CufCheckbox;
  }
}
