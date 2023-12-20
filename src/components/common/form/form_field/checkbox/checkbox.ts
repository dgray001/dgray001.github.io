import {CufFormField} from '../form_field';

import html from './checkbox.html';

import './checkbox.scss';

export class CufCheckbox extends CufFormField<HTMLInputElement, boolean> {
  constructor() {
    super();
    this.htmlString = html + this.htmlString;
  }

  protected override async _parsedCallback(): Promise<void> {
    this.addEventListener('click', (e: MouseEvent) => {
      this.form_field.checked = !this.form_field.checked;
      e.preventDefault();
      e.stopPropagation();
    });
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

  getStringData(): string {
    return this.getData() ? 'true' : 'false';
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
