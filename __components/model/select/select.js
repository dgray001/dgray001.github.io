import {CufFormField} from '../form_field/form_field.js';

export class CufSelect extends CufFormField {
  options = [];

  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/select/select.html');
    const form_field = await this.setFormFieldAttributes(res);
    const options_text = this.attributes.options?.value || '[]';
    this.options = this.specificMapping(options_text);
    for (const option_text of this.options) {
      const option = document.createElement("option");
      option.setAttribute('value', option_text);
      option.innerText = option_text;
      form_field.appendChild(option);
    }
  }

  // updates this.options in case it is a keyword
  specificMapping(options_text) {
    try {
      const json_data = JSON.parse(options_text);
      if (Array.isArray(json_data)) {
        return json_data;
      }
    } catch (e) {}
    switch(options_text) {
      case 'prefixes':
        return ["", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Rev."];
      default:
        console.error(`CufSelect options keyword ${options_text} not found.`);
        return [];
    }
  }
}

customElements.define("cuf-select", CufSelect);
