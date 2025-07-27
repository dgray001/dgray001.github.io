import { CufFormField, formFieldChangeEvent } from '../form_field';

import html from './checkbox.html';

import './checkbox.scss';

export class CufCheckbox extends CufFormField<HTMLInputElement, boolean> {
  constructor() {
    super();
    this.htmlString = html + this.htmlString;
    this.setAttribute('tabindex', '1');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.addEventListener('click', (e: MouseEvent) => {
      this.form_field.checked = !this.form_field.checked;
      e.preventDefault();
      e.stopPropagation();
      const customEvent = formFieldChangeEvent<boolean>(this.tagName, this.id.replaceAll('-', '_'), this.form_field.checked);
      this.dispatchEvent(customEvent);
    });
    this.addEventListener('keyup', (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
      this.form_field.checked = !this.form_field.checked;
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

  setTestData(): void {
    this.setData(Math.random() >= 0.5 ? true : false);
  }
}

customElements.define('cuf-checkbox', CufCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-checkbox': CufCheckbox;
  }
}
