import {CufFormField} from '../form_field/form_field.js';

/**
* Define JSON
* @typedef {string} JSON
* @todo: place in separate config file
*/

export class CufSelect extends CufFormField {
  /** @type {Map<string, string>} */
  options = new Map();

  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/select/select.html');
    const form_field = await this.setFormFieldAttributes(res);
    const options_text = this.attributes.options?.value || '[]';
    const mapping = await this.specificMapping(options_text);
    const default_mapping = this.defaultMapping(options_text);
    const button_container = this.shadowRoot.querySelector('#child-container');
    for (const option_text of mapping) {
      const entry = {};
      if (Array.isArray(option_text)) {
        entry.value = option_text[0];
        entry.text = option_text[1];
      }
      else {
        entry.value = option_text;
        entry.text = option_text;
      }
      const option = document.createElement("button");
      option.classList.add('child');
      option.setAttribute('value', entry.value);
      option.setAttribute('style', 'display: none;');
      if (default_mapping === entry.text) {
        option.setAttribute('selected', 'true');
        form_field.innerText = entry.text;
      }
      option.innerText = entry.text;
      button_container.appendChild(option);
      this.options.set(entry.value, entry.text);
    }
    button_container.firstChild.classList.add('first-child');
    button_container.lastChild.classList.add('last-child');
    form_field.addEventListener('focus', () => {
      for (const child of button_container.children) {
        child.setAttribute('style', 'display: block;');
      }
    });
    form_field.addEventListener('blur', () => {
      for (const child of button_container.children) {
        child.setAttribute('style', 'display: none;');
      }
    });
  }

  /**
   * Updates this.options in case it is a keyword.
   * If it is not a keyword then return the inputted options
   * @param {JSON | string} options_text - a valid JSON or keyword
   * @return {Promise<Array<string> | Map<string, string>>} parsed options
   */
  async specificMapping(options_text) {
    try {
      const json_data = JSON.parse(options_text);
      if (Array.isArray(json_data)) {
        return json_data;
      }
    } catch (e) {}
    switch(options_text) {
      case 'countries':
        return await this.countriesList();
      case 'prefixes':
        return ["", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Rev."];
      default:
        console.error(`CufSelect options keyword ${options_text} not found.`);
        return [];
    }
  }

  /**
   * Returns mapping of countries and 2-letter codes for use in options
   * @return {Promise<Map<string, string>>} country_map<code, display name>
   */
  async countriesList() {
    const res = await fetch('./__data/countries.json');
    const country_json = await res.text();
    const country_data = JSON.parse(country_json);
    /**
    * @type {Map<string, string>}
    */
    const country_map = new Map();
    for (const country of country_data) {
      country_map.set(country['alpha3'], country['name']);
    }
    return country_map;
  }

  /**
   * Returns string value of default option or null for no default
   * @param {JSON | string} options_text - a valid JSON or keyword
   * @return {string | null} default option or null if none
   */
  defaultMapping(options_text) {
    try {
      const json_data = JSON.parse(options_text);
      if (Array.isArray(json_data)) {
        return null;
      }
    } catch (e) {}
    switch(options_text) {
      case 'countries':
        return "United States";
      case 'prefixes':
        return "";
      default:
        console.error(`CufSelect options keyword ${options_text} not found.`);
        return null;
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
   * Returns form data as a string
   * @return {string}
   */
  getDisplayableData() {
    return this.form_field.options[this.form_field.selectedIndex].text;
  }
}

customElements.define("cuf-select", CufSelect);
