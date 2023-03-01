// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);
await import(`../../select/select.js?v=${version}`);

export class CufFormSectionName extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_name/form_section_name.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Name');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_name/form_section_name.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('name-prefix'));
    form_section.form_fields.push(this.shadowRoot.getElementById('name-first'));
    form_section.form_fields.push(this.shadowRoot.getElementById('name-last'));
    form_section.form_fields.push(this.shadowRoot.getElementById('name-suffix'));
  }

  /**
   * @typedef {Object} NameFormData
   * @property {string} prefix
   * @property {string} first
   * @property {string} last
   * @property {string} suffix
   */

  /**
   * Returns map of name data for the name form section
   * @return {NameFormData}
   */
  getFormData() {
    const prefix = this.shadowRoot.getElementById('name-prefix').getFormData();
    const first = this.shadowRoot.getElementById('name-first').getFormData();
    const last = this.shadowRoot.getElementById('name-last').getFormData();
    const suffix = this.shadowRoot.getElementById('name-suffix').getFormData();
    return {'prefix': prefix, 'first': first, 'last': last, 'suffix': suffix};
  }

  /**
   * Sets form data for the name form section
   * @param {NameFormData} data
   */
  setFormData(data) {
    this.shadowRoot.getElementById('name-prefix').form_field.value = data.prefix;
    this.shadowRoot.getElementById('name-first').form_field.value = data.first;
    this.shadowRoot.getElementById('name-last').form_field.value = data.last;
    this.shadowRoot.getElementById('name-suffix').form_field.value = data.suffix;
  }

  /**
   * Returns displayable map of form data for the form section
   * @return {string}
   */
  getDisplayableData() {
    const prefix = this.shadowRoot.getElementById('name-prefix').getFormData();
    const first = this.shadowRoot.getElementById('name-first').getFormData();
    const last = this.shadowRoot.getElementById('name-last').getFormData();
    const suffix = this.shadowRoot.getElementById('name-suffix').getFormData();
    let return_string = '';
    if (prefix) {
      return_string += prefix + ' ';
    }
    return_string += first + ' ' + last;
    if (suffix) {
      return_string += ' ' + suffix;
    }
    return return_string;
  }
}

customElements.define("cuf-form-section-name", CufFormSectionName);
