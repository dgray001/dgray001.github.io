import {clientCookies} from '../../../scripts/cookies';
import {hasPermission, loggedIn} from '../../../scripts/session';
import {DEV} from '../../../scripts/util';
import {CufElement} from '../../cuf_element';

import html from './profile_button.html';

import './profile_button.scss';

export class CufProfileButton extends CufElement {
  private profile_picture_wrapper: HTMLDivElement;
  private info_wrapper: HTMLDivElement;
  private link_wrapper: HTMLDivElement;

  private dropdown_open = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('profile_picture_wrapper');
    this.configureElement('info_wrapper');
    this.configureElement('link_wrapper');
  }

  protected override async parsedCallback(): Promise<void> {
    const logged_in = await loggedIn();
    if (!DEV && !logged_in) {
      this.remove();
      return;
    }
    this.classList.toggle('logged-in', logged_in);
    if (logged_in) {
      const cookies = clientCookies();
      this.addInfoRow('header', 'Logged In');
      this.addInfoRow('email', cookies.get('email') ?? 'none');
      this.addInfoRow('role', `- ${cookies.get('role') ?? 'unknown'} -`);
      if (hasPermission(cookies.get('role'), 'viewAdminDashboard')) {
        this.addLinkRow('admin-dashboard', 'admin_dashboard', 'Admin');
      }
      this.addLinkRow('profile', 'profile', 'Profile');
      this.addLinkRow('logout', `server/logout.php?hard_redirect=${window.location.href}`, 'Logout');
    } else {
      this.addLinkRow('login', 'login', 'Member Login');
    }
    this.profile_picture_wrapper.addEventListener('click', () => {
      this.dropdown_open = !this.dropdown_open;
      this.classList.toggle('dropdown-open', this.dropdown_open);
    });
  }

  private addInfoRow(cls: string, text: string): void {
    const info = document.createElement('div');
    info.classList.add('info');
    info.classList.add(cls);
    info.innerText = text;
    this.info_wrapper.appendChild(info);
  }

  private addLinkRow(cls: string, route: string, text: string): void {
    const link = document.createElement('a');
    link.classList.add('link');
    link.classList.add(cls);
    link.href = `/${route}`;
    const txt = document.createElement('span');
    txt.innerText = text;
    link.appendChild(txt);
    this.link_wrapper.appendChild(link);
  }
}

customElements.define('cuf-profile-button', CufProfileButton);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-profile-button': CufProfileButton;
  }
}
