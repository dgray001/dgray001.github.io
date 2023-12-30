import {CufElement} from '../../cuf_element';
import {hasPermission} from '../../../scripts/session';
import {getCookie} from '../../../scripts/cookies';

import html from './admin_dashboard.html';

import './admin_dashboard.scss';
import '../admin_header/admin_header';

export class CufAdminDashboard extends CufElement {
  private admin_container: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('header');
    this.configureElement('admin_container');
    this.configureElement('footer');
  }

  protected override async parsedCallback(): Promise<void> {
    const role = getCookie('role');
    if (hasPermission(role, 'layWitness')) {
      // TODO: implement
    }
    if (hasPermission(role, 'positionPapers')) {
      // TODO: implement
    }
    if (hasPermission(role, 'news')) {
      // TODO: implement
    }
    if (hasPermission(role, 'faithFacts')) {
      // TODO: implement
    }
    if (hasPermission(role, 'jobsAvailable')) {
      // TODO: implement
    }
  }
}

customElements.define('cuf-admin-dashboard', CufAdminDashboard);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-admin-dashboard': CufAdminDashboard;
  }
}
