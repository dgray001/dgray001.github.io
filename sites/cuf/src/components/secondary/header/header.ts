import { DwgElement } from '@core/components/dwg_element';
import { until } from '@core/scripts/util';
import { internalHref } from '@core/scripts/url';
import { titleText } from '../../common/util';

import html from './header.html';

import '@core/components/profile_button/profile_button';
import './header.scss';
import '../../common/navigation_pane/navigation_pane';

export class CufHeader extends DwgElement {
  private logo_container: HTMLDivElement;
  private fixed_container: HTMLDivElement;
  private title_el: HTMLDivElement;
  private title_link: HTMLAnchorElement;

  private ticking = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('logo_container');
    this.configureElement('fixed_container');
    this.configureElement('title_el', 'title');
    this.configureElement('title_link');
  }

  protected override parsedCallback(): void {
    this.title_el.innerText = titleText();
    this.title_link.href = internalHref('');
    document.body.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateScrollDependencies();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
    this.classList.add('hidden');
  }

  protected override async fullyParsedCallback(): Promise<void> {
    await until(() => {
      return (
        this.logo_container.getBoundingClientRect().height > 0 &&
        this.fixed_container.getBoundingClientRect().height > 0
      );
    });
    this.updateScrollDependencies();
    this.classList.remove('hidden');
  }

  updateScrollDependencies() {
    this.style.setProperty('--scrollY', `${document.body.scrollTop}px`);
  }
}

customElements.define('cuf-header', CufHeader);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-header': CufHeader;
  }
}
