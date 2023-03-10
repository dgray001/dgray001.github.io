// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {hasPermission, clientCookies, loggedIn} = await import(`/scripts/util.js?v=${version}`);

export class CufProfileButton extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/profile_button/profile_button.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/profile_button/profile_button.css?v=${version}`);
    shadow.appendChild(stylesheet);
    this.setProfileButton(shadow);
  }

  /**
   * @param {ShadowRoot} shadow 
   */
  setProfileButton(shadow) {
    const profile_picture = shadow.querySelector('.profile-picture');
    const profile_button_logout = shadow.querySelector('#button-logout');
    profile_button_logout.href += `?hard_redirect=${window.location.href}`;
    const cookies = clientCookies();
    if (loggedIn()) {
      const info_email = shadow.querySelector('.info-wrapper .email');
      info_email.innerText = cookies['email'];

      const info_role = shadow.querySelector('.info-wrapper .role');
      info_role.innerText = ` - ${cookies['role']} -`;

      if (hasPermission(cookies['role'], 'viewAdminDashboard')) {
        const profile_button_dashboard = shadow.querySelector('#button-dashboard');
        profile_button_dashboard.removeAttribute('style');
      }

      profile_picture.addEventListener('click', () => {
        const profile_info_wrapper = shadow.querySelector('.info-wrapper');
        this.profile_info_open = !this.profile_info_open;
        if (this.profile_info_open) {
          profile_info_wrapper.setAttribute('style', 'display: block;');
        }
        else {
          profile_info_wrapper.setAttribute('style', 'display: none;');
        }
      });
      profile_picture.removeAttribute('style');
    }
    else {
      profile_picture.setAttribute('style', 'display: none;');
    }
  }
}

customElements.define("cuf-profile-button", CufProfileButton);
