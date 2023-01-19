export class CufFormField extends HTMLElement {
  id = '';
  label = ''

  constructor() {
    super();
  }

  async connectedCallback() {
    this.id = this.attributes.id?.value || '';
    const flex_option = this.attributes.flex_option?.value || '';
    this.label = this.innerText;
    this.innerText = '';
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/model/form_field/form_field.html');
    shadow.innerHTML = await res.text();
    const wrapper = shadow.querySelector('.form-field-wrapper');
    wrapper.setAttribute('id', this.id + '-wrapper');
    this.removeAttribute('id');
    this.classList.add('form-field');
    if (flex_option) {
      this.setAttribute('style', `flex: ${flex_option} 0 0`)
    }
  }

  // given response to child html, wrap it in wrapper and set attributes
  async setFormFieldAttributes(res) {
    const wrapper = this.shadowRoot.querySelector('span');
    wrapper.innerHTML = await res.text();
    const form_field = this.shadowRoot.querySelector('.form-field');
    form_field.setAttribute('id', this.id);
    form_field.setAttribute('name', this.id);
    return form_field;
  }
}

customElements.define("cuf-form-field", CufFormField);
