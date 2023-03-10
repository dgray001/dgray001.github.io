// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormField} = await import(`../form_field/form_field.js?v=${version}`);
const {specificMapping, defaultMapping} = await import(`/scripts/datalists.js?v=${version}`);

export class CufInputText extends CufFormField {
  /** @type {boolean} */
  use_data_value = false;

  /** @type {Array<HTMLOptionElement>} */
  datalist_options = [];

  /** @type {Array<string>} possible values */
  datalist_values = [];

  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
  }

  // This should be called when children (and inner text) available
  async childrenAvailableCallback() {
    const shadow = await super.childrenAvailableCallback();
    const res = await fetch(`/__components/model/input_text/input_text.html?v=${version}`);
    const form_field = await this.setFormFieldAttributes(res);
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/model/input_text/input_text.css?v=${version}`);
    shadow.appendChild(stylesheet);
    const autocomplete = this.attributes.autocomplete?.value || '';
    if (autocomplete) {
      form_field.setAttribute('autocomplete', autocomplete);
      this.removeAttribute('autocomplete');
    }
    const datatype = this.attributes.datatype?.value || '';
    if (datatype) {
      this.removeAttribute('datatype');
      form_field.setAttribute('type', datatype);
      if (datatype === 'password') {
        const eyeball = document.createElement('img');
        eyeball.src = '/__images/eye.png';
        eyeball.classList.add('password-reveal');
        eyeball.addEventListener('click', () => {
          if (form_field.getAttribute('type') === 'password') {
            form_field.setAttribute('type', 'text');
          }
          else {
            form_field.setAttribute('type', 'password');
          }
        });
        this.form_field_wrapper.appendChild(eyeball);
      }
    }
    const datalist = this.attributes.datalist?.value || '';
    if (datalist) {
      this.removeAttribute('datalist');
      const datalist_element = document.createElement('datalist');
      datalist_element.setAttribute('id', this.id + '_datalist');
      const mapping = await specificMapping(datalist);
      if (!Array.isArray(mapping)) {
        this.use_data_value = true;
      }
      const default_mapping = defaultMapping(datalist);
      for (const item of mapping) {
        const entry = {value: '', text: ''};
        if (Array.isArray(item)) {
          entry.value = item[0];
          entry.text = item[1];
        }
        else {
          entry.value = item;
          entry.text = item;
        }
        const item_element = document.createElement('option');
        item_element.setAttribute('data_value', entry.value);
        item_element.innerText = entry.text;
        datalist_element.appendChild(item_element);
        this.datalist_options.push(item_element);
        this.datalist_values.push(entry.value);
      }
      form_field.setAttribute('list', this.id + '_datalist');
      form_field.value = default_mapping;
      this.form_field_wrapper.appendChild(datalist_element);
      this.datalist = datalist;
    }
  }

  /**
   * Returns form data as a string
   * @return {string}
   */
  getFormData() {
    if (this.use_data_value) {
      for (const option of this.datalist_options) {
        if (this.form_field.value === option.innerText) {
          return option.attributes.data_value.value;
        }
      }
    }
    return this.form_field.value;
  }

  /**
   * Clears form data
   */
  clearFormData() {
    this.form_field.value = '';
  }

  /**
   * Disables form field
   */
  disable() {
    this.form_field.setAttribute('readonly', 'true');
  }
}

customElements.define("cuf-input-text", CufInputText);
