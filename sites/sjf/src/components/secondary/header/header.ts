import { DwgElement } from '@core/components/dwg_element';
import { internalHref } from '@core/scripts/url';
import { titleText, missionText } from '../../common/util';

import html from './header.html';

import '../../common/navigation_pane/navigation_pane';
import './header.scss';

export class SjfHeader extends DwgElement {
  private name_el: HTMLAnchorElement;
  private mission_el: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('name_el', 'name');
    this.configureElement('mission_el', 'mission');
  }

  protected override parsedCallback(): void {
    this.name_el.innerText = titleText();
    this.name_el.href = internalHref('');
    this.mission_el.innerText = missionText();
  }
}

customElements.define('sjf-header', SjfHeader);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-header': SjfHeader;
  }
}
