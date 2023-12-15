import {getPage} from '../../../scripts/url';
import { trim } from '../../../scripts/util';
import {CufElement} from '../../cuf_element';
import {pageToName} from '../util';

import html from './navigation_pane.html';

import './navigation_pane.scss';

export class CufNavigationPane extends CufElement {
  private button_wrapper: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('button_wrapper');
  }

  protected override parsedCallback(): void {
    const links: string[] = JSON.parse(this.getAttribute('links')) ?? ['about', 'news', 'contact', 'donate'];
    const curr_path = trim(getPage(), '/');
    for (const link of links) {
      const button = this.createButton(link);
      if (link === curr_path) {
        button.classList.add('current-el');
        button.addEventListener('click', (e: MouseEvent) => {
          e.preventDefault();
        });
      }
    }
  }

  private createButton(link: string): HTMLAnchorElement {
    let label = pageToName(link);
    const button = document.createElement('a');
    button.href = `/${link}`;
    button.draggable = false;
    button.classList.add('button');
    button.textContent = label;
    this.button_wrapper.appendChild(button);
    return button;
  }
}

customElements.define('cuf-navigation-pane', CufNavigationPane);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-navigation-pane': CufNavigationPane;
  }
}
