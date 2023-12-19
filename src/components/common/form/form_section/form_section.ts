import {CufElement} from '../../../cuf_element';
import {CufFormField} from '../form_field/form_field';

import html from './form_section.html';

import './form_section.scss';

export abstract class CufFormSection<T> extends CufElement {
  private form_fields: CufFormField<any, any>[] = [];
  private valid = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
  }

  addFormField(field: CufFormField<any, any>) {
    this.form_fields.push(field);
  }

  validate(): boolean {
    this.valid = true;
    for (const field of this.form_fields) {
      if (!field.validate()) {
        this.valid = false;
      }
    }
    this.classList.toggle('valid', this.valid);
    this.classList.toggle('invalid', !this.valid);
    return this.valid;
  }

  enable(): void {
    this.classList.add('disabled');
    for (const field of this.form_fields) {
      field.enable();
    }
  }

  disable(): void {
    this.classList.remove('disabled');
    for (const field of this.form_fields) {
      field.disable();
    }
  }

  clearData(): void {
    for (const field of this.form_fields) {
      field.clearData();
    }
  }

  abstract getData(): T;
  abstract setData(data: T): void;
}
