import { DwgElement } from '@core/components/dwg_element';
import { getPage, getUrlParam } from '@core/scripts/url';
import { scrollToElement, trim, until } from '@core/scripts/util';
import { pageToName } from '../../common/util';

import html from './secondary_page.html';

import './secondary_page.scss';
import '../header/header';
import '../../common/footer/footer';

export class SjfSecondaryPage extends DwgElement {
  private page_title!: HTMLHeadingElement;
  private actual_content!: HTMLDivElement;

  private page = '';

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements('header', 'page_title', 'actual_content', 'footer');
  }

  protected override parsedCallback(): void {
    this.page = trim(getPage(), '/');
    const title = pageToName(this.page);
    this.page_title.innerText = title;
    document.title = `${title} | SJF`;
    // Placeholder body content until the admin-editable content_page component exists
    this.actual_content.innerText = `${title} page content`;

    const hash = getUrlParam('h');
    if (hash) {
      let scroll_el: HTMLElement | null = null;
      until(
        () => {
          scroll_el = this.querySelector<HTMLElement>(`#${hash}`);
          return !!scroll_el;
        },
        40,
        200
      ).then(() => {
        const el = scroll_el;
        if (!el) {
          return;
        }
        until(() => el.offsetTop > 0, 40, 200).then(() => {
          scrollToElement(el, 2000);
        });
      });
    }
  }
}

customElements.define('sjf-secondary-page', SjfSecondaryPage);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-secondary-page': SjfSecondaryPage;
  }
}
