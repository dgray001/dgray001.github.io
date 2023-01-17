class CufHeader extends HTMLElement {
  homepage = false;
  lastKnownScrollPosition = 0;
  ticking = false;

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
    const max_offset = Math.max(0.06 * window.innerHeight, 45);
    const margin_offset = Math.min(scroll_pos, max_offset)
    container.style.setProperty('--margin-offset', margin_offset + 'px');
  }

  homepageStyle() {
    this.shadowRoot.querySelector('.logo').setAttribute('style', 'visibility: hidden;');
    this.shadowRoot.querySelector('a').setAttribute('style', 'width: 0px;');
    const fixed_container = this.shadowRoot.querySelector('.fixed-container');
    fixed_container.setAttribute('style', 'margin-left: 5vw; width: 90vw;');
    const collapsed_container = this.shadowRoot.querySelector('.collapsed-container');
    collapsed_container.setAttribute('style', 'margin-left: 5vw; width: 90vw;');
    const margin_container = this.shadowRoot.querySelector('.margin');
    margin_container.setAttribute('style', 'margin-left: 5vw; width: 90vw;');
    this.shadowRoot.querySelector('.title').setAttribute('style', 'text-align: center;');
    for (const element of this.shadowRoot.querySelectorAll('.subtitle')) {
      element.setAttribute('style', 'text-align: center;');
    }
  }
  
}

customElements.define("cuf-header", CufHeader);
