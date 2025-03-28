// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
const {CufTextArea} = await import(`../../text_area/text_area.js?v=${version}`);
await import(`../../input_text/input_text.js?v=${version}`);

export class CufFormSectionNews extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(
      `/__components/model/form_sections/form_section_news/form_section_news.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Details');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section_news/form_section_news.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('news-title'));
    form_section.form_fields.push(this.shadowRoot.getElementById('news-titlelink'));
    form_section.form_fields.push(this.shadowRoot.getElementById('news-description'));
  }

  /**
   * Called whenever attributes on parent form are changed.
   * Used here to update textarea min height
   */
  async mutationCallback(mutation) {
    /** @type {CufTextArea} */
    const description = this.shadowRoot.getElementById('news-description');
    if (description) {
      description.setMinHeight();
    }
  }

  /**
   * @typedef {Object} NewsFormData
   * @property {string} title
   * @property {string=} titlelink
   * @property {string} description
   */

  /**
   * Returns map of paper data for the paper form section
   * @return {NewsFormData}
   */
  getFormData() {
    const title = this.shadowRoot.getElementById('news-title').getFormData();
    const titlelink = this.shadowRoot.getElementById('news-titlelink').getFormData();
    const description = this.shadowRoot.getElementById('news-description').getFormData();
    return {'title': title, 'titlelink': titlelink, 'description': description};
  }

  /**
   * Sets form data from a properly-constructed json input
   * @param {NewsFormData} input
   */
  setFormData(input) {
    this.shadowRoot.getElementById('news-title').form_field.value = input.title;
    this.shadowRoot.getElementById('news-titlelink').form_field.value = input.titlelink;
    this.shadowRoot.getElementById('news-description').form_field.value = input.description;
  }

  /**
   * Clears all form field data
   */
  clearFormData() {
    this.shadowRoot.getElementById('news-title').clearFormData();
    this.shadowRoot.getElementById('news-titlelink').clearFormData();
    this.shadowRoot.getElementById('news-description').clearFormData();
  }

  /**
   * Focuses the first form field in the form section
   */
  focusFirst() {
    this.shadowRoot.getElementById('news-title').form_field.focus();
  }
}

customElements.define("cuf-form-section-news", CufFormSectionNews);
