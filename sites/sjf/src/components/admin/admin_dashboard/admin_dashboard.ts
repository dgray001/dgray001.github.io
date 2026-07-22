import { DwgElement } from '@core/components/dwg_element';
import { hasPermission } from '@core/scripts/session';
import { getCookie } from '@core/scripts/cookies';

import html from './admin_dashboard.html';

import './admin_dashboard.scss';
import '../dashboard_section/dashboard_section';

/** All admin dashboard sections; each must have a matching permission key and dashboard_section case */
const possible_sections = ['pageContentEditor'];

export class SjfAdminDashboard extends DwgElement {
  private admin_container!: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements('admin_container');
  }

  protected override parsedCallback(): void {
    const role = getCookie('role');
    for (const section of possible_sections) {
      if (hasPermission(role, section)) {
        const section_el = document.createElement('sjf-dashboard-section');
        section_el.setAttribute('section', section);
        this.admin_container.appendChild(section_el);
      }
    }
  }
}

customElements.define('sjf-admin-dashboard', SjfAdminDashboard);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-admin-dashboard': SjfAdminDashboard;
  }
}
