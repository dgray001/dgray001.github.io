//@ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {DEV, STAGING} = await import(`/scripts/util.js?v=${version}`);
await import(`../navigation_pane/navigation_pane.js?v=${version}`);
await import(`../profile_button/profile_button.js?v=${version}`);

export class CufHeader extends HTMLElement {
  /** @type {boolean} */
  homepage = false;
  /** @type {number} */
  lastKnownScrollPosition = 0;
  /** @type {boolean} */
  ticking = false;
  /** @type {number} */
  collapsed_container_height_multiplier = 4;
  /** @type {boolean} */
  profile_info_open = false;

  constructor() {
    super();
  }

  async connectedCallback() {
    this.homepage = this.attributes.homepage ? this.attributes.homepage.value === 'true' : this.homepage;
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/header/header.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/header/header.css?v=${version}`);
    shadow.appendChild(stylesheet);
    if (this.homepage) {
      this.homepageSettings(shadow);
    }
    else {
      this.defaultSettings(shadow);
    }
    if (DEV) {
      shadow.querySelector('.title').innerHTML = "CUF DEVELOPMENT SITE";
    }
    else if (STAGING) {
      shadow.querySelector('.title').innerHTML = "CUF STAGING SITE";
    }
    document.addEventListener('scroll', () => {
      this.lastKnownScrollPosition = window.scrollY;
    
      if (!this.ticking) {
        console.log('1');
        window.requestAnimationFrame(() => {
          this.updateScrollDependencies(this.lastKnownScrollPosition, shadow);
          this.ticking = false;
        });
    
        this.ticking = true;
      }
    });
  }

  /**
   * @param {number} scroll_pos
   * @param {ShadowRoot} shadow
   */
  updateScrollDependencies(scroll_pos, shadow) {
    const container = shadow.querySelector('.container');
    const max_offset = Math.max(0.02 * this.collapsed_container_height_multiplier * window.innerHeight, 45);
    const margin_offset = Math.min(scroll_pos, max_offset);
    container.style.setProperty('--margin-offset', margin_offset + 'px');
  }

  /**
   * @param {ShadowRoot} _shadow
   */
  homepageSettings(_shadow) {
    throw new Error("Should use cuf-header-homepage for the homepage");
  }

  /**
   * @param {ShadowRoot} shadow
   */
  defaultSettings(shadow) {
    const fixed_container = shadow.querySelector('.fixed-container');
    fixed_container.setAttribute('style', 'display: flex;');
  }
}

customElements.define("cuf-header", CufHeader);
