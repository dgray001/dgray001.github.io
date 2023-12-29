import {CufElement} from '../../cuf_element';

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

  protected override parsedCallback(): void {
    // TODO: add components based on permissions
  }
}

customElements.define('cuf-admin-dashboard', CufAdminDashboard);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-admin-dashboard': CufAdminDashboard;
  }
}
