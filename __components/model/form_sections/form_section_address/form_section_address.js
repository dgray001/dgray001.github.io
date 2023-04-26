// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);
await import(`../../select/select.js?v=${version}`);

export class CufFormSectionAddress extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_address/form_section_address.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Address');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_address/form_section_address.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('address-first'));
    form_section.form_fields.push(this.shadowRoot.getElementById('address-second'));
    form_section.form_fields.push(this.shadowRoot.getElementById('address-city'));
    form_section.form_fields.push(this.shadowRoot.getElementById('address-state'));
    form_section.form_fields.push(this.shadowRoot.getElementById('address-zip'));
    form_section.form_fields.push(this.shadowRoot.getElementById('address-country'));
  }

  /**
   * @typedef {Object} AddressFormData
   * @property {string} address1
   * @property {string} address2
   * @property {string} city
   * @property {string} state
   * @property {string} zip
   * @property {string} country
   */

  /**
   * Returns map of address data for the address form section
   * @return {AddressFormData}
   */
  getFormData() {
    const address1 = this.shadowRoot.getElementById('address-first').getFormData();
    const address2 = this.shadowRoot.getElementById('address-second').getFormData();
    const city = this.shadowRoot.getElementById('address-city').getFormData();
    const state = this.shadowRoot.getElementById('address-state').getFormData();
    const zip = this.shadowRoot.getElementById('address-zip').getFormData();
    const country = this.shadowRoot.getElementById('address-country').getFormData();
    return {'address1': address1, 'address2': address2, 'city': city, 'state': state, 'zip': zip, 'country': country};
  }

  /**
   * Sets form data for the address form section
   * @param {AddressFormData} data
   */
  setFormData(data) {
    this.shadowRoot.getElementById('address-first').form_field.value = data.address1;
    this.shadowRoot.getElementById('address-second').form_field.value = data.address2;
    this.shadowRoot.getElementById('address-city').form_field.value = data.city;
    this.shadowRoot.getElementById('address-state').form_field.value = data.state;
    this.shadowRoot.getElementById('address-zip').form_field.value = data.zip;
    this.shadowRoot.getElementById('address-country').form_field.value = data.country;
  }

  /**
   * Returns map of form data for the form section
   * @return {string}
   */
  getDisplayableData() {
    const address1 = this.shadowRoot.getElementById('address-first').getFormData();
    const address2 = this.shadowRoot.getElementById('address-second').getFormData();
    const city = this.shadowRoot.getElementById('address-city').getFormData();
    const state = this.shadowRoot.getElementById('address-state').getFormData();
    const zip = this.shadowRoot.getElementById('address-zip').getFormData();
    const country = this.shadowRoot.getElementById('address-country').getFormData();
    const return_data = {'1': address1, '2': `${city}, ${state} ${zip}`, '3': country};
    if (address2) {
      return_data['1'] += ' ' + address2;
    }
    return return_data;
  }
}

customElements.define("cuf-form-section-address", CufFormSectionAddress);
