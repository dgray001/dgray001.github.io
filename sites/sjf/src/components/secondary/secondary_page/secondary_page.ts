import { DwgElement } from '@core/components/dwg_element';
import { getPage, getUrlParam } from '@core/scripts/url';
import { scrollToElement, trim, until } from '@core/scripts/util';
import { pageToName } from '../../common/util';

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

  protected override parsedCallback(): void {
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
      default:
        // Placeholder body content until the admin-editable content_page component exists
        this.actual_content.innerText = `${title} page content`;
        break;
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
}

customElements.define('sjf-secondary-page', SjfSecondaryPage);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-secondary-page': SjfSecondaryPage;
  }
}
