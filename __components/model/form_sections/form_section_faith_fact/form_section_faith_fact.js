// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
const {CufTextArea} = await import(`../../text_area/text_area.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);

export class CufFormSectionFaithFact extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_faith_fact/form_section_faith_fact.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Details');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_faith_fact/form_section_faith_fact.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('faith-fact-title'));
    form_section.form_fields.push(this.shadowRoot.getElementById('faith-fact-question'));
    form_section.form_fields.push(this.shadowRoot.getElementById('faith-fact-summary'));
  }

  /**
   * Called whenever attributes on parent form are changed.
   * Used here to update textarea min height
   */
  async mutationCallback(mutation) {
    /** @type {CufTextArea} */
    const summary = this.shadowRoot.getElementById('faith-fact-summary');
    if (summary) {
      summary.setMinHeight();
    }
  }

  /**
   * @typedef {Object} FaithFactFormData
   * @property {string} title
   * @property {string=} question
   * @property {string} summary
   */

  /**
   * Sets faith fact data
   * @param {FaithFactFormData} data
   */
  setFormData(data) {
    this.form_fields[0].form_field.value = data.title;
    this.form_fields[1].form_field.value = data.question ?? '';
    this.form_fields[2].form_field.value = data.summary;
  }

  /**
   * Returns map of faith fact data for the faith fact form section
   * @return {FaithFactFormData}
   */
  getFormData() {
    const title = this.shadowRoot.getElementById('faith-fact-title').getFormData();
    const question = this.shadowRoot.getElementById('faith-fact-question').getFormData();
    const summary = this.shadowRoot.getElementById('faith-fact-summary').getFormData();
    return {'title': title, 'question': question, 'summary': summary};
  }

  /**
   * Clears all form field data
   */
  clearFormData() {
    for (const form_field of this.form_fields) {
      form_field.clearFormData();
    }
  }

  /**
   * Focuses the first form field in the form section
   */
  focusFirst() {
    this.form_fields[0].form_field.focus();
  }
}

customElements.define("cuf-form-section-paper", CufFormSectionPaper);
