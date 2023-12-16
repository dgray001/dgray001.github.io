import {CufElement} from '../../cuf_element';
import {CufHeader} from '../header/header';
import {CufSidebar} from '../sidebar/sidebar';
import {CufFooter} from '../../common/footer/footer';
import {getPage} from '../../../scripts/url';
import {trim} from '../../../scripts/util';
import {pageToName} from '../../common/util';

import html from './secondary_page.html';

import './secondary_page.scss';
import '../header/header';
import '../sidebar/sidebar';
import '../../common/footer/footer';

export class CufSecondaryPage extends CufElement {
  private header: CufHeader;
  private page_title: HTMLHeadingElement;
  private actual_content: HTMLDivElement;
  private sidebar: CufSidebar;
  private footer: CufFooter;

  private page = '';

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('header');
    this.configureElement('page_title');
    this.configureElement('actual_content');
    this.configureElement('sidebar');
    this.configureElement('footer');
  }

  protected override async parsedCallback(): Promise<void> {
    this.page = trim(getPage(), '/');
    this.setTitle(pageToName(this.page));
  }

  private async setTitle(title: string) {
    this.page_title.innerText = title;
    document.title = `${title.replace('CUF', '')} | CUF`;
    const response = await fetch(`/secondary_page_html/${this.page}.html`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    });
    this.actual_content.innerHTML += await response.text();
  }
}

customElements.define('cuf-secondary-page', CufSecondaryPage);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-secondary-page': CufSecondaryPage;
  }
}