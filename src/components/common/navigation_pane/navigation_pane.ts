import {getPage} from '../../../scripts/url';
import {trim} from '../../../scripts/util';
import {CufElement} from '../../cuf_element';
import {pageToName} from '../util';

import html from './navigation_pane.html';

import './navigation_pane.scss';

export class CufNavigationPane extends CufElement {
  private button_wrapper: HTMLDivElement;
  private hamburger: HTMLInputElement;
  private background_grayed: HTMLDivElement;
  private hamburger_button_wrapper: HTMLDivElement;

  private use_hamburger = false;
  private sidebar_open = false;
  private last_clicked = 0;
  private tab_index_buttons: HTMLElement[] = [];

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('button_wrapper');
    this.configureElement('hamburger');
    this.configureElement('background_grayed');
    this.configureElement('hamburger_button_wrapper');
  }

  protected override parsedCallback(): void {
    const links: string[] = JSON.parse(this.getAttribute('links')) ??
      ['about', 'news', 'apostolic_activities', 'contact', 'donate'];
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
      if (link === 'apostolic_activities') {
        this.addHeaderButton(link, curr_path, ['information_services', 'lay_witness', 'faith_and_life_series']);
      } else {
        this.createButton(link, curr_path);
      }
    }
  }

  private setSidebarOpen(sidebar_open: boolean) {
    this.sidebar_open = sidebar_open;
    this.classList.toggle('sidebar-open', this.sidebar_open);
    if (this.sidebar_open) {
      document.body.style.setProperty('overflow', 'hidden');
      for (const button of this.tab_index_buttons) {
        button.setAttribute('tabIndex', '2');
      }
    } else {
      document.body.style.removeProperty('overflow');
      for (const button of this.tab_index_buttons) {
        button.setAttribute('tabIndex', '-1');
      }
    }
  }

  private addHeaderButton(header: string, curr_path: string, sub_els: string[]) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('dropdown');
    const header_button = this.createButton(header, curr_path, true, wrapper);
    header_button.classList.add('header-el');
    wrapper.style.setProperty('--num-items', (sub_els.length + 1).toString());
    wrapper.addEventListener('mouseenter', () => {
      wrapper.classList.add('hovered');
    });
    wrapper.addEventListener('mouseleave', () => {
      wrapper.classList.remove('hovered');
    });
    for (const sub_el of sub_els) {
      const button = this.createButton(sub_el, curr_path, false, wrapper);
      button.classList.add('dropdown-el');
    }
    if (this.use_hamburger) {
      this.hamburger_button_wrapper.appendChild(wrapper);
    } else {
      this.button_wrapper.appendChild(wrapper);
    }
  }

  private createButton(link: string, curr_path: string, header_el = false,
    append_parent: HTMLDivElement = this.use_hamburger ? this.hamburger_button_wrapper : this.button_wrapper
  ): HTMLElement {
    const label = pageToName(link);
    const link_el = link !== curr_path && !header_el;
    const button = link_el ? document.createElement('a') : document.createElement('div');
    if (link_el) {
      (button as HTMLAnchorElement).href = `/${link}`;
      button.draggable = false;
    } else {
      button.classList.add('a');
    }
    button.classList.add('button');
    if (!this.use_hamburger) {
      button.setAttribute('tabindex', '2');
    } else if (!header_el) {
      button.setAttribute('tabindex', '-1');
      this.tab_index_buttons.push(button);
    } else {
      button.setAttribute('tabindex', '-1');
    }
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

customElements.define('cuf-navigation-pane', CufNavigationPane);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-navigation-pane': CufNavigationPane;
  }
}
