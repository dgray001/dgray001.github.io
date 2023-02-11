import '../navigation_pane/navigation_pane.js';
import {clientCookies} from '../../scripts/util.js';

class CufHeader extends HTMLElement {
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
    const res = await fetch('./__components/header/header.html');
    const header = await res.text();
    shadow.innerHTML = header;
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
    const profile_wrapper = this.shadowRoot.querySelector('.profile-wrapper');
    profile_wrapper.setAttribute('style', 'display: none;');
  }

  defaultSettings() {
    const fixed_container = this.shadowRoot.querySelector('.fixed-container');
    fixed_container.setAttribute('style', 'display: flex;');
    const profile_picture = this.shadowRoot.querySelector('.profile-picture');
    const profile_button_logout = this.shadowRoot.querySelector('#profile-button-logout');
    profile_button_logout.href += `?hard_redirect=${window.location.href}`;
    const cookies = clientCookies();
    if (cookies.hasOwnProperty('email')) {
      const profile_info_email = this.shadowRoot.querySelector('.profile-info-wrapper .info-email');
      profile_info_email.innerText = cookies['email'];
    }
    if (cookies.hasOwnProperty('role')) {
      const profile_info_email = this.shadowRoot.querySelector('.profile-info-wrapper .info-role');
      profile_info_email.innerText = ` - ${cookies['role']} -`;
    }
    if (cookies.hasOwnProperty('PHPSESSID')) {
      profile_picture.addEventListener('click', () => {
        const profile_info_wrapper = this.shadowRoot.querySelector('.profile-info-wrapper');
        this.profile_info_open = !this.profile_info_open;
        if (this.profile_info_open) {
          profile_info_wrapper.setAttribute('style', 'display: block;');
        }
        else {
          profile_info_wrapper.setAttribute('style', 'display: none;');
        }
      });
    }
    else {
      profile_picture.setAttribute('style', 'display: none;');
    }
  }
}

customElements.define("cuf-header", CufHeader);
