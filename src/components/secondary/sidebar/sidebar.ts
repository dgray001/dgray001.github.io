import {panelsToIncludeFrom} from '../../../scripts/datalists';
import {CufContentCard} from '../../common/content_card/content_card';
import {CufElement} from '../../cuf_element';

import html from './sidebar.html';

import './sidebar.scss';
import '../../common/content_card/content_card';

export class CufSidebar extends CufElement {
  private wrapper: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('wrapper');
  }

  protected override parsedCallback(): void {
    const panels_data = this.attributes.getNamedItem('panels')?.value || '[]';
    const panels_to_include = panelsToIncludeFrom(panels_data);
    const start_closed = window.innerWidth < 600;
    for (const panel_to_include of panels_to_include) {
      const content_card: CufContentCard = document.createElement('cuf-content-card');
      content_card.classList.add('content-card');
      content_card.setAttribute('content-key', panel_to_include);
      if (start_closed || panel_to_include === 'prayer') {
        content_card.setAttribute('start-closed', 'true');
      }
      if (panel_to_include === 'prayer') {
        content_card.setAttribute('collapsible', 'true');
      } else {
        content_card.setAttribute('fixed-height', '462');
        content_card.setAttribute('fade-in', 'true');
      }
      this.wrapper.appendChild(content_card);
    }
  }
}

customElements.define('cuf-sidebar', CufSidebar);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-sidebar': CufSidebar;
  }
}
