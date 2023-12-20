import {CufFormSection} from '../form_section';
import {CufInputText} from '../../form_field/input_text/input_text';
import {CufSelect} from '../../form_field/select/select';

import html from './form_section_name.html';

import './form_section_name.scss';
import '../../form_field/input_text/input_text';
import '../../form_field/select/select';

interface NameData {
  //
}

export class CufFormSectionName extends CufFormSection<NameData> {
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
    return {};
  }

  setData(data: NameData): void {
    //
  }
}

customElements.define('cuf-form-section-name', CufFormSectionName);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-name': CufFormSectionName;
  }
}
