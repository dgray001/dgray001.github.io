// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);

export class CufFormSectionContact extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_contact/form_section_contact.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Contact');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_contact/form_section_contact.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('contact-email'));
    form_section.form_fields.push(this.shadowRoot.getElementById('contact-phone'));
  }

  /**
   * @typedef {Object} ContactFormData
   * @property {string} email
   * @property {string} phone
   */

  /**
   * Returns map of contact data for the contact form section
   * @return {ContactFormData}
   */
  getFormData() {
    const email = this.shadowRoot.getElementById('contact-email').getFormData();
    const phone = this.shadowRoot.getElementById('contact-phone').getFormData();
    return {'email': email, 'phone': phone};
  }

  /**
   * Returns map of contact data for the contact form section
   * @param {ContactFormData} data
   */
  setFormData(data) {
    this.shadowRoot.getElementById('contact-email').form_field.value = data.email;
    this.shadowRoot.getElementById('contact-phone').form_field.value = data.phone;
  }

  /**
   * Returns map of contact data for the contact form section
   * @return {ContactFormData}
   * @todo maybe add dashes between phone number sections
   */
  getDisplayableData() {
    return this.getFormData();
  }
}

customElements.define("cuf-form-section-contact", CufFormSectionContact);
