// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {CufFormField} = await import(`../../form_field/form_field.js?v=${version}`);

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
    const res = await fetch(`/__components/model/form_sections/form_section/form_section.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href',
      `/__components/model/form_sections/form_section/form_section.css?v=${version}`);
    shadow.appendChild(stylesheet);
    // Add mutation observer for attributes on parent
    const mutation_config = {attributes: true, childList: false, subtree: false};
    const mutation_callback = (mutationList) => {
      for (const mutation of mutationList) {
        this.mutationCallback(mutation);
      }
    };
    const observer = new MutationObserver(mutation_callback);
    observer.observe(this.parentElement, mutation_config);
  }

  /**
   * Called whenever attributes on parent form are changed.
   * Used to update form fields when for display: none is changed.
   */
  async mutationCallback(mutation) {
  }

  /**
   * Assigns form section wrapper and label
   * @param {Response} res
   * @param {string} form_section_name
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
   * Sets form data from a properly-constructed json input
   * @param {any} input
   */
  setFormData(input) {
    console.log(`CufFormSection::setFormData not implemented for ${this.constructor.name}.`);
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
   * Clears all form field data
   */
  clearFormData() {
    console.log(`CufFormSection::clearFormData not implemented for ${this.constructor.name}.`);
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

  /**
   * Focuses the first form field in the form section
   */
  focusFirst() {
    console.log(`CufFormSection::focusFirst not implemented for ${this.constructor.name}.`);
  }
}

customElements.define("cuf-form-section", CufFormSection);
