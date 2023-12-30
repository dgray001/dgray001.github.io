import {CufElement} from '../../cuf_element';
import {until} from '../../../scripts/util';
import {CufNavigationPane} from '../../common/navigation_pane/navigation_pane';
import {titleText} from '../../common/util';

import html from './header_home.html';

import './header_home.scss';
import '../../common/navigation_pane/navigation_pane';

export class CufHeaderHome extends CufElement {
  private title_container: HTMLDivElement;
  private home_title: HTMLDivElement;
  private logo_container: HTMLDivElement;
  private subtitle_2: HTMLDivElement;
  private navigation_pane: CufNavigationPane;

  private logo_max_width = 0;
  private ticking = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('title_container');
    this.configureElement('home_title', 'title');
    this.configureElement('logo_container');
    this.configureElement('subtitle_2');
    this.configureElement('navigation_pane');
  }

  protected override parsedCallback(): void {
    this.home_title.innerText = titleText();
    window.addEventListener('resize', () => {
      this.calculateLogoPosition();
    });
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
    if (document.body.classList.contains('mobile')) {
      //
    } else {
      //
    }
    await until(() => {
      return (
        this.home_title.getBoundingClientRect().width > 0 &&
        this.subtitle_2.getBoundingClientRect().width > 0 &&
        this.navigation_pane.getBoundingClientRect().width > 0 &&
        this.logo_container.getBoundingClientRect().width > 0
      );
    });
    await this.calculateLogoPosition(true);
    this.updateScrollDependencies();
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

  private updateScrollDependencies() {
    const title_rect = this.title_container.getBoundingClientRect();
    const this_rect = this.getBoundingClientRect();
    const height = Math.max(title_rect.bottom, this_rect.bottom) - title_rect.top;
    const width = (77 / 226.0) * height;
    this.style.setProperty('--header-height', `${height}px`);
    this.logo_container.style.setProperty('--offset', `${0.5 * (this.logo_max_width - width)}px`);
  }
}

customElements.define('cuf-header-home', CufHeaderHome);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-header-home': CufHeaderHome;
  }
}
