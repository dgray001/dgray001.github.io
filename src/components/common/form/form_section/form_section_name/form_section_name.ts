import {CufFormSection} from '../form_section';
import {CufInputText} from '../../form_field/input_text/input_text';
import {CufSelect} from '../../form_field/select/select';

import html from './form_section_name.html';

import './form_section_name.scss';
import '../../form_field/input_text/input_text';
import '../../form_field/select/select';

/** Data describing a person's name */
export declare interface NameData {
  prefix: string;
  first: string;
  last: string;
  suffix: string;
}

export class CufFormSectionName extends CufFormSection<NameData, string> {
  private name_prefix: CufSelect;
  private name_first: CufInputText;
  private name_last: CufInputText;
  private name_suffix: CufInputText;

  constructor() {
    super();
    this.configureFormSection(html, 'Name', [
      'name_prefix',
      'name_first',
      'name_last',
      'name_suffix',
    ]);
  }

  getData(): NameData {
    return {
      prefix: this.name_prefix.getData(),
      first: this.name_first.getData(),
      last: this.name_last.getData(),
      suffix: this.name_suffix.getData(),
    };
  }

  getOutputData(): string {
    const data = this.getData();
    const parts = [data.prefix, data.first, data.last, data.suffix];
    return parts.filter(p => !!p).join(' ');
  }

  setData(data: NameData): void {
    this.name_prefix.setData(data.prefix);
    this.name_first.setData(data.first);
    this.name_last.setData(data.last);
    this.name_suffix.setData(data.suffix);
  }
}

customElements.define('cuf-form-section-name', CufFormSectionName);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-name': CufFormSectionName;
  }
}
