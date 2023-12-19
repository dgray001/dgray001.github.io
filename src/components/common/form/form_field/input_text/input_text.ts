import {CufFormField} from '../form_field';

import html from './input_text.html';

import './input_text.scss';

export class CufInputText extends CufFormField<HTMLInputElement, string> {
  constructor() {
    super();
    this.htmlString += html;
  }

  protected _enable(): void {
    this.form_field.disabled = false;
  }

  protected _disable(): void {
    this.form_field.disabled = true;
  }

  getData(): string {
    return this.form_field.value;
  }

  _setData(data: string): void {
    this.form_field.value = data;
  }

  clearData(): void {
    this.form_field.value = '';
  }
}

customElements.define('cuf-input-text', CufInputText);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-input-text': CufInputText;
  }
}
