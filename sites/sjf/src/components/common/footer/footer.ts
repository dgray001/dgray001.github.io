import { DwgElement } from '@core/components/dwg_element';
import { internalHref } from '@core/scripts/url';

import html from './footer.html';

import './footer.scss';

const internal_links = [
  'link_about',
  'link_christifidelis',
  'link_articles_opinions',
  'link_priests',
  'link_parishes',
  'link_news',
  'link_contact',
  'link_donate',
  'link_login',
] as const;

export class SjfFooter extends DwgElement {
  private link_about!: HTMLAnchorElement;
  private link_christifidelis!: HTMLAnchorElement;
  private link_articles_opinions!: HTMLAnchorElement;
  private link_priests!: HTMLAnchorElement;
  private link_parishes!: HTMLAnchorElement;
  private link_news!: HTMLAnchorElement;
  private link_contact!: HTMLAnchorElement;
  private link_donate!: HTMLAnchorElement;
  private link_login!: HTMLAnchorElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements(...internal_links);
  }

  protected override parsedCallback(): void {
    for (const link of internal_links) {
      this[link].href = internalHref(link.replace(/^link_/, ''));
    }
  }
}

customElements.define('sjf-footer', SjfFooter);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-footer': SjfFooter;
  }
}
