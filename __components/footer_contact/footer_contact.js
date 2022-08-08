class CufFooterContact extends HTMLElement {
    constructor() {
        super();
    }
  
    async connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'});
        const res = await fetch('./__components/footer_contact/footer_contact.html');
        shadow.innerHTML = await res.text();
    }
}

customElements.define("cuf-footer-contact", CufFooterContact);