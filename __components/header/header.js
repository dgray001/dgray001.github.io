//@ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
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
  collapsed_container_height_multiplier = 3;
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
      this.homepageSettings();
    }
    else {
      this.defaultSettings();
    }
    document.addEventListener('scroll', () => {
      this.lastKnownScrollPosition = window.scrollY;
    
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateScrollDependencies(this.lastKnownScrollPosition);
          this.ticking = false;
        });
    
        this.ticking = true;
      }
    });
  }
  
  updateScrollDependencies(scroll_pos) {
    const container = this.shadowRoot.querySelector('.container');
    const max_offset = Math.max(0.02 * this.collapsed_container_height_multiplier * window.innerHeight, 45);
    const margin_offset = Math.min(scroll_pos, max_offset)
    container.style.setProperty('--margin-offset', margin_offset + 'px');
  }

  homepageSettings() {
    this.collapsed_container_height_multiplier = 4;
    this.shadowRoot.querySelector('.container').setAttribute('style',
      '--fixed-container-height: calc(1.4 * max(var(--navigation-height), calc(var(--header-height-unit) * 2)));' +
      '--header-total-height: calc(var(--fixed-container-height) + ' +
        'var(--header-height-unit) * 4 - var(--margin-offset));' +
      '--title-font-size-factor: 0.9;' +
      '--subtitle-font-size-factor: 1.3;');
    this.shadowRoot.querySelector('.logo').setAttribute('style', 'visibility: hidden;');
    this.shadowRoot.querySelector('.logo-container a').setAttribute('style', 'width: 0px;');
    this.shadowRoot.querySelector('.fixed-container a').removeAttribute('href');
    this.shadowRoot.querySelector('.title').setAttribute('style', 'text-align: center; margin-left: 0;');
    this.shadowRoot.querySelector('.collapsed-container').setAttribute('style',
      'height: calc(var(--header-height-unit) * 4);');
    for (const element of this.shadowRoot.querySelectorAll('.subtitle')) {
      element.setAttribute('style', 'text-align: center; margin-left: 0;');
    }
    const navigation_panel = this.shadowRoot.querySelector('cuf-navigation-pane');
    navigation_panel.remove();
  }

  defaultSettings() {
    const fixed_container = this.shadowRoot.querySelector('.fixed-container');
    fixed_container.setAttribute('style', 'display: flex;');
  }
}

customElements.define("cuf-header", CufHeader);
