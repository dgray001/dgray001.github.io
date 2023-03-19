//@ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {DEV, STAGING, until} = await import(`/scripts/util.js?v=${version}`);
await import(`../navigation_pane/navigation_pane.js?v=${version}`);
await import(`../profile_button/profile_button.js?v=${version}`);

export class CufHeaderHomepage extends HTMLElement {
  /** @type {boolean} */
  profile_info_open = false;
  /** @type {boolean} */
  parsed = false;

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
      //shadow.querySelector('.title').innerHTML = "|---CUF DEVELOPMENT SITE---|";
      shadow.querySelector('.title').innerHTML = "Catholics United for the Faith";
    }
    else if (STAGING) {
      shadow.querySelector('.title').innerHTML = "|-----CUF STAGING SITE-----|";
    }
    const title = shadow.querySelector('.title');
    const logo = shadow.querySelector('.logo-container');
    await new Promise(resolve => setTimeout(resolve, 100));
    await until(() => !!title && !!logo);
    this.calculateLogoPosition(shadow);
    window.addEventListener('resize', () => {
      this.calculateLogoPosition(shadow);
    });
  }

  /**
   * Recalculate left-right position of logo on homepage
   * @param {ShadowRoot} shadow 
   */
  calculateLogoPosition(shadow) {
    const title = shadow.querySelector('.title');
    const subtitle = shadow.querySelectorAll('.subtitle')[1];
    const navigation_pane = shadow.querySelector('cuf-navigation-pane');
    const logo = shadow.querySelector('.logo-container');
    if (!title || !logo || !subtitle || !navigation_pane) {
      throw new Error('Missing required element.');
    }
    const title_style = window.getComputedStyle(title.parentElement, null);
    const subtitle_style = window.getComputedStyle(subtitle, null);
    const navigation_pane_style = window.getComputedStyle(navigation_pane, null);
    let margin_left = Math.min(
      parseInt(title_style.marginLeft.slice(0, -2)),
      parseInt(subtitle_style.marginLeft.slice(0, -2)),
      parseInt(navigation_pane_style.marginLeft.slice(0, -2)));
    const logo_style = window.getComputedStyle(logo, null);
    logo.setAttribute('style', `--left: max(2px, calc(${margin_left}px - ${logo_style.width} - 16px)`);
    this.parsed = true;
  }
}

customElements.define("cuf-header-homepage", CufHeaderHomepage);
