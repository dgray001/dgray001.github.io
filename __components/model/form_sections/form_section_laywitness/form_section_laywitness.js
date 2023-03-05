// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);
await import(`../../checkbox/checkbox.js?v=${version}`);

export class CufFormSectionLaywitness extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_laywitness/form_section_laywitness.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Details');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_laywitness/form_section_laywitness.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('laywitness-volume'));
    form_section.form_fields.push(this.shadowRoot.getElementById('laywitness-issue'));
    form_section.form_fields.push(this.shadowRoot.getElementById('laywitness-title'));
    form_section.form_fields.push(this.shadowRoot.getElementById('checkbox-addendum'));
    form_section.form_fields.push(this.shadowRoot.getElementById('checkbox-insert'));
  }

  /**
   * @typedef {Object} LaywitnessFormData
   * @property {number} volume
   * @property {number} issue
   * @property {string} title
   * @property {boolean} addendum
   * @property {boolean} insert
   */

  /**
   * Sets laywitness data
   * @param {LaywitnessFormData} data
   */
  setFormData(data) {
    this.form_fields[0].form_field.value = data.volume.toString();
    this.form_fields[1].form_field.value = data.issue.toString();
    this.form_fields[2].form_field.value = data.title;
    this.form_fields[3].form_field.checked = data.addendum;
    this.form_fields[4].form_field.checked = data.insert;
  }

  /**
   * Returns map of laywitness data for the laywitness form section
   * @return {LaywitnessFormData}
   */
  getFormData() {
    const volume = this.shadowRoot.getElementById('laywitness-volume').getFormData();
    const issue = this.shadowRoot.getElementById('laywitness-issue').getFormData();
    const title = this.shadowRoot.getElementById('laywitness-title').getFormData();
    const addendum = this.shadowRoot.getElementById('checkbox-addendum').getFormData();
    const insert = this.shadowRoot.getElementById('checkbox-insert').getFormData();
    return {'volume': parseInt(volume), 'issue': parseInt(issue), 'title': title,
      'addendum': addendum === 'true', 'insert': insert === 'true'};
  }

  /**
   * Clears all form field data
   */
  clearFormData() {
    this.shadowRoot.getElementById('laywitness-volume').clearFormData();
    this.shadowRoot.getElementById('laywitness-issue').clearFormData();
    this.shadowRoot.getElementById('laywitness-title').clearFormData();
    this.shadowRoot.getElementById('checkbox-addendum').clearFormData();
    this.shadowRoot.getElementById('checkbox-insert').clearFormData();
  }

  /**
   * Focuses the first form field in the form section
   */
  focusFirst() {
    this.shadowRoot.getElementById('laywitness-volume').form_field.focus();
  }
}

customElements.define("cuf-form-section-laywitness", CufFormSectionLaywitness);
