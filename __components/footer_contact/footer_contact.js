class CufFooterContact extends HTMLElement {
    constructor() {
        super();
    }
  
    async connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});
        const res = await fetch('./__components/footer_contact/footer_contact.html');
        shadow.innerHTML = await res.text();
        try {
          const center_text = this.hasAttribute('align_center');
          if (center_text) {
            this.shadowRoot.querySelector('#copyright').setAttribute('style', 'text-align: center;');
            this.shadowRoot.querySelector('.element-group.left').setAttribute('style', 'flex: 1 1 0; text-align: right;');
            this.shadowRoot.querySelector('.element-group.right').setAttribute('style', 'flex: 1 1 0;');
          }
        } catch(e) {
          console.log(e);
        }
    }
}

customElements.define("cuf-footer-contact", CufFooterContact);