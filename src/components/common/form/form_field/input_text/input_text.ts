import {CufFormField} from '../form_field';
import {defaultMapping, specificMapping} from '../../../../../scripts/datalists';

import html from './input_text.html';

import './input_text.scss';

export class CufInputText extends CufFormField<HTMLInputElement, string> {
  private use_datalist = false;
  private datalist_options = new Map<string, HTMLOptionElement>();

  constructor() {
    super();
    this.htmlString += html;
  }

  protected override async _parsedCallback(): Promise<void> {
    const datalist = this.attributes.getNamedItem('datalist')?.value ?? '';
    if (!!datalist) {
      this.use_datalist = true;
      const datalist_element = document.createElement('datalist');
      datalist_element.setAttribute('id', `${this.id}-${datalist}-datalist`);
      const mapping = await specificMapping(datalist);
      const default_mapping = defaultMapping(datalist);
      for (const item of mapping) {
        const item_element = document.createElement('option');
        item_element.setAttribute('data_value', item.value);
        item_element.innerText = item.text;
        datalist_element.appendChild(item_element);
        this.datalist_options.set(item.value, item_element);
      }
      this.form_field.setAttribute('list', datalist_element.id);
      this.form_field.value = default_mapping;
      this.appendChild(datalist_element);
    }
  }

  protected _enable(): void {
    this.form_field.disabled = false;
  }

  protected _disable(): void {
    this.form_field.disabled = true;
  }

  getData(): string {
    if (this.use_datalist) {
      for (const [k, o] of this.datalist_options) {
        if (this.form_field.value === o.innerText) {
          return o.attributes.getNamedItem('data_value')?.value;
        }
      }
    }
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
    if (this.use_datalist) {
      this.setData([...this.datalist_options.values()][0].text);
      return;
    }
    if (this.getValidators().some(v => v === 'email')) {
      this.setData('testemail@some.site');
    } else if (this.getValidators().some(v => v === 'suffix')) {
      this.setData('III');
    } else if (this.getValidators().some(v => v === 'money')) {
      this.setData('$12');
    } else {
      this.setData('some input');
    }
  }
}

customElements.define('cuf-input-text', CufInputText);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-input-text': CufInputText;
  }
}
