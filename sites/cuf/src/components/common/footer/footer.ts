import { DwgElement } from '@core/components/dwg_element';
import { internalHref } from '@core/scripts/url';

import html from './footer.html';

import './footer.scss';

const internal_links = [
  'link_about',
  'link_news',
  'link_links',
  'link_contact',
  'link_donate',
  'link_information_services',
  'link_faith_facts',
  'link_lay_witness',
  'link_faith_and_life_series',
] as const;

export class CufFooter extends DwgElement {
  private link_about: HTMLAnchorElement;
  private link_news: HTMLAnchorElement;
  private link_links: HTMLAnchorElement;
  private link_contact: HTMLAnchorElement;
  private link_donate: HTMLAnchorElement;
  private link_information_services: HTMLAnchorElement;
  private link_faith_facts: HTMLAnchorElement;
  private link_lay_witness: HTMLAnchorElement;
  private link_faith_and_life_series: HTMLAnchorElement;

  constructor() {
    super();
    this.htmlString = html;
    for (const link of internal_links) {
      this.configureElement(link);
    }
  }

  protected override parsedCallback(): void {
    for (const link of internal_links) {
      this[link].href = internalHref(link.replace(/^link_/, ''));
    }
  }
}

customElements.define('cuf-footer', CufFooter);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-footer': CufFooter;
  }
}
