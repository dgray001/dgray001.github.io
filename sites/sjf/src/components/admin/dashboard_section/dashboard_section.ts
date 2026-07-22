import { DwgElement } from '@core/components/dwg_element';

import html from './dashboard_section.html';

import './dashboard_section.scss';
import '../page_content_editor/page_content_editor';

export class SjfDashboardSection extends DwgElement {
  private section_title!: HTMLButtonElement;
  private section_body!: HTMLDivElement;

  private section_key = '';
  private body_open = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements('section_title', 'section_body');
  }

  protected override parsedCallback(): void {
    this.section_key = this.getAttribute('section') ?? '';
    const tag_key = this.section_key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    this.section_title.innerText = this.sectionTitle();
    const section_content = document.createElement(`sjf-${tag_key}`);
    this.section_body.replaceChildren(section_content);
    this.section_title.addEventListener('click', () => {
      this.setBodyOpen(!this.body_open);
    });
  }

  private sectionTitle(): string {
    switch (this.section_key) {
      case 'pageContentEditor':
        return 'Page Content Editor';
      default:
        return 'Not Implemented';
    }
  }

  private setBodyOpen(body_open: boolean) {
    this.body_open = body_open;
    this.section_body.classList.toggle('show', body_open);
    this.section_title.classList.toggle('open', body_open);
  }
}

customElements.define('sjf-dashboard-section', SjfDashboardSection);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-dashboard-section': SjfDashboardSection;
  }
}
