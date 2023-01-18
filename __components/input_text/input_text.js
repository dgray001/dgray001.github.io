import {CufFormField} from '../form_field/form_field.js';

class CufInputText extends CufFormField {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/input_text/input_text.html');
    const wrapper = this.shadow.querySelector('span');
    wrapper.innerHTML = await res.text();
  }
}

customElements.define("cuf-input-text", CufInputText);
