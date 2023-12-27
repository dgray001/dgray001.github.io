import {CufElement} from '../../cuf_element';
import {until} from '../../../scripts/util';
import {titleText} from '../../common/util';

import html from './header.html';

import '../../common/profile_button/profile_button';
import './header.scss';
import '../../common/navigation_pane/navigation_pane';

export class CufHeader extends CufElement {
  private logo_container: HTMLDivElement;
  private fixed_container: HTMLDivElement;
  private title_el: HTMLDivElement;

  private ticking = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('logo_container');
    this.configureElement('fixed_container');
    this.configureElement('title_el', 'title');
  }

  protected override parsedCallback(): void {
    this.title_el.innerText = titleText();
    document.addEventListener('scroll', () => {    
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
    this.style.setProperty('--scrollY', `${window.scrollY}px`);
  }
}

customElements.define('cuf-header', CufHeader);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-header': CufHeader;
  }
}
