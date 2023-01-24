
import {CufFormField} from '../../form_field/form_field.js';

export class CufFormSection extends HTMLElement {
  /**
   * Array of references to form field elements
   * @type {Array<CufFormField>}
   */
  form_fields = [];
  /** @type {boolean} */
  valid;

  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/model/form_sections/form_section/form_section.html');
    shadow.innerHTML = await res.text();
  }

  /**
   * Assigns form section wrapper and label
   * @return {Promise<CufFormSection>}
   */
  async setFormSectionAttributes(res, form_section_name) {
    const wrapper = this.shadowRoot.querySelector('.section-wrapper');
    wrapper.innerHTML = await res.text();
    const form_section_label = this.shadowRoot.querySelector('.form-section-label');
    form_section_label.innerText = form_section_name;
    return this;
  }

  /**
   * Returns map of form data for the form section
   * @return {{}}
   */
  getFormData() {
    console.log(`CufFormSection::getFormData not implemented for ${this.constructor.name}.`);
    return {};
  }

  /**
   * Returns map of form data for the form section
   * @return {string | {}}
   */
  getDisplayableData() {
    console.log(`CufFormSection::getDisplayableData not implemented for ${this.constructor.name}.`);
    return {};
  }

  /**
   * Validates the form section by validating each form field.
   * @return {boolean} whether form field is valid.
   */
  validate() {
    this.valid = true;
    for (const form_field of this.form_fields) {
      const form_field_valid = form_field.validate();
      if (!form_field_valid) {
        this.valid = false;
      }
    }
    return this.valid;
  }
}

customElements.define("cuf-form-section", CufFormSection);
