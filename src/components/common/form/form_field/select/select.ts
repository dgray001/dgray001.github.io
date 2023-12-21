import {defaultMapping, specificMapping} from '../../../../../scripts/datalists';
import {CufFormField} from '../form_field';

import html from './select.html';

import './select.scss';

export class CufSelect extends CufFormField<HTMLSelectElement, string> {
  private options = new Map<string, string>();

  constructor() {
    super();
    this.htmlString += html;
  }

  override async _parsedCallback(): Promise<void> {
    const options_text = this.attributes.getNamedItem('options')?.value ?? '[]';
    const mapping = await specificMapping(options_text);
    const default_mapping = defaultMapping(options_text);
    for (const data of mapping) {
      const option = document.createElement("option");
      option.setAttribute('value', data.value);
      if (default_mapping === data.text) {
        option.setAttribute('selected', 'true');
      }
      option.innerText = data.text;
      this.form_field.appendChild(option);
      this.options.set(data.value, data.text);
    }
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

  getStringData(): string {
    return this.getData();
  }

  _setData(data: string): void {
    this.form_field.value = data;
  }

  clearData(): void {
    this.form_field.value = '';
  }

  setTestData(): void {
    if (!!this.options.size) {
      this.setData([...this.options.keys()][0]);
    }
  }
}

customElements.define('cuf-select', CufSelect);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-select': CufSelect;
  }
}
