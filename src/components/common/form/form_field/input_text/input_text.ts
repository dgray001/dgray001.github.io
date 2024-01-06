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
    const datatype = this.attributes.getNamedItem('datatype')?.value ?? '';
    const datalist = this.attributes.getNamedItem('datalist')?.value ?? '';
    if (!!datatype) {
      this.removeAttribute('datatype');
      this.form_field.setAttribute('type', datatype);
      if (datatype === 'password') {
        const eyeball = document.createElement('img');
        eyeball.src = '/images/eye.png';
        eyeball.classList.add('password-reveal');
        const no_eyeball = document.createElement('img');
        no_eyeball.src = '/images/no_eye.png';
        no_eyeball.classList.add('password-reveal');
        no_eyeball.setAttribute('style', 'display: none;');
        eyeball.addEventListener('click', () => {
          this.form_field.setAttribute('type', 'text');
          eyeball.setAttribute('style', 'display: none;');
          no_eyeball.removeAttribute('style');
        });
        no_eyeball.addEventListener('click', () => {
          this.form_field.setAttribute('type', 'password');
          no_eyeball.setAttribute('style', 'display: none;');
          eyeball.removeAttribute('style');
        });
        this.appendChild(eyeball);
        this.appendChild(no_eyeball);
      }
    }
    if (!!datalist) {
      await this.setDatalist(datalist);
    }
  }

  async setDatalist(datalist: string) {
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

  protected _enable(): void {
    this.form_field.disabled = false;
  }

  protected _disable(): void {
    this.form_field.disabled = true;
  }

  override getData(): string {
    if (this.use_datalist) {
      for (const [k, o] of this.datalist_options) {
        if (this.form_field.value === o.innerText) {
          return o.attributes.getNamedItem('data_value')?.value;
        }
      }
    }
    return this.form_field.value;
  }

  override getStringData(): string {
    return this.getData();
  }

  override _setData(data: string): void {
    this.form_field.value = data;
  }

  override clearData(): void {
    this.form_field.value = '';
  }

  override setTestData(): void {
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
