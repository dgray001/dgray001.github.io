import {JsonDataContent, fetchJson} from '../../../data/data_control';
import {CufElement} from '../../cuf_element';

import html from './links_list.html';

import './links_list.scss';

/** Data describing all the links */
export declare interface LinksData {
  header: string;
  groups: LinkGroupData[];
}

/** Data describing a group of links */
export declare interface LinkGroupData {
  subheader: string;
  links: JsonDataContent[];
}

export class CufLinksList extends CufElement {
  constructor() {
    super();
    this.htmlString = html;
  }

  protected override async parsedCallback(): Promise<void> {
    const linksData = await fetchJson<LinksData>('links/links.json');
    for (const group of linksData.groups) {
      const header = document.createElement('h2');
      header.classList.add('section-title');
      header.innerHTML = group.subheader;
      this.appendChild(header);
      const content = document.createElement('div');
      content.classList.add('section-content');
      for (const link of group.links) {
        const p = document.createElement('p');
        p.innerHTML = `<a href="${link.titlelink}">${link.title}</a><br>${link.description ?? ''}`;
        content.appendChild(p);
      }
      this.appendChild(content);
    }
  }
}

customElements.define('cuf-links-list', CufLinksList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-links-list': CufLinksList;
  }
}
