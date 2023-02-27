import {CufFormSection} from '../form_section/form_section.js';
import '../../input_text/input_text.js';
import {CufTextArea} from '../../text_area/text_area.js';

export class CufFormSectionJob extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_job/form_section_job.html');
    const form_section = await this.setFormSectionAttributes(res, 'Details');
    form_section.form_fields.push(this.shadowRoot.getElementById('job-title'));
    form_section.form_fields.push(this.shadowRoot.getElementById('job-description'));
  }

  /**
   * Called whenever attributes on parent form are changed.
   * Used here to update textarea min height
   */
  async mutationCallback(mutation) {
    /** @type {CufTextArea} */
    const description = this.shadowRoot.getElementById('job-description');
    if (description) {
      description.setMinHeight();
    }
  }

  /**
   * @typedef {Object} JobsFormData
   * @property {string} title
   * @property {string} description
   */

  /**
   * Returns map of paper data for the paper form section
   * @return {JobsFormData}
   */
  getFormData() {
    const title = this.shadowRoot.getElementById('job-title').getFormData();
    const description = this.shadowRoot.getElementById('job-description').getFormData();
    return {'title': title, 'description': description};
  }

  /**
   * Sets form data from a properly-constructed json input
   * @param {JobsFormData} input
   */
  setFormData(input) {
    this.shadowRoot.getElementById('job-title').form_field.value = input.title;
    this.shadowRoot.getElementById('job-description').form_field.value = input.description;
  }

  /**
   * Clears all form field data
   */
  clearFormData() {
    this.shadowRoot.getElementById('job-title').clearFormData();
    this.shadowRoot.getElementById('job-description').clearFormData();
  }

  /**
   * Focuses the first form field in the form section
   */
  focusFirst() {
    this.shadowRoot.getElementById('job-title').form_field.focus();
  }
}

customElements.define("cuf-form-section-job", CufFormSectionJob);