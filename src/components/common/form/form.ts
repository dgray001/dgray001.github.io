import { CufElement } from '../../cuf_element';
import { CufFormField, FormFieldChangeEventData } from './form_field/form_field';
import { CufFormSection } from './form_section/form_section';
import { until } from '../../../scripts/util';

import html from './form.html';

import './form.scss';

type FormSection = CufFormSection<any, any> | CufFormField<any, any>;

export abstract class CufForm<T> extends CufElement {
  private form_sections = new Map<string, FormSection>();
  private valid = false;
  private ran_parsed_callback = false;
  private section_ids = new Set<string>();

  constructor() {
    super();
    this.htmlString = html;
  }

  protected configureForm(section_ids: string[]) {
    this.section_ids = new Set<string>(section_ids);
    for (const id of this.section_ids.values()) {
      this.configureElement(id);
    }
  }

  protected override async parsedCallback(): Promise<void> {
    this.classList.add('hidden');
    this.classList.add('cuf-form');
    for (const id of this.section_ids) {
      const form_section = this.querySelector<FormSection>(`#${id.replace(/_/g, '-')}`);
      form_section.setForm(this);
      this.form_sections.set(id, form_section);
    }
    this.setStyle('style1');
    await this._parsedCallback();
    this.addEventListener('form-field-changed', (e: CustomEvent) => {
      this.formFieldChangedEvent(e.detail)
      e.stopPropagation();
    });
    this.ran_parsed_callback = true;
  }

  protected async _parsedCallback(): Promise<void> {}

  protected formFieldChangedEvent(data: FormFieldChangeEventData) {}

  protected override fullyParsedCallback(): void {
    if (this.ran_parsed_callback) {
      this.classList.remove('hidden');
    } else {
      console.error('Do not override parsedCallback in CufFormSection');
    }
  }

  getField(field_key: string): FormSection | undefined {
    return this.form_sections.get(field_key);
  }

  setStyle(style: string) {
    this.setAttribute('ux', style);
    for (const section of this.form_sections.values()) {
      section.setStyle(style);
    }
  }

  validate(): boolean {
    this.valid = true;
    for (const section of this.form_sections.values()) {
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

  protected messageStatus(el: HTMLDivElement, message: string): void {
    if (message) {
      el.innerHTML = message;
      el.classList.remove('hide');
    } else {
      el.classList.add('hide');
    }
    el.classList.remove('error');
    el.classList.remove('success');
  }

  protected successStatus(el: HTMLDivElement, message: string): void {
    this.messageStatus(el, message);
    el.classList.add('success');
  }

  protected errorStatus(el: HTMLDivElement, message: string): void {
    this.messageStatus(el, message);
    el.classList.add('error');
  }

  enable(): void {
    this.classList.add('disabled');
    for (const section of this.form_sections.values()) {
      section.enable();
    }
  }

  disable(): void {
    this.classList.remove('disabled');
    for (const section of this.form_sections.values()) {
      section.disable();
    }
  }

  clearData(): void {
    for (const section of this.form_sections.values()) {
      section.clearData();
    }
  }

  setTestData(): void {
    for (const section of this.form_sections.values()) {
      section.setTestData();
    }
  }

  setData(data: T) {
    until(() => this.fully_parsed).then(() => {
      this._setData(data);
    });
  }

  abstract getData(): T;
  protected abstract _setData(data: T): void;
}
