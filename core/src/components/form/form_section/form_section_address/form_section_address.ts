import { DwgFormSection } from '../form_section';
import { DwgInputText } from '../../form_field/input_text/input_text';

import html from './form_section_address.html';

import './form_section_address.scss';
import '../../form_field/input_text/input_text';

/** Data describing a person's address */
export declare interface AddressData {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/** Data describing a person's address */
export declare interface AddressOutputData {
  line1: string;
  line2: string;
  line3: string;
}

export class DwgFormSectionAddress extends DwgFormSection<AddressData, AddressOutputData> {
  private address_first: DwgInputText;
  private address_second: DwgInputText;
  private address_city: DwgInputText;
  private address_state: DwgInputText;
  private address_zip: DwgInputText;
  private address_country: DwgInputText;

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

  getOutputData(): AddressOutputData {
    const data: AddressOutputData = {
      line1: this.address_first.getStringData(),
      line2: `${this.address_city.getStringData()}, ${this.address_state.getStringData()} ${this.address_zip.getStringData()}`,
      line3: this.address_country.getStringData(),
    };
    const address2 = this.address_second.getStringData();
    if (address2) {
      data.line1 += ` ${address2}`;
    }
    return data;
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

customElements.define('dwg-form-section-address', DwgFormSectionAddress);

declare global {
  interface HTMLElementTagNameMap {
    'dwg-form-section-address': DwgFormSectionAddress;
  }
}
