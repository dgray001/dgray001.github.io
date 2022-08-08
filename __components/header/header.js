class CufHeader extends HTMLElement {
    homepage = false;

    constructor() {
        super();
    }
  
    async connectedCallback() {
        this.homepage = this.attributes.homepage ? this.attributes.homepage.value === 'true' : this.homepage;
        const shadow = this.attachShadow({mode: 'open'});
        const res = await fetch('./__components/header/header.html');
        const header = await res.text();
        shadow.innerHTML = header;
        if (this.homepage) {
            this.homepageStyle();
        }
    }

    homepageStyle() {
        this.shadowRoot.querySelector('.logo').setAttribute('style', 'visibility: hidden;');
        const container = this.shadowRoot.querySelector('.container');
        container.setAttribute('style', 'height: 22vh; background-color: lightblue; position: static; height: max(21.1vh, 61px);');
        this.shadowRoot.querySelector('.title').setAttribute('style', 'font-size: clamp(18px, 2.8vw, 7.2vh);');
        for (const element of this.shadowRoot.querySelectorAll('.subtitle')) {
            element.setAttribute('style', 'font-size: clamp(14px, 1.8vw, 4.3vh);');
        }
    }
}

customElements.define("cuf-header", CufHeader);