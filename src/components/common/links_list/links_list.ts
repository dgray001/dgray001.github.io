import {JsonDataContent} from '../../../data/data_control';
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
  links: JsonDataContent;
}

export class CufLinksList extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufLinksList parsed!');
  }
}

customElements.define('cuf-links-list', CufLinksList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-links-list': CufLinksList;
  }
}
