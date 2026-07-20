import { titleText } from '../../common/util';
import { DwgElement } from '@core/components/dwg_element';

import html from './admin_header.html';

import './admin_header.scss';
import '../../common/navigation_pane/navigation_pane';

export class CufAdminHeader extends DwgElement {
  private title_el: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('title_el', 'title');
  }

  protected override parsedCallback(): void {
    this.title_el.innerText = titleText();
  }
}

customElements.define('cuf-admin-header', CufAdminHeader);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-admin-header': CufAdminHeader;
  }
}
