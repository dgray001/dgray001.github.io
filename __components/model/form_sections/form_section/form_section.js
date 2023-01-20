export class CufFormSection extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/model/form_sections/form_section/form_section.html');
    shadow.innerHTML = await res.text();
  }

  async setFormSectionAttributes(res, form_section_name) {
    const wrapper = this.shadowRoot.querySelector('.section-wrapper');
    wrapper.innerHTML = await res.text();
    const form_section_label = this.shadowRoot.querySelector('.form-section-label');
    form_section_label.innerText = form_section_name;
  }

  /**
   * Returns map of form data for the form section
   * @return {{}}
   */
  getFormData() {
    console.log(`CufFormSection::getFormData not implemented for ${this.constructor.name}.`);
    return {};
  }
}

customElements.define("cuf-form-section", CufFormSection);
