import { DwgElement } from '@core/components/dwg_element';
import { getPage, getUrlParam } from '@core/scripts/url';
import { scrollToElement, trim, until } from '@core/scripts/util';
import { fetchJson } from '@core/data/data_control';
import { pageToName } from '../../common/util';
import { page_sections } from '../../../config/page_sections';

import html from './secondary_page.html';

import './secondary_page.scss';
import '../header/header';
import '../../common/footer/footer';
import '../../common/form/forms/login_form/login_form';
import '../../common/form/forms/reset_password_form/reset_password_form';
import '../../common/form/forms/change_password_form/change_password_form';
import '@core/components/profile_info/profile_info';

export class SjfSecondaryPage extends DwgElement {
  private page_title!: HTMLHeadingElement;
  private actual_content!: HTMLDivElement;

  private page = '';

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements('header', 'page_title', 'actual_content', 'footer');
  }

  protected override async parsedCallback(): Promise<void> {
    this.page = trim(getPage(), '/');
    const title = pageToName(this.page);
    this.page_title.innerText = title;
    document.title = `${title} | SJF`;
    switch (this.page) {
      case 'login':
        this.actual_content.appendChild(document.createElement('sjf-login-form'));
        break;
      case 'login/reset_password':
        this.actual_content.appendChild(document.createElement('sjf-reset-password-form'));
        break;
      case 'profile':
        this.actual_content.appendChild(document.createElement('dwg-profile-info'));
        this.actual_content.appendChild(document.createElement('sjf-change-password-form'));
        break;
      default: {
        const sections = page_sections.filter((section) => section.page === this.page);
        if (sections.length) {
          const page_content = await fetchJson<Record<string, string>>(
            'page_content/page_content.json'
          );
          for (const section of sections) {
            this.actual_content.appendChild(this.contentSection(section.id, page_content));
          }
        } else {
          // Placeholder body content until this page has configured content sections
          this.actual_content.innerText = `${title} page content`;
        }
        break;
      }
    }

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

  /** A named, admin-editable content area, populated from the fetched page content map */
  private contentSection(id: string, page_content: Record<string, string>): HTMLDivElement {
    const section = document.createElement('div');
    section.id = id;
    section.innerHTML = page_content[id] ?? '';
    return section;
  }
}

customElements.define('sjf-secondary-page', SjfSecondaryPage);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-secondary-page': SjfSecondaryPage;
  }
}
