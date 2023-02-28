// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Date.now()}`);

export class CufFooterContact extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/footer_contact/footer_contact.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/footer_contact/footer_contact.css?v=${version}`);
    shadow.appendChild(stylesheet);
    try {
      const center_text = this.hasAttribute('align_center');
      if (center_text) {
        this.shadowRoot.querySelector('#recaptcha-notice').setAttribute('style',
          'margin-left: 5vw; text-align: center;');
        this.shadowRoot.querySelector('#copyright').setAttribute('style',
          'margin-left: 5vw; text-align: center;');
        this.shadowRoot.querySelector('.element-group.left').setAttribute(
          'style', 'flex: 1 1 0; text-align: right;');
        this.shadowRoot.querySelector('.element-group.right').setAttribute(
          'style', 'flex: 1 1 0;');
        this.shadowRoot.querySelector('#address-and-contact').setAttribute(
          'style', 'flex: 1 1 0;');
        this.shadowRoot.querySelector('.element-container').setAttribute(
          'style', 'padding-left: 0px;');
      }
    } catch(e) {
      console.log(e);
    }
  }
}

customElements.define("cuf-footer-contact", CufFooterContact);