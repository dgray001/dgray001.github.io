// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {until} = await import(`/scripts/util.js?v=${version}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
const {CufTextArea} = await import(`../../text_area/text_area.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);

export class CufFormSectionPaper extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_paper/form_section_paper.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Details');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_paper/form_section_paper.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('paper-title'));
    form_section.form_fields.push(this.shadowRoot.getElementById('paper-description'));
  }

  /**
   * Called whenever attributes on parent form are changed.
   * Used here to update textarea min height
   */
  async mutationCallback(mutation) {
    /** @type {CufTextArea} */
    const description = this.shadowRoot.getElementById('paper-description');
    if (description) {
      description.setMinHeight();
    }
  }

  /**
   * @typedef {Object} PaperFormData
   * @property {string} title
   * @property {string=} description
   */

  /**
   * Sets papers data
   * @param {PaperFormData} data
   */
  setFormData(data) {
    this.form_fields[0].form_field.value = data.title;
    this.form_fields[1].form_field.value = data.description ?? '';
  }

  /**
   * Returns map of paper data for the paper form section
   * @return {PaperFormData}
   */
  getFormData() {
    const title = this.shadowRoot.getElementById('paper-title').getFormData();
    const description = this.shadowRoot.getElementById('paper-description').getFormData();
    return {'title': title, 'description': description};
  }

  /**
   * Clears all form field data
   */
  clearFormData() {
    this.shadowRoot.getElementById('paper-title').clearFormData();
    this.shadowRoot.getElementById('paper-description').clearFormData();
  }

  /**
   * Focuses the first form field in the form section
   */
  focusFirst() {
    this.form_fields[0].form_field.focus();
  }
}

customElements.define("cuf-form-section-paper", CufFormSectionPaper);
