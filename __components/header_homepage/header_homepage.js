//@ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {DEV, STAGING} = await import(`/scripts/util.js?v=${version}`);
await import(`../navigation_pane/navigation_pane.js?v=${version}`);
await import(`../profile_button/profile_button.js?v=${version}`);

export class CufHeaderHomepage extends HTMLElement {
  /** @type {boolean} */
  homepage = false;
  /** @type {number} */
  lastKnownScrollPosition = 0;
  /** @type {boolean} */
  ticking = false;
  /** @type {number} */
  collapsed_container_height_multiplier = 3;
  /** @type {boolean} */
  profile_info_open = false;

  constructor() {
    super();
  }

  async connectedCallback() {
    this.homepage = this.attributes.homepage ? this.attributes.homepage.value === 'true' : this.homepage;
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/header_homepage/header_homepage.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/header_homepage/header_homepage.css?v=${version}`);
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
   * @param {ShadowRoot} shadow
   */
  homepageSettings(shadow) {
    this.collapsed_container_height_multiplier = 4;
    shadow.querySelector('.container').setAttribute('style',
      '--fixed-container-height: calc(1.4 * max(var(--navigation-height), calc(var(--header-height-unit) * 2)));' +
      '--header-total-height: calc(var(--fixed-container-height) + ' +
        'var(--header-height-unit) * 4 - var(--margin-offset));' +
      '--title-font-size-factor: 0.9; --subtitle-font-size-factor: 1.3;' +
      'padding-bottom: 0px;');
    shadow.querySelector('.logo').setAttribute('style', 'visibility: hidden;');
    shadow.querySelector('.fixed-container a').removeAttribute('href');
    shadow.querySelector('.title').setAttribute('style', 'text-align: center; margin-left: 0;');
    shadow.querySelector('.collapsed-container').setAttribute('style',
      'height: calc(var(--header-height-unit) * 4);');
    for (const element of shadow.querySelectorAll('.subtitle')) {
      element.setAttribute('style', 'text-align: center; margin-left: 0;');
    }
  }

  /**
   * @param {ShadowRoot} _shadow
   */
  defaultSettings(_shadow) {
    throw new Error("Should use cuf-header for the secondary pages");
  }
}

customElements.define("cuf-header-homepage", CufHeaderHomepage);
