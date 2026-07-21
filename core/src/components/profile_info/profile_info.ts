import { getCookie } from '@core/scripts/cookies';
import { DwgElement } from '@core/components/dwg_element';

import html from './profile_info.html';

import './profile_info.scss';

export class DwgProfileInfo extends DwgElement {
  private info_email!: HTMLDivElement;
  private info_role!: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements('info_email', 'info_role');
  }

  protected override parsedCallback(): void {
    this.info_email.innerText = getCookie('email');
    this.info_role.innerText = getCookie('role');
  }
}

customElements.define('dwg-profile-info', DwgProfileInfo);

declare global {
  interface HTMLElementTagNameMap {
    'dwg-profile-info': DwgProfileInfo;
  }
}
