import {JsonDataContent} from '../../../../data/data_control';
import {until} from '../../../../scripts/util';
import {CufElement} from '../../../cuf_element';

import html from './edit_item.html';

import './edit_item.scss';

export class CufEditItem extends CufElement {
  private item_title: HTMLButtonElement;
  private item_details: HTMLDivElement;
  private details: HTMLDivElement;
  private edit_button: HTMLButtonElement;
  private delete_button: HTMLButtonElement;

  private body_open = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('item_title');
    this.configureElement('item_details');
    this.configureElement('details');
    this.configureElement('edit_button');
    this.configureElement('delete_button');
  }

  async addConfigJsonData(data: JsonDataContent) {
    await until(() => this.fully_parsed);
    let title = data.title ?? '-- no title --';
    if (this.classList.contains('subheader')) {
      title = `<span class="float-left">[Subheader]</span>${title}`;
    } else if (this.classList.contains('content-empty')) {
      title = `<span class="float-left">[Empty Content]</span>${title}`;
    }
    this.item_title.innerHTML = title;
    this.addItemDetails('Title:', data.title);
    this.addItemDetails('Title Link:', data.titlelink);
    this.addItemDetails('Description:', data.description);
    this.item_title.addEventListener('click', () => {
      this.toggleBody(!this.body_open);
    });
    this.edit_button.addEventListener('click', () => {
      // TODO: toggle edit form
    });
    this.delete_button.addEventListener('click', () => {
      // TODO: confirm then delete
    });
  }

  private addItemDetails(name: string, details: string) {
    const name_el = document.createElement('div');
    name_el.innerText = name;
    name_el.classList.add('name');
    const details_el = document.createElement('div');
    if (!!details) {
      details_el.innerText = details;
    } else {
      details_el.innerText = '-- empty --';
      details_el.classList.add('undefined');
    }
    details_el.classList.add('details');
    this.details.appendChild(name_el);
    this.details.appendChild(details_el);
  }

  private toggleBody(body_open: boolean) {
    this.body_open = body_open;
    this.item_title.classList.toggle('open', body_open);
    this.item_details.classList.toggle('show', body_open);
  }
}

customElements.define('cuf-edit-item', CufEditItem);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-edit-item': CufEditItem;
  }
}
