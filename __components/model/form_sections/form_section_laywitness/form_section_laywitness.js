// @ts-nocheck
import {CufFormSection} from '../form_section/form_section.js';
import '../../input_text/input_text.js';
import '../../checkbox/checkbox.js';

export class CufFormSectionLaywitness extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_laywitness/form_section_laywitness.html');
    const form_section = await this.setFormSectionAttributes(res, 'Details');
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