import {CufElement} from '../../cuf_element';
import {CufFormField} from './form_field/form_field';
import {CufFormSection} from './form_section/form_section';

import html from './form.html';

import './form.scss';

export abstract class CufForm<T> extends CufElement {
  private form_sections: (CufFormSection<any>|CufFormField<any, any>)[] = [];
  private valid = false;

  constructor() {
    super();
    this.htmlString = html;
  }

  protected override parsedCallback(): void {
  }

  addFormSection(section: CufFormSection<any>|CufFormField<any, any>) {
    this.form_sections.push(section);
  }

  validate(): boolean {
    this.valid = true;
    for (const section of this.form_sections) {
      if (!section.validate()) {
        this.valid = false;
      }
    }
    this.classList.toggle('valid', this.valid);
    this.classList.toggle('invalid', !this.valid);
    return this.valid;
  }

  enable(): void {
    this.classList.add('disabled');
    for (const section of this.form_sections) {
      section.enable();
    }
  }

  disable(): void {
    this.classList.remove('disabled');
    for (const section of this.form_sections) {
      section.disable();
    }
  }

  clearData(): void {
    for (const section of this.form_sections) {
      section.clearData();
    }
  }

  abstract getData(): T;
  abstract setData(data: T): void;
}
