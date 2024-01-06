import {JsonData, fetchJson} from '../../../data/data_control';
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
  constructor() {
    super();
    this.htmlString = html;
  }

  protected override async parsedCallback(): Promise<void> {
    const data = await fetchJson<JsonData<ChapterData>>('chapters/chapters.json');
    for (const chapter of data.content) {
      const wrapper = this.addLine('', 'chapter');
      wrapper.appendChild(this.addLine(chapter.name, 'name'));
      for (const other_line of chapter.other_lines) {
        wrapper.appendChild(this.addLine(other_line, 'other'));
      }
      if (!!chapter.website) {
        wrapper.appendChild(this.addLine(`<a href="${chapter.website}">${chapter.website}</a>`, 'website'));
      }
      if (!!chapter.email) {
        wrapper.appendChild(this.addLine(`<a href="mailto:${chapter.email}">${chapter.email}</a>`, 'email'));
      }
      if (!!chapter.facebook) {
        wrapper.appendChild(this.addLine(
          `<a href="${chapter.facebook}">Connect with them on Facebook</a>`, 'facebook'));
      }
      this.appendChild(wrapper);
    }
  }

  private addLine(html: string, cls: string): HTMLDivElement {
    const line = document.createElement('div');
    line.classList.add(cls);
    line.innerHTML = html;
    return line;
  }
}

customElements.define('cuf-chapters-list', CufChaptersList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-chapters-list': CufChaptersList;
  }
}
