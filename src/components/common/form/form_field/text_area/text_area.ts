import {until} from '../../../../../scripts/util';
import {CufFormField} from '../form_field';

import html from './text_area.html';

import './text_area.scss';

export class CufTextArea extends CufFormField<HTMLInputElement, string> {
  private min_rows = 0;

  constructor() {
    super();
    this.htmlString += html;
  }

  override async _parsedCallback(): Promise<void> {
    this.min_rows = parseInt(this.attributes.getNamedItem('min-rows')?.value) ?? 0;
    this.setMinHeight();
  }

  private async setMinHeight() {
    await until(() => !!this.form_field.scrollHeight);
    const previous_value = this.form_field.value;
    this.form_field.value = '\n'.repeat(this.min_rows - 1);
    this.form_field.style.setProperty('--min-height', `${(this.form_field.scrollHeight + 2).toString()}px`);
    this.form_field.value = previous_value;
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

customElements.define('cuf-text-area', CufTextArea);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-text-area': CufTextArea;
  }
}
