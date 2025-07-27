import { JsonData, JsonDataContent } from '../../../../data/data_control';
import { recaptchaCallback } from '../../../../scripts/recaptcha';
import { until } from '../../../../scripts/util';
import {
  LaywitnessData,
  LaywitnessIssueData,
} from '../../../common/laywitness_list/laywitness_list';
import { CufElement } from '../../../cuf_element';
import { AdminFormType, CufDashboardSection, DashboardSectionData } from '../dashboard_section';
import {
  deleteChaptersData,
  deleteJsonData,
  deleteLayWitnessData,
  deleteLinksData,
  editChaptersData,
  editJsonData,
  editLayWitnessData,
  editLinksData,
} from '../util';
import { LayWitnessFormData } from '../../forms/lay_witness_form/lay_witness_form';
import { ChapterData } from '../../../common/chapters_list/chapters_list';
import { LinkGroupData, LinksData } from '../../../common/links_list/links_list';

import html from './edit_item.html';

import './edit_item.scss';
import '../../../common/dialog_box/confirm_dialog/confirm_dialog';

export class CufEditItem extends CufElement {
  private item_title: HTMLButtonElement;
  private title_label: HTMLSpanElement;
  private title_text: HTMLSpanElement;
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
  private file_input: HTMLInputElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('item_title');
    this.configureElement('title_label');
    this.configureElement('title_text');
    this.configureElement('item_details');
    this.configureElement('details');
    this.configureElement('edit_button');
    this.configureElement('delete_button');
    this.configureElement('edit_form');
    this.configureElement('status_message');
  }

  private getFile(): File | undefined {
    return this.file_input?.files[0];
  }

  async addConfigJsonData(el: CufDashboardSection, data: JsonDataContent, data_key: string) {
    await until(() => this.fully_parsed);
    this.data_key = data_key;
    let tag_key = el.getTagKey();
    const title = data.title ?? '-- no title --';
    this.title_text.innerText = title;
    if (this.classList.contains('subheader')) {
      this.title_label.innerText = '[Subheader]';
      tag_key = 'subheader';
    } else if (this.classList.contains('content-empty')) {
      this.title_label.innerText = '[Empty Content]';
      tag_key = 'subheader';
    }
    this.addItemDetails('Title:', data.title);
    if (el.getJsonKey() === 'news') {
      this.addItemDetails('Title Link:', data.titlelink);
    }
    this.addItemDetails('Description:', data.description);
    this.addEventListeners(el, data, tag_key);
  }

  async addConfigLaywitnessData(
    el: CufDashboardSection,
    data: LaywitnessIssueData,
    volume: number,
    data_key: string
  ) {
    await until(() => this.fully_parsed);
    this.data_key = data_key;
    const issue_title = `${volume}.${data.number}: ${data.title}`;
    let title = issue_title;
    if (data.insert) {
      this.classList.add('indent-1');
      title = `<span class="float-left">[Insert ${data.insert}]</span>${title}`;
    } else if (data.addendum) {
      this.classList.add('indent-1');
      title = `<span class="float-left">[Addendum ${data.addendum}]</span>${title}`;
    }
    this.item_title.innerHTML = title;
    this.addItemDetails('Title:', issue_title);
    const form_data: LayWitnessFormData = {
      volume,
      issue: data.number,
      title: data.title,
      insert: !!data.insert,
      addendum: !!data.addendum,
    };
    this.addEventListeners(el, form_data, el.getTagKey());
  }

  async addConfigChapterData(el: CufDashboardSection, data: ChapterData, data_key: string) {
    await until(() => this.fully_parsed);
    this.data_key = data_key;
    let tag_key = el.getTagKey();
    if (this.classList.contains('subheader')) {
      this.title_label.innerText = '[Subheader]';
      tag_key = 'subheader';
    } else if (this.classList.contains('content-empty')) {
      this.title_label.innerText = '[Empty Content]';
      tag_key = 'subheader';
    }
    this.title_text.innerText = data.name;
    this.addItemDetails('Name:', data.name);
    for (const line of data.other_lines) {
      this.addItemDetails('Other Link:', line);
    }
    this.addItemDetails('Website:', data.website);
    this.addItemDetails('Email:', data.email);
    this.addItemDetails('Facebook:', data.facebook);
    this.addEventListeners(el, data, tag_key);
  }

  async addConfigLinksData(
    el: CufDashboardSection,
    group: LinkGroupData,
    link: JsonDataContent,
    data_key: string
  ) {
    await until(() => this.fully_parsed);
    this.data_key = data_key;
    this.title_text.innerText = link.title;
    this.addItemDetails('Title', link.title);
    this.addItemDetails('Group', group.subheader);
    this.addItemDetails('Url', link.titlelink);
    this.addItemDetails('Description', link.description);
    this.addEventListeners(el, { group: group.subheader, ...link }, el.getTagKey());
  }

  private addEventListeners(el: CufDashboardSection, data: any, tag_key: string) {
    this.addEditForm(el, data, tag_key);
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
        confirm_dialog.setData({
          question: 'Are you sure you want to delete this?',
        });
        confirm_dialog.addEventListener('confirmed', async () => {
          const { new_data, data_deleted } = this.addDeleteData(el, el.getCurrentData(), data);
          if (!new_data) {
            return;
          }
          await el.sendSaveDataRequest(data, new_data, data_deleted, undefined, 'deleted a', false);
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
    if (details) {
      details_el.innerHTML = details;
    } else {
      details_el.innerText = '-- empty --';
      details_el.classList.add('undefined');
    }
    details_el.classList.add('details');
    this.details.appendChild(name_el);
    this.details.appendChild(details_el);
  }

  private addEditForm(el: CufDashboardSection, data: any, tag_key: string) {
    if (['prayer', 'involvement'].includes(tag_key)) {
      this.edit_form_el = document.createElement(`cuf-subheader-form`) as AdminFormType;
    } else {
      this.edit_form_el = document.createElement(`cuf-${tag_key}-form`) as AdminFormType;
    }
    if (['links'].includes(tag_key)) {
      // @ts-ignore
      this.edit_form_el.setJsonData(el.getCurrentData());
    }
    this.edit_form_el.setData(data);
    this.edit_form_el.setSubmitCallback(async () => {
      if (!this.edit_form_el.validate()) {
        this.errorStatus('Please fix the validation errors');
        return;
      }
      this.messageStatus('');
      await recaptchaCallback(
        async () => {
          const form_data: any = this.edit_form_el.getData();
          const { new_data, data_edited } = this.addEditData(el, el.getCurrentData(), form_data);
          if (!new_data) {
            return;
          }
          await el.sendSaveDataRequest(
            form_data,
            new_data,
            data_edited,
            this.getFile(),
            'edited a',
            true,
            data.titlelink
          );
        },
        this.edit_form_el.getSubmitButton(),
        this.status_message,
        'Editing'
      );
    });
    if (['layWitness', 'positionPapers'].includes(el.getSectionKey())) {
      const file_input_label = document.createElement('label');
      file_input_label.innerText = 'Replace File:';
      file_input_label.setAttribute('for', 'file-input');
      this.edit_form.appendChild(file_input_label);
      this.file_input = document.createElement('input');
      this.file_input.id = 'file-input';
      this.file_input.setAttribute('type', 'file');
      this.file_input.setAttribute('accept', 'application/pdf');
      this.edit_form.appendChild(this.file_input);
    }
    this.edit_form.appendChild(this.edit_form_el);
  }

  private addEditData(
    el: CufDashboardSection,
    old_data: DashboardSectionData,
    form_data: any
  ): { new_data: DashboardSectionData | undefined; data_edited?: any } {
    if (
      ['news', 'jobs_available', 'position_papers', 'prayer', 'involvement'].includes(
        el.getJsonKey()
      )
    ) {
      return editJsonData(
        el,
        old_data as JsonData<JsonDataContent>,
        form_data,
        this.data_key,
        this.getFile()?.name
      );
    } else if (el.getJsonKey() === 'lay_witness') {
      return editLayWitnessData(el, old_data as LaywitnessData, form_data, this.data_key);
    } else if (el.getJsonKey() === 'chapters') {
      return editChaptersData(el, old_data as JsonData<ChapterData>, form_data, this.data_key);
    } else if (el.getJsonKey() === 'links') {
      return editLinksData(old_data as LinksData, form_data, this.data_key);
    }
    console.error('Not implemented');
    return { new_data: old_data };
  }

  private addDeleteData(
    el: CufDashboardSection,
    old_data: DashboardSectionData,
    data_deleted: any
  ): { new_data: DashboardSectionData | undefined; data_deleted?: any } {
    if (
      ['news', 'jobs_available', 'position_papers', 'prayer', 'involvement'].includes(
        el.getJsonKey()
      )
    ) {
      return deleteJsonData(el, old_data as JsonData<JsonDataContent>, data_deleted, this.data_key);
    } else if (el.getJsonKey() === 'lay_witness') {
      return deleteLayWitnessData(el, old_data as LaywitnessData, data_deleted, this.data_key);
    } else if (el.getJsonKey() === 'chapters') {
      return deleteChaptersData(el, old_data as JsonData<ChapterData>, data_deleted, this.data_key);
    } else if (el.getJsonKey() === 'links') {
      return deleteLinksData(old_data as LinksData, this.data_key);
    } else if (el.getJsonKey() === 'faith_facts') {
      // TODO: implement
    }
    console.error('Not implemented');
    return { new_data: old_data };
  }

  private messageStatus(message: string): void {
    if (message) {
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
