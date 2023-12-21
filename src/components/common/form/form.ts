import {CufElement} from '../../cuf_element';
import {CufFormField} from './form_field/form_field';
import {CufFormSection} from './form_section/form_section';

import html from './form.html';

import './form.scss';

export abstract class CufForm<T> extends CufElement {
  private form_sections: (CufFormSection<any, any>|CufFormField<any, any>)[] = [];
  private valid = false;
  private ran_parsed_callback = false;
  private section_ids: string[] = [];

  constructor() {
    super();
    this.htmlString = html;
    this.classList.add('hidden');
    this.classList.add('cuf-form');
  }

  protected configureForm(section_ids: string[]) {
    this.section_ids = section_ids;
    for (const id of this.section_ids) {
      this.configureElement(id);
    }
  }

  protected override async parsedCallback(): Promise<void> {
    for (const id of this.section_ids) {
      this.form_sections.push(this.querySelector(`#${id.replace(/_/g, '-')}`));
    }
    this.setStyle('style1');
    await this._parsedCallback();
    this.ran_parsed_callback = true;
  }

  protected async _parsedCallback(): Promise<void> {}

  protected override fullyParsedCallback(): void {
    if (this.ran_parsed_callback) {
      this.classList.remove('hidden');
    } else {
      console.error('Do not override parsedCallback in CufFormSection');
    }
  }

  setStyle(style: string) {
    this.setAttribute('ux', style);
    for (const section of this.form_sections) {
      section.setStyle(style);
    }
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
    this.postValidate(this.valid);
    return this.valid;
  }

  protected postValidate(valid: boolean): void {}

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

  setTestData(): void {
    for (const section of this.form_sections) {
      section.setTestData();
    }
  }

  abstract getData(): T;
  abstract setData(data: T): void;
}
