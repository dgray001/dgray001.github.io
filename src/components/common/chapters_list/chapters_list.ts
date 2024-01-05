import {CufElement} from '../../cuf_element';

import html from './chapters_list.html';

import './chapters_list.scss';

/** Data describing a single CUF chapter */
export declare interface ChapterData {
  name: string;
  other_lines: string[];
  website?: string;
  email?: string;
  facebook?: string;
}

export class CufChaptersList extends CufElement {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  protected override parsedCallback(): void {
    console.log('CufChaptersList parsed!');
  }
}

customElements.define('cuf-chapters-list', CufChaptersList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-chapters-list': CufChaptersList;
  }
}
