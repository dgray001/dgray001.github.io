import {CufFormSection} from '../form_section/form_section.js';
import '../../input_text/input_text.js';
import '../../text_area/text_area.js';

class CufFormSectionPaper extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_paper/form_section_paper.html');
    const form_section = await this.setFormSectionAttributes(res, 'Details');
    form_section.form_fields.push(this.shadowRoot.getElementById('paper-title'));
    form_section.form_fields.push(this.shadowRoot.getElementById('paper-description'));
  }

  /**
   * Called whenever attributes on parent form are changed.
   * Used here to update textarea min height
   */
  async mutationCallback(mutation) {
    this.shadowRoot.getElementById('paper-description').setMinHeight();
  }

  /**
   * Returns map of paper data for the paper form section
   * @return {{title:string, description:string}}
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
    this.shadowRoot.getElementById('paper-title').focus();
  }
}

customElements.define("cuf-form-section-paper", CufFormSectionPaper);