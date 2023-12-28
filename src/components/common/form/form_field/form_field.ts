import {Validator, ValidatorConfig} from '../../../../scripts/validation';
import {CufElement} from '../../../cuf_element';
import {CufForm} from '../form';

import html from './form_field.html';

import './form_field.scss';

export abstract class CufFormField<T extends HTMLElement, R> extends CufElement {
  private label_el: HTMLLabelElement;
  protected form_field: T;
  private helper_text: HTMLDivElement;

  private default_helper_text = '';
  private validators: Validator[] = [];
  private ran_parsed_callback = false;
  private valid = false;
  private validation_error: string = undefined;
  private form: CufForm<any> | undefined;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('label_el', 'label');
    this.configureElement('form_field');
    this.classList.add('hidden');
    this.classList.add('cuf-form-field');
  }

  protected override async parsedCallback(): Promise<void> {
    this.default_helper_text = this.attributes.getNamedItem('helper-text')?.value ?? '';
    this.label_el.innerText = this.attributes.getNamedItem('label')?.value ?? '';
    const flex_option = parseInt(this.attributes.getNamedItem('flex-option')?.value);
    if (!!flex_option) {
      const flex_basis = flex_option * 60;
      this.style.setProperty('--flex', `${flex_option} 0 ${flex_basis}px`);
    }
    const validator_data = JSON.parse(this.attributes.getNamedItem('validators')?.value ?? '[]') as string[];
    let required = false;
    for (const validator of validator_data) {
      const validator_type = validator.split('=')[0];
      if (validator_type === 'required') {
        required = true;
        this.classList.add('required');
      }
      const validator_split = validator.split('=');
      const config: ValidatorConfig = {type: validator_split[0].trim()};
      if (validator_split.length > 1) {
        config.data = validator_split[1].trim();
      }
      if (validator_split.length > 2) {
        config.custom_error_message = validator_split[2].trim();
      }
      this.validators.push(new Validator(config));
    }
    if (required) {
      this.label_el.innerHTML += '<span class="required-asterisk">*</span>';
    }
    this.label_el.id += `-${this.id}`;
    this.label_el.setAttribute('for', `form-field-${this.id}`);
    this.helper_text = document.createElement('div');
    this.helper_text.id = `helper-text-${this.id}`;
    this.helper_text.classList.add('helper-text');
    this.appendChild(this.helper_text);
    this.updateHelperText();
    this.form_field.id = `form-field-${this.id}`;
    this.form_field.setAttribute('name', `form-field-${this.id}`);
    const autocomplete = this.attributes.getNamedItem('autocomplete')?.value;
    if (!!autocomplete) {
      this.form_field.setAttribute('autocomplete', autocomplete);
    }
    this.form_field.addEventListener('focus', () => {
      this.classList.add('focused');
    });
    this.form_field.addEventListener('blur', () => {
      this.classList.remove('focused');
      this.validate();
    });
    await this._parsedCallback();
    this.ran_parsed_callback = true;
  }

  protected async _parsedCallback(): Promise<void> {}

  protected override fullyParsedCallback(): void {
    if (this.ran_parsed_callback) {
      this.classList.remove('hidden');
    } else {
      console.error('Do not override parsedCallback in CufFormField');
    }
  }

  setForm(form: CufForm<any>) {
    this.form = form;
  }

  setStyle(style: string) {
    this.setAttribute('ux', style);
  }

  validate(): boolean {
    this.valid = true;
    for (const validator of this.validators) {
      this.validation_error = validator.validate(this.getStringData(), this, this.form);
      if (!!this.validation_error) {
        this.valid = false;
        break;
      }
    }
    this.updateHelperText();
    this.classList.toggle('valid', this.valid);
    this.classList.toggle('invalid', !this.valid);
    return this.valid;
  }

  getValidators(): string[] {
    return this.validators.map(v => v.type);
  }

  get isValid(): boolean {
    return this.valid;
  }

  setValidationError(error: string): void {
    this.validation_error = error;
    this.valid = !this.validation_error;
  }

  private updateHelperText() {
    if (!!this.validation_error) {
      this.helper_text.classList.remove('hide');
      this.helper_text.innerHTML = this.validation_error;
    }
    else if (!!this.default_helper_text) {
      this.helper_text.classList.remove('hide');
      this.helper_text.innerHTML = this.default_helper_text;
    }
    else {
      this.helper_text.classList.add('hide');
      this.helper_text.innerHTML = '';
    }
  }

  enable(): void {
    this.classList.remove('disabled');
    this._enable();
  }

  disable(): void {
    this.classList.add('disabled');
    this._disable();
  }

  setData(data: R): void {
    this._setData(data);
    this.updateHelperText();
  }

  protected abstract _enable(): void;
  protected abstract _disable(): void;
  abstract getData(): R;
  abstract getStringData(): string;
  abstract _setData(data: R): void;
  abstract clearData(): void;
  abstract setTestData(): void;
}
