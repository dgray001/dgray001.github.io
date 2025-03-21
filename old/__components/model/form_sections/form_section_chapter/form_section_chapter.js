// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
await import(`../form_section_address/form_section_address.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);

export class CufFormSectionChapter extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_chapter/form_section_chapter.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Details');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_chapter/form_section_chapter.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('chapter-name'));
    form_section.form_fields.push(this.shadowRoot.getElementById('chapter-address'));
    form_section.form_fields.push(this.shadowRoot.getElementById('website-link'));
    form_section.form_fields.push(this.shadowRoot.getElementById('facebook-link'));
    form_section.form_fields.push(this.shadowRoot.getElementById('email-address'));
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
   * @typedef {Object} ChapterFormData
   * @property {string} name
   * @property {AddressFormData} address
   * @property {string=} website_link
   * @property {string=} facebook_link
   * @property {string=} email_address
   */

  /**
   * @typedef {Object} DisplayableChapterData
   * @property {string} name
   * @property {Object} address
   * @property {string=} website_link
   * @property {string=} facebook_link
   * @property {string=} email_address
   */

  /**
   * Returns map of chapter data for the chapter form section
   * @return {ChapterFormData}
   */
  getFormData() {
    const name = this.shadowRoot.getElementById('chapter-name').getFormData();
    const address = this.shadowRoot.getElementById('chapter-address').getFormData();
    const website_link = this.shadowRoot.getElementById('website-link').getFormData();
    const facebook_link = this.shadowRoot.getElementById('facebook-link').getFormData();
    const email_address = this.shadowRoot.getElementById('email-address').getFormData();
    return {'name': name, 'address': address, 'website_link': website_link,
      'facebook_link': facebook_link, 'email_address': email_address};
  }

  /**
   * Returns map of chapter data for the chapter form section
   * @return {DisplayableChapterData}
   */
  getDisplayableData() {
    const name = this.shadowRoot.getElementById('chapter-name').getFormData();
    const address = this.shadowRoot.getElementById('chapter-address').getDisplayableData();
    const website_link = this.shadowRoot.getElementById('website-link').getFormData();
    const facebook_link = this.shadowRoot.getElementById('facebook-link').getFormData();
    const email_address = this.shadowRoot.getElementById('email-address').getFormData();
    return {'name': name, 'address': address, 'website_link': website_link,
      'facebook_link': facebook_link, 'email_address': email_address};
  }

  /**
   * Sets form data for the chapter form section
   * @param {ChapterFormData} data
   */
  setFormData(data) {
    this.shadowRoot.getElementById('chapter-name').form_field.value = data.name;
    this.shadowRoot.getElementById('chapter-address').setFormData(data.address);
    this.shadowRoot.getElementById('website-link').form_field.value = data.website_link;
    this.shadowRoot.getElementById('facebook-link').form_field.value = data.facebook_link;
    this.shadowRoot.getElementById('email-address').form_field.value = data.email_address;
  }

  /**
   * @typedef {Object} SaveableData
   * @property {string} title
   * @property {string=} titlelink
   * @property {string=} description
   */

  /**
   * Returns SaveableData representing html content of a CUF chapter
   * @return {SaveableData}
   */
  getSaveableData() {
    const data = this.getDisplayableData();
    let description_html = '';
    description_html += `${data.name}`;
    if (data.address["1"]) {
      description_html += `<br>${data.address["1"]}`;
    }
    if (data.address["2"]) {
      description_html += `<br>${data.address["2"]}`;
    }
    if (data.address["3"]) {
      description_html += `<br>${data.address["3"]}`;
    }
    if (data.website_link) {
      description_html += `<br>${data.website_link}`;
    }
    if (data.website_link) {
      description_html += `<br>${data.website_link}`;
    }
    if (data.facebook_link) {
      description_html += `<a href="${data.facebook_link}">Connect with them no Facebook</a>`;
    }
    if (data.email_address) {
      description_html += `<a href="mailto:${data.email_address}">Email Address</a>`;
    }
    return {title: "", titlelink: "", description: description_html};
  }

  /**
   * Focuses the first form field in the form section
   */
  focusFirst() {
    this.shadowRoot.getElementById('chapter-name').form_field.focus();
  }
}

customElements.define("cuf-form-section-chapter", CufFormSectionChapter);
