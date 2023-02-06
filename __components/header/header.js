import '../navigation_pane/navigation_pane.js';

class CufHeader extends HTMLElement {
  homepage = false;
  lastKnownScrollPosition = 0;
  ticking = false;
  collapsed_container_height_multiplier = 3;

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
    else {
      this.defaultStyle();
    }
    document.addEventListener("scroll", () => {
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

  homepageStyle() {
    this.collapsed_container_height_multiplier = 4;
    this.shadowRoot.querySelector('.container').setAttribute('style',
      '--fixed-container-height: calc(1.4 * max(var(--navigation-height), calc(var(--header-height-unit) * 2)));' +
      '--header-total-height: calc(var(--fixed-container-height) + var(--header-height-unit) * 4 - var(--margin-offset));');
    this.shadowRoot.querySelector('.logo').setAttribute('style', 'visibility: hidden;');
    this.shadowRoot.querySelector('.logo-container a').setAttribute('style', 'width: 0px;');
    this.shadowRoot.querySelector('.fixed-container a').removeAttribute('href');
    this.shadowRoot.querySelector('.title').setAttribute('style', 'text-align: center; margin-left: 0;');
    this.shadowRoot.querySelector('.collapsed-container').setAttribute('style',
      'height: calc(var(--header-height-unit) * 4);');
    for (const element of this.shadowRoot.querySelectorAll('.subtitle')) {
      element.setAttribute('style', 'text-align: center; margin-left: 0;' +
      'font-size: calc(1.3 * min(var(--header-height-unit) * 1.05, max(14px, 3.5vw)));');
    }
    const navigation_panel = this.shadowRoot.querySelector('cuf-navigation-pane');
    navigation_panel.remove();
  }

  defaultStyle() {
    const fixed_container = this.shadowRoot.querySelector('.fixed-container');
    fixed_container.setAttribute('style', 'display: flex;');
  }
}

customElements.define("cuf-header", CufHeader);
