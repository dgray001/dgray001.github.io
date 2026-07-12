import { getCookie } from '../../../scripts/cookies';
import { CufElement } from '../../cuf_element';

import html from './profile_info.html';

import './profile_info.scss';

export class CufProfileInfo extends CufElement {
  private info_email: HTMLDivElement;
  private info_role: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('info_email');
    this.configureElement('info_role');
  }

  protected override parsedCallback(): void {
    this.info_email.innerText = getCookie('email');
    this.info_role.innerText = getCookie('role');
  }
}

customElements.define('cuf-profile-info', CufProfileInfo);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-profile-info': CufProfileInfo;
  }
}
