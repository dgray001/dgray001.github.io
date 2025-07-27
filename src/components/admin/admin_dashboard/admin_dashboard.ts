import { CufElement } from '../../cuf_element';
import { hasPermission } from '../../../scripts/session';
import { getCookie } from '../../../scripts/cookies';

import html from './admin_dashboard.html';

import './admin_dashboard.scss';
import '../admin_header/admin_header';
import '../dashboard_section/dashboard_section';

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
    const possible_sections = [
      'layWitness',
      'positionPapers',
      'news',
      'chapters',
      'jobsAvailable',
      'prayer',
      'involvement',
      'faithFacts',
      'links',
    ];
    for (const section of possible_sections) {
      if (hasPermission(role, section)) {
        const section_el = document.createElement('cuf-dashboard-section');
        section_el.setAttribute('section', section);
        this.admin_container.appendChild(section_el);
      }
    }
  }
}

customElements.define('cuf-admin-dashboard', CufAdminDashboard);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-admin-dashboard': CufAdminDashboard;
  }
}
