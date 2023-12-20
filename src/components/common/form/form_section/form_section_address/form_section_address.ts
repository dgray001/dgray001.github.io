import {CufFormSection} from '../form_section';
import {CufInputText} from '../../form_field/input_text/input_text';

import html from './form_section_address.html';

import './form_section_address.scss';
import '../../form_field/input_text/input_text';

interface AddressData {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
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
    return {
      line1: this.address_first.getData(),
      line2: this.address_second.getData(),
      city: this.address_city.getData(),
      state: this.address_state.getData(),
      zip: this.address_zip.getData(),
      country: this.address_country.getData(),
    };
  }

  setData(data: AddressData): void {
    this.address_first.setData(data.line1);
    this.address_second.setData(data.line2);
    this.address_city.setData(data.city);
    this.address_state.setData(data.state);
    this.address_zip.setData(data.zip);
    this.address_country.setData(data.country);
  }
}

customElements.define('cuf-form-section-address', CufFormSectionAddress);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-address': CufFormSectionAddress;
  }
}
