import {CufElement} from '../../cuf_element';
import {DEV, STAGING, until} from '../../../scripts/util';
import {CufNavigationPane} from '../../common/navigation_pane/navigation_pane';

import html from './header_home.html';

import './header_home.scss';
import '../../common/navigation_pane/navigation_pane';

export class CufHeaderHome extends CufElement {
  private home_title: HTMLDivElement;
  private logo_container: HTMLDivElement;
  private subtitle_2: HTMLDivElement;
  private navigation_pane: CufNavigationPane;

  private logo_max_width = 0;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('home_title', 'title');
    this.configureElement('logo_container');
    this.configureElement('subtitle_2');
    this.configureElement('navigation_pane');
  }

  protected override parsedCallback(): void {
    if (DEV) {
      this.home_title.innerText = '|--CUF DEVELOPMENT SITE--|';
    } else if (STAGING) {
      this.home_title.innerText = '|---CUF STAGING SITE---|';
    } else {
      this.home_title.innerText = 'Catholics United for the Faith';
    }
    window.addEventListener('resize', () => {
      this.calculateLogoPosition();
    });
    this.classList.add('hidden');
  }

  protected override async fullyParsedCallback(): Promise<void> {
    await until(() => {
      return (
        this.home_title.getBoundingClientRect().width > 0 &&
        this.subtitle_2.getBoundingClientRect().width > 0 &&
        this.navigation_pane.getBoundingClientRect().width > 0 &&
        this.logo_container.getBoundingClientRect().width > 0
      );
    });
    await this.calculateLogoPosition(true);
    this.classList.remove('hidden');
  }

  private async calculateLogoPosition(set_max_width = false) {
    let margin_left = Math.min(
      this.home_title.getBoundingClientRect().x,
      this.subtitle_2.getBoundingClientRect().x,
      this.navigation_pane.getBoundingClientRect().x,
    );
    const logo_width = this.logo_container.getBoundingClientRect().width;
    this.logo_container.style.setProperty('--left',
      `max(2px, calc(${margin_left}px - ${logo_width}px - var(--size-small)))`);
    if (set_max_width) {
      this.logo_max_width = logo_width;
    }
  }
}

customElements.define('cuf-header-home', CufHeaderHome);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-header-home': CufHeaderHome;
  }
}
