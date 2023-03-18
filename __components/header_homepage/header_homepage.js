//@ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {DEV, STAGING} = await import(`/scripts/util.js?v=${version}`);
await import(`../navigation_pane/navigation_pane.js?v=${version}`);
await import(`../profile_button/profile_button.js?v=${version}`);

export class CufHeaderHomepage extends HTMLElement {
  /** @type {boolean} */
  profile_info_open = false;

  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/header_homepage/header_homepage.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/header_homepage/header_homepage.css?v=${version}`);
    shadow.appendChild(stylesheet);
    if (DEV) {
      shadow.querySelector('.title').innerHTML = "|----CUF DEVELOPMENT SITE----|";
    }
    else if (STAGING) {
      shadow.querySelector('.title').innerHTML = "|------CUF STAGING SITE------|";
    }
    const title = shadow.querySelector('.title');
    const logo = shadow.querySelector('.logo-container');
    await new Promise(resolve => setTimeout(resolve, 100));
    const title_style = window.getComputedStyle(title.parentElement, null);
    const logo_style = window.getComputedStyle(logo, null);
    logo.setAttribute('style', `left: max(0px, calc(${title_style.marginLeft} - ${logo_style.width} - 16px)`);
  }
}

customElements.define("cuf-header-homepage", CufHeaderHomepage);
