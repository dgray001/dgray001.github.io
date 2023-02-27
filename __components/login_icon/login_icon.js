// @ts-nocheck
import {version} from '/scripts/util.js'

export class CufLoginIcon extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch(`/__components/login_icon/login_icon.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/header/header.css?v=${version}`);
    shadow.appendChild(stylesheet);
  }
}

customElements.define("cuf-login-icon", CufLoginIcon);
