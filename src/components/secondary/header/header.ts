import {CufElement} from '../../cuf_element';
import {until} from '../../../scripts/util';
import {titleText} from '../../common/util';

import html from './header.html';

import './header.scss';
import '../../common/navigation_pane/navigation_pane';

export class CufHeader extends CufElement {
  private logo_container: HTMLDivElement;
  private fixed_container: HTMLDivElement;
  private title_el: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('logo_container');
    this.configureElement('fixed_container');
    this.configureElement('title_el', 'title');
  }

  protected override parsedCallback(): void {
    this.title_el.innerText = titleText();
  }
}

customElements.define('cuf-header', CufHeader);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-header': CufHeader;
  }
}
