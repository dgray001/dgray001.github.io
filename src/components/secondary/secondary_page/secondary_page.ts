import {CufElement} from '../../cuf_element';
import {CufHeader} from '../header/header';
import {CufSidebar} from '../sidebar/sidebar';
import {CufFooter} from '../../common/footer/footer';
import {getPage, getUrlParam} from '../../../scripts/url';
import {scrollToElement, trim} from '../../../scripts/util';
import {pageToName} from '../../common/util';
import {JsonData, JsonDataContent, fetchJson} from '../../../data/data_control';

import html from './secondary_page.html';

import './secondary_page.scss';
import '../header/header';
import '../sidebar/sidebar';
import '../../common/footer/footer';
import '../../common/faith_fact_category_list/faith_fact_category_list';
import '../../common/laywitness_list/laywitness_list';
import '../../common/form/forms/contact_form/contact_form';
import '../../common/form/forms/donate_form/donate_form';
import '../../common/form/forms/login_form/login_form';
import '../../common/profile_button/profile_button';

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
    this.sidebar.removePanel(this.page);
    await this.setTitle(pageToName(this.page));
    const hash = getUrlParam('h');
    if (!!hash) {
      const scroll_el = this.querySelector<HTMLElement>(`#${hash}`);
      if (!!scroll_el) {
        scrollToElement(scroll_el);
      }
    }
    if (['position_papers', 'news', 'jobs_available'].includes(this.page)) {
      const json_data = await fetchJson<JsonData>(`${this.page}/${this.page}.json`);
      const contents: JsonDataContent[] = [];
      if (!!json_data.subheader) {
        contents.push(json_data.subheader);
      }
      contents.push(...json_data.content);
      if (contents.length === 0 && !!json_data.content_empty) {
        contents.push(json_data.content_empty);
      }
      for (const content of contents) {
        const section = document.createElement('div');
        section.classList.add('section');
        if (!!content.title) {
          const subtitle = document.createElement('h3');
          subtitle.classList.add('section-subtitle');
          if (!!content.titlelink) {
            subtitle.innerHTML = `<i><a href="${content.titlelink}">${content.title}</a></i>`;
          } else {
            subtitle.innerHTML = `<i>${content.title}</i>`;
          }
          section.appendChild(subtitle);
        }
        if (!!content.description) {
          const section_content = document.createElement('div');
          section_content.classList.add('section-content');
          section_content.innerHTML = content.description;
          section.appendChild(section_content);
        }
        this.actual_content.appendChild(section);
      }
    }
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