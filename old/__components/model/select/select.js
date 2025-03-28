// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormField} = await import(`../form_field/form_field.js?v=${version}`);
const {specificMapping, defaultMapping} = await import(`/scripts/datalists.js?v=${version}`);

export class CufSelect extends CufFormField {
  /** @type {Map<string, string>} */
  options = new Map();

  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
  }

  // This should be called when children (and inner text) available
  async childrenAvailableCallback() {
    await super.childrenAvailableCallback();
    const res = await fetch(`/__components/model/select/select.html?v=${version}`);
    await this.setFormFieldAttributes(res);
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/model/select/select.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    const options_text = this.attributes.options?.value || '[]';
    const mapping = await specificMapping(options_text);
    const default_mapping = defaultMapping(options_text);
    const option_container = this.shadowRoot.querySelector('select');
    for (const option_text of mapping) {
      const entry = {value: '', text: ''};
      if (Array.isArray(option_text)) {
        entry.value = option_text[0];
        entry.text = option_text[1];
      }
      else {
        entry.value = option_text;
        entry.text = option_text;
      }
      const option = document.createElement("option");
      option.setAttribute('value', entry.value);
      if (default_mapping === entry.text) {
        option.setAttribute('selected', 'true');
      }
      option.innerText = entry.text;
      option_container.appendChild(option);
      this.options.set(entry.value, entry.text);
    }
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    return this.form_field.value;
  }

  /**
   * Clears form data
   */
  clearFormData() {
    this.form_field.value = '';
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getDisplayableData() {
    return this.form_field.options[this.form_field.selectedIndex]?.innerText ?? '';
  }
}

customElements.define("cuf-select", CufSelect);
