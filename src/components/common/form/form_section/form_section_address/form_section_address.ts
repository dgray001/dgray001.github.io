import {CufFormSection} from '../form_section';
import {CufInputText} from '../../form_field/input_text/input_text';

import html from './form_section_address.html';

import './form_section_address.scss';
import '../../form_field/input_text/input_text';

interface AddressData {
  //
}

export class CufFormSectionAddress extends CufFormSection<AddressData> {
  private address_first: CufInputText;
  private address_second: CufInputText;
  private address_city: CufInputText;
  private address_state: CufInputText;
  private address_zip: CufInputText;
  private address_country: CufInputText;

  constructor() {
    super();
    this.configureFormSection(html, 'Address', [
      'address_first',
      'address_second',
      'address_city',
      'address_state',
      'address_zip',
      'address_country',
    ]);
  }

  getData(): AddressData {
    return {};
  }

  setData(data: AddressData): void {
    //
  }
}

customElements.define('cuf-form-section-address', CufFormSectionAddress);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-address': CufFormSectionAddress;
  }
}
