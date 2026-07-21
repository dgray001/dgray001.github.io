import { getPage, internalHref } from '@core/scripts/url';
import { trim } from '@core/scripts/util';
import { DwgElement } from '@core/components/dwg_element';
import { pageToName } from '../util';

import html from './navigation_pane.html';

import './navigation_pane.scss';

const default_links = [
  'about',
  'christifidelis',
  'articles_opinions',
  'priests',
  'parishes',
  'news',
  'contact',
  'donate',
  'login',
];

export class SjfNavigationPane extends DwgElement {
  private button_wrapper!: HTMLDivElement;
  private hamburger!: HTMLButtonElement;
  private background_grayed!: HTMLDivElement;
  private hamburger_button_wrapper!: HTMLDivElement;

  private use_hamburger = false;
  private sidebar_open = false;
  private last_clicked = 0;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements(
      'button_wrapper',
      'hamburger',
      'background_grayed',
      'hamburger_button_wrapper'
    );
  }

  protected override parsedCallback(): void {
    const links: string[] = JSON.parse(this.getAttribute('links') ?? 'null') ?? default_links;
    this.use_hamburger = document.body.classList.contains('mobile');
    if (this.use_hamburger) {
      this.hamburger.addEventListener('click', () => {
        if (Date.now() - this.last_clicked < 200) {
          return;
        }
        this.last_clicked = Date.now();
        this.setSidebarOpen(!this.sidebar_open);
      });
      this.background_grayed.addEventListener('click', () => {
        this.setSidebarOpen(false);
      });
    } else {
      this.button_wrapper.replaceChildren();
    }
    const curr_path = trim(getPage(), '/');
    for (const link of links) {
      this.createButton(link, curr_path);
    }
  }

  private setSidebarOpen(sidebar_open: boolean) {
    this.sidebar_open = sidebar_open;
    this.classList.toggle('sidebar-open', this.sidebar_open);
    if (this.sidebar_open) {
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      document.body.style.removeProperty('overflow');
    }
  }

  private createButton(link: string, curr_path: string): HTMLElement {
    const append_parent = this.use_hamburger ? this.hamburger_button_wrapper : this.button_wrapper;
    const label = pageToName(link);
    const link_el = link !== curr_path;
    const button = link_el ? document.createElement('a') : document.createElement('div');
    if (link_el) {
      (button as HTMLAnchorElement).href = internalHref(link);
      button.draggable = false;
    } else {
      button.classList.add('a');
    }
    button.classList.add('button');
    button.setAttribute('tabindex', this.use_hamburger ? '-1' : '2');
    const label_wrapper = document.createElement('span');
    label_wrapper.textContent = label;
    label_wrapper.classList.add('label');
    button.appendChild(label_wrapper);
    append_parent.appendChild(button);
    if (link === curr_path) {
      button.classList.add('current-el');
    }
    if (!link_el) {
      button.setAttribute('disabled', 'true');
      button.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
      });
    }
    return button;
  }
}

customElements.define('sjf-navigation-pane', SjfNavigationPane);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-navigation-pane': SjfNavigationPane;
  }
}
