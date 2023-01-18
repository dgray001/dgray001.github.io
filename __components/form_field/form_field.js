export class CufFormField extends HTMLElement {
  shadow; // Need reference to shadow for child connectedCallback functions

  constructor() {
    super();
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/form_field/form_field.html');
    this.shadow.innerHTML = await res.text();
  }
}

customElements.define("cuf-form-field", CufFormField);
