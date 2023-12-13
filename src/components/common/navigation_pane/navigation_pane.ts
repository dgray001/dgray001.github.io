import {CufElement} from '../../cuf_element';

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
    const links: string[] = JSON.parse(this.getAttribute('links'));
    for (const link of links) {
      this.createButton(link);
    }
  }

  private createButton(link: string) {
    let label = '';
    switch(link) {
      case 'about':
        label = 'About';
        break;
      case 'news':
        label = 'CUF News';
        break;
      case 'contact':
        label = 'Contact';
        break;
      case 'donate':
        label = 'Donate';
        break;
      default:
        console.error('unknown link', link);
    }
    const button = document.createElement('a');
    button.href = `/${link}`;
    button.draggable = false;
    button.classList.add('button');
    button.textContent = label;
    this.button_wrapper.appendChild(button);
  }
}

customElements.define('cuf-navigation-pane', CufNavigationPane);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-navigation-pane': CufNavigationPane;
  }
}
