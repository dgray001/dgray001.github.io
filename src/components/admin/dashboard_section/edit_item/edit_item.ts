import {JsonData, JsonDataContent} from '../../../../data/data_control';
import {recaptchaCallback} from '../../../../scripts/recaptcha';
import {until} from '../../../../scripts/util';
import {LaywitnessData} from '../../../common/laywitness_list/laywitness_list';
import {CufElement} from '../../../cuf_element';
import {AdminFormType, CufDashboardSection, DashboardSectionData} from '../dashboard_section';
import {deleteJsonData, editJsonData, editLayWitnessData} from '../util';

import html from './edit_item.html';

import './edit_item.scss';
import '../../../common/dialog_box/confirm_dialog/confirm_dialog';

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
  private data_key = '';

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

  async addConfigJsonData(el: CufDashboardSection, data: JsonDataContent, data_key: string) {
    await until(() => this.fully_parsed);
    this.data_key = data_key;
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
    this.delete_button.addEventListener('click', async () => {
      await recaptchaCallback(async () => {
        const confirm_dialog = document.createElement('dwg-confirm-dialog');
        confirm_dialog.setData({question: 'Are you sure you want to delete this?'});
        confirm_dialog.addEventListener('confirmed', async () => {
          const {new_data, data_deleted} = this.addDeleteData(el, el.getCurrentData(), data);
          if (!new_data) {
            return;
          }
          await el.sendSaveDataRequest(data, new_data, data_deleted, undefined, 'deleted a');
        });
        this.appendChild(confirm_dialog);
      });
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

  private addEditForm(el: CufDashboardSection, data: any) {
    this.edit_form_el = document.createElement(`cuf-${el.getTagKey()}-form`) as AdminFormType;
    this.edit_form_el.setData(data);
    this.edit_form_el.setSubmitCallback(async () => {
      if (!this.edit_form_el.validate()) {
        this.errorStatus('Please fix the validation errors');
        return;
      }
      this.messageStatus('');
      await recaptchaCallback(async () => {
        const form_data: any = this.edit_form_el.getData();
        const {new_data, data_edited} = this.addEditData(el, el.getCurrentData(), form_data);
        if (!new_data) {
          return;
        }
        await el.sendSaveDataRequest(form_data, new_data, data_edited, undefined, 'edited a');
      });
    });
    this.edit_form.appendChild(this.edit_form_el);
  }

  private addEditData(el: CufDashboardSection, old_data: DashboardSectionData, form_data: any):
    {new_data: DashboardSectionData|undefined, data_edited?: any}
  {
    if (['news', 'jobs_available', 'position_papers'].includes(el.getJsonKey())) {
      return editJsonData(el, old_data as JsonData, form_data, this.data_key);
    } else if (el.getJsonKey() === 'lay_witness') {
      return editLayWitnessData(el, old_data as LaywitnessData, form_data);
    }
    console.error('Not implemented');
    return {new_data: old_data};
  }

  private addDeleteData(el: CufDashboardSection, old_data: DashboardSectionData, data_deleted: any):
    {new_data: DashboardSectionData|undefined, data_deleted?: any}
  {
    if (['news', 'jobs_available', 'position_papers'].includes(el.getJsonKey())) {
      return deleteJsonData(el, old_data as JsonData, data_deleted, this.data_key);
    } else if (el.getJsonKey() === 'lay_witness') {
      //return editLayWitnessData(el, old_data as LaywitnessData, form_data);
    }
    console.error('Not implemented');
    return {new_data: old_data};
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
