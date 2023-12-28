import {until} from '../../../../scripts/util';
import {CufElement} from '../../../cuf_element';
import {CufForm} from '../form';
import {CufFormField} from '../form_field/form_field';

import html from './form_section.html';

import './form_section.scss';

export abstract class CufFormSection<T, R> extends CufElement {
  private form_section_label: HTMLDivElement;
  private form_section_wrapper: HTMLDivElement;

  private ran_parsed_callback = false;
  private internal_html = '';
  private section_title = '';
  private field_ids: string[] = [];
  private form_fields: CufFormField<any, any>[] = [];
  private valid = false;
  private form: CufForm<any> | undefined;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('form_section_label');
    this.configureElement('form_section_wrapper');
    this.classList.add('hidden');
    this.classList.add('cuf-form-section');
  }

  protected configureFormSection(html: string, section_title: string, field_ids: string[]) {
    this.internal_html = html;
    this.section_title = section_title;
    this.field_ids = field_ids;
  }

  protected override async parsedCallback(): Promise<void> {
    this.form_section_label.innerText = this.section_title;
    this.form_section_wrapper.innerHTML = this.internal_html;
    for (const id of this.field_ids) {
      this.configureElement(id);
    }
    await until(this.elementsParsed.bind(this));
    for (const id of this.field_ids) {
      this.form_fields.push(this.querySelector(`#${id.replace(/_/g, '-')}`));
    }
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

  setForm(form: CufForm<any>) {
    this.form = form;
    for (const field of this.form_fields) {
      field.setForm(form);
    }
  }

  setStyle(style: string) {
    this.setAttribute('ux', style);
    for (const field of this.form_fields) {
      field.setStyle(style);
    }
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

  setTestData(): void {
    for (const field of this.form_fields) {
      field.setTestData();
    }
  }

  getStringData(): string {
    return JSON.stringify(this.getData());
  }

  abstract getData(): T;
  abstract getOutputData(): R;
  abstract setData(data: T): void;
}
