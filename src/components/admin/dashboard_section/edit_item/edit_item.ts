import {JsonDataContent} from '../../../../data/data_control';
import {recaptchaCallback} from '../../../../scripts/recaptcha';
import {until} from '../../../../scripts/util';
import {CufElement} from '../../../cuf_element';
import {AdminFormDataType, AdminFormType, CufDashboardSection} from '../dashboard_section';

import html from './edit_item.html';

import './edit_item.scss';

export class CufEditItem extends CufElement {
  private item_title: HTMLButtonElement;
  private item_details: HTMLDivElement;
  private details: HTMLDivElement;
  private edit_button: HTMLButtonElement;
  private delete_button: HTMLButtonElement;
  private edit_form: HTMLFormElement;
  private status_message: HTMLDivElement;

  private body_open = false;
  private edit_open = false;
  private edit_form_el: AdminFormType;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('item_title');
    this.configureElement('item_details');
    this.configureElement('details');
    this.configureElement('edit_button');
    this.configureElement('delete_button');
    this.configureElement('edit_form');
    this.configureElement('status_message');
  }

  async addConfigJsonData(el: CufDashboardSection, data: JsonDataContent) {
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
    this.addEditForm(el, data);
    this.toggleEditForm(false);
    this.item_title.addEventListener('click', () => {
      this.toggleBody(!this.body_open);
    });
    this.edit_button.addEventListener('click', () => {
      this.toggleEditForm(!this.edit_open);
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
      details_el.innerHTML = details;
    } else {
      details_el.innerText = '-- empty --';
      details_el.classList.add('undefined');
    }
    details_el.classList.add('details');
    this.details.appendChild(name_el);
    this.details.appendChild(details_el);
  }

  private addEditForm(el: CufDashboardSection, data: JsonDataContent) {
    this.edit_form_el = document.createElement(`cuf-${el.getTagKey()}-form`) as AdminFormType;
    this.edit_form_el.setData(data as AdminFormDataType);
    this.edit_form_el.setSubmitCallback(async () => {
      if (!this.edit_form_el.validate()) {
        this.errorStatus('Please fix the validation errors');
        return;
      }
      this.messageStatus('');
      await recaptchaCallback(async () => {
      });
    });
    this.edit_form.appendChild(this.edit_form_el);
  }

  private messageStatus(message: string): void {
    if (!!message) {
      this.status_message.innerHTML = message;
      this.status_message.classList.remove('hide');
    } else {
      this.status_message.classList.add('hide');
    }
    this.status_message.classList.remove('error');
    this.status_message.classList.remove('success');
  }

  private successStatus(message: string): void {
    this.messageStatus(message);
    this.status_message.classList.add('success');
  }

  private errorStatus(message: string): void {
    this.messageStatus(message);
    this.status_message.classList.add('error');
  }

  private toggleBody(body_open: boolean) {
    this.body_open = body_open;
    this.item_title.classList.toggle('open', body_open);
    this.item_details.classList.toggle('show', body_open);
  }

  private toggleEditForm(edit_open: boolean) {
    this.edit_open = edit_open;
    this.edit_button.innerText = edit_open ? 'Cancel' : 'Edit';
    this.edit_form.classList.toggle('show', edit_open);
    this.edit_button.classList.toggle('open', edit_open);
  }
}

customElements.define('cuf-edit-item', CufEditItem);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-edit-item': CufEditItem;
  }
}
