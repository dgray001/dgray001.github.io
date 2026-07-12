import { CufElement } from '../../cuf_element';
import {
  JsonData,
  JsonDataContent,
  JsonDataSubheader,
  fetchJson,
} from '../../../data/data_control';
import { LaywitnessData } from '../../common/laywitness_list/laywitness_list';
import { FaithFactsData } from '../../common/faith_fact_category_list/faith_fact_category_list';
import { CufNewsForm, NewsFormData } from '../forms/news_form/news_form';
import { recaptchaCallback } from '../../../scripts/recaptcha';
import { apiPost } from '../../../scripts/api';
import {
  CufPositionPapersForm,
  PositionPapersFormData,
} from '../forms/position_papers_form/position_papers_form';
import {
  CufJobsAvailableForm,
  JobsAvailableData,
} from '../forms/jobs_available_form/jobs_available_form';
import { renameFile } from '../../../scripts/util';
import {
  addChaptersData,
  addLinksData,
  addNewJsonData,
  addNewLayWitnessData,
  getListChaptersData,
  getListJsonData,
  getListLaywitnessData,
  getListLinksData,
} from './util';
import { CufLayWitnessForm, LayWitnessFormData } from '../forms/lay_witness_form/lay_witness_form';
import { CufChaptersForm } from '../forms/chapters_form/chapters_form';
import { ChapterData } from '../../common/chapters_list/chapters_list';
import { CufSubheaderForm } from '../forms/subheader_form/subheader_form';
import { LinksData } from '../../common/links_list/links_list';
import { CufLinksForm, LinksFormData } from '../forms/links_form/links_form';
import { CufFaithFactsForm } from '../forms/faith_facts_form/faith_facts_form';

import html from './dashboard_section.html';

import './dashboard_section.scss';
import '../user_management/user_management';
import '../forms/jobs_available_form/jobs_available_form';
import '../forms/lay_witness_form/lay_witness_form';
import '../forms/news_form/news_form';
import '../forms/position_papers_form/position_papers_form';
import '../forms/chapters_form/chapters_form';
import '../forms/subheader_form/subheader_form';
import '../forms/links_form/links_form';
import '../forms/faith_facts_form/faith_facts_form';

/** All the different admin dashboard forms */
export type AdminFormType =
  | CufNewsForm
  | CufPositionPapersForm
  | CufJobsAvailableForm
  | CufLayWitnessForm
  | CufChaptersForm
  | CufSubheaderForm
  | CufLinksForm
  | CufFaithFactsForm;

/** All the different admin dashboard form datas */
export type AdminFormDataType = NewsFormData &
  PositionPapersFormData &
  JobsAvailableData &
  LayWitnessFormData &
  ChapterData &
  JsonDataContent &
  LinksFormData;

/** All the different admin dashboard form types */
export type DashboardSectionData =
  | JsonData<JsonDataContent>
  | LaywitnessData
  | FaithFactsData
  | JsonData<ChapterData>
  | LinksData;

export class CufDashboardSection extends CufElement {
  private section_title: HTMLButtonElement;
  private section_body: HTMLDivElement;
  private edit_button: HTMLButtonElement;
  private new_button_container: HTMLDivElement;
  private current_list: HTMLDivElement;
  private new_form: HTMLFormElement;
  private status_message: HTMLDivElement;

  private section_key = '';
  private tag_key = '';
  private json_key = '';
  private body_open = false;
  private edit_body_open = false;
  private new_form_open = false;
  private custom_section = false;
  private new_form_button: HTMLButtonElement;
  private new_form_el: AdminFormType;
  private current_data: DashboardSectionData;
  private file_input: HTMLInputElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('section_title');
    this.configureElement('section_body');
    this.configureElement('edit_button');
    this.configureElement('new_button_container');
    this.configureElement('current_list');
    this.configureElement('new_form');
    this.configureElement('status_message');
  }

  getSectionKey() {
    return this.section_key;
  }

  getJsonKey() {
    return this.json_key;
  }

  getTagKey() {
    return this.tag_key;
  }

  getFileInput() {
    return this.file_input?.files[0];
  }

  getCurrentData() {
    return this.current_data;
  }

  protected override async parsedCallback(): Promise<void> {
    this.classList.add('section');
    this.section_key = this.getAttribute('section');
    this.tag_key = this.section_key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    this.json_key = this.section_key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    this.section_title.innerText = this.sectionTitle();
    if (['userManagement'].includes(this.section_key)) {
      this.custom_section = true;
      const customSection = document.createElement(`cuf-${this.tag_key}`);
      this.section_body.replaceChildren(customSection);
    } else {
      this.edit_button.innerText = `Edit ${this.sectionTitle()}`;
      this.current_data = await fetchJson<DashboardSectionData>(
        `${this.json_key}/${this.json_key}.json`
      );
      this.setNewForm();
      this.setNewButton();
      await this.setCurrentList();
      this.edit_button.addEventListener('click', () => {
        this.currentListOpen(!this.edit_body_open);
      });
    }
    if (['faithFacts'].includes(this.section_key)) {
      this.section_title.disabled = true;
    } else {
      this.section_title.addEventListener('click', () => {
        this.setBodyOpen(!this.body_open);
      });
    }
  }

  private sectionTitle() {
    switch (this.section_key) {
      case 'userManagement':
        return 'User Management';
      case 'layWitness':
        return 'Lay Witness';
      case 'positionPapers':
        return 'Position Papers';
      case 'news':
        return 'News';
      case 'chapters':
        return 'CUF Chapters';
      case 'faithFacts':
        return 'Faith Facts [not implemented]';
      case 'jobsAvailable':
        return 'Jobs Available';
      case 'prayer':
        return 'CUF Prayer';
      case 'involvement':
        return 'Join Us Sidebar';
      case 'links':
        return 'Links';
      default:
        return 'Not Implemented';
    }
  }

  private setNewButton() {
    if (
      ['news', 'jobsAvailable', 'chapters', 'prayer', 'involvement', 'links'].includes(
        this.section_key
      )
    ) {
      this.new_form_button = document.createElement('button');
      this.new_form_button.addEventListener('click', () => {
        this.toggleNewForm(!this.new_form_open);
      });
      this.new_button_container.appendChild(this.new_form_button);
    } else if (['layWitness', 'positionPapers'].includes(this.section_key)) {
      this.file_input = document.createElement('input');
      this.file_input.id = 'file-input';
      this.file_input.setAttribute('type', 'file');
      this.file_input.setAttribute('accept', 'application/pdf');
      const file_label = document.createElement('label');
      file_label.innerText = `Upload New ${this.sectionTitle()}`;
      file_label.setAttribute('for', 'file-input');
      this.new_form_button = document.createElement('button');
      this.new_form_button.classList.add('hide');
      this.file_input.addEventListener('change', () => {
        const file = this.file_input.files[0];
        if (file.type !== 'application/pdf' || !file.name) {
          return;
        }
        this.toggleNewForm(true);
        this.new_form_button.classList.remove('hide');
        this.file_input.classList.add('hide');
        file_label.innerText = file.name;
      });
      this.new_form_button.addEventListener('click', () => {
        this.toggleNewForm(false);
        this.new_form_button.classList.add('hide');
        this.file_input.value = '';
        this.file_input.classList.remove('hide');
        file_label.innerText = `Upload New ${this.sectionTitle()}`;
      });
      this.new_button_container.appendChild(file_label);
      this.new_button_container.appendChild(this.file_input);
      this.new_button_container.appendChild(this.new_form_button);
    } else if (this.section_key === 'faithFacts') {
      console.error('implement');
      return;
    } else {
      console.error('not implemented');
      return;
    }
    this.toggleNewForm(false);
  }

  private setNewForm() {
    if (['prayer', 'involvement'].includes(this.json_key)) {
      this.new_form_el = document.createElement(`cuf-subheader-form`) as AdminFormType;
    } else {
      this.new_form_el = document.createElement(`cuf-${this.tag_key}-form`) as AdminFormType;
    }
    if (['links'].includes(this.json_key)) {
      // @ts-expect-error
      this.new_form_el.setJsonData(this.current_data);
    }
    this.new_form_el.setSubmitCallback(async () => {
      if (!this.new_form_el.validate()) {
        this.errorStatus('Please fix the validation errors');
        return;
      }
      this.messageStatus('');
      await recaptchaCallback(
        async () => {
          const form_data: any = this.new_form_el.getData();
          const { new_data, data_added } = this.addNewData(form_data);
          if (!new_data) {
            return;
          }
          await this.sendSaveDataRequest(
            form_data,
            new_data,
            data_added,
            this.getFileInput(),
            'added a new'
          );
        },
        this.new_form_el.getSubmitButton(),
        this.status_message,
        'Uploading'
      );
    });
    this.new_form.appendChild(this.new_form_el);
  }

  async sendSaveDataRequest(
    form_data: any,
    new_data: DashboardSectionData,
    data_added: any,
    file: File,
    success_message: string,
    upload_file = true,
    old_filename: string = undefined
  ) {
    if (['layWitness', 'positionPapers'].includes(this.section_key)) {
      let api_suffix = '';
      let filename = '';
      let post_data: any = file;
      if (this.section_key === 'layWitness') {
        filename = `${form_data.volume}/${form_data.volume}.${form_data.issue}-Lay-Witness`;
        if (form_data.addendum) {
          filename += `-Addendum${data_added.addendum}`;
        } else if (form_data.insert) {
          filename += `-Insert${data_added.insert}`;
        }
        filename += '.pdf';
      }
      if (upload_file) {
        // add or edit file
        api_suffix = 'file';
        if (this.section_key === 'layWitness' && !!post_data) {
          post_data = renameFile(post_data, filename);
        }
      } else {
        // delete file
        api_suffix = 'file_delete';
        if (this.section_key === 'positionPapers') {
          filename = data_added.titlelink ?? '';
        }
        post_data = { filename };
      }
      if (!upload_file || !!post_data) {
        if (upload_file && !!old_filename) {
          const r = await apiPost(`admin_dashboard/${this.json_key}_file_delete`, {
            filename: old_filename,
          });
          if (!r.success) {
            this.errorStatus(
              r.error_message ?? 'An unknown error occurred trying to delete the old file'
            );
            return;
          }
        }
        const r = await apiPost(`admin_dashboard/${this.json_key}_${api_suffix}`, post_data);
        if (!r.success) {
          this.errorStatus(
            r.error_message ?? 'An unknown error occurred trying to upload the file'
          );
          return;
        }
      }
    }
    this.current_data = new_data;
    const r = await apiPost(`admin_dashboard/${this.json_key}_data`, this.current_data);
    if (r.success) {
      await this.setCurrentList();
      this.successStatus(`Successfully ${success_message} ${this.sectionTitle().toLowerCase()}`);
      this.toggleNewForm(false);
    } else {
      this.errorStatus(r.error_message ?? 'An unknown error has occurrred');
    }
  }

  private addNewData(new_data: any): {
    new_data: DashboardSectionData | undefined;
    data_added?: any;
  } {
    if (
      ['news', 'jobs_available', 'position_papers', 'prayer', 'involvement'].includes(this.json_key)
    ) {
      return addNewJsonData(this, this.current_data as JsonData<JsonDataContent>, new_data);
    } else if (this.json_key === 'lay_witness') {
      return addNewLayWitnessData(this, this.current_data as LaywitnessData, new_data);
    } else if (this.json_key === 'chapters') {
      return addChaptersData(this.current_data as JsonData<ChapterData>, new_data);
    } else if (this.json_key === 'links') {
      return addLinksData(this.current_data as LinksData, new_data);
    }
    console.error('Not implemented');
    return { new_data: this.current_data };
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

  errorStatus(message: string): void {
    this.messageStatus(message);
    this.status_message.classList.add('error');
  }

  private async setCurrentList() {
    if (
      ['jobs_available', 'news', 'position_papers', 'prayer', 'involvement'].includes(this.json_key)
    ) {
      this.current_list.replaceChildren(
        ...getListJsonData(this, this.current_data as JsonData<JsonDataContent>)
      );
    } else if (this.json_key === 'lay_witness') {
      this.current_list.replaceChildren(
        ...getListLaywitnessData(this, this.current_data as LaywitnessData)
      );
    } else if (this.json_key === 'chapters') {
      this.current_list.replaceChildren(
        ...getListChaptersData(this, this.current_data as JsonData<ChapterData>)
      );
    } else if (this.json_key === 'links') {
      this.current_list.replaceChildren(...getListLinksData(this, this.current_data as LinksData));
    } else if (this.json_key === 'faith_facts') {
      console.error('faith facts not implemented');
    } else {
      console.error('not implemented');
    }
  }

  private setBodyOpen(body_open: boolean) {
    this.body_open = body_open;
    this.section_body.classList.toggle('show', body_open);
    this.section_title.classList.toggle('open', body_open);
    if (!this.body_open && !this.custom_section) {
      this.currentListOpen(false);
      this.toggleNewForm(false);
    }
  }

  private currentListOpen(edit_body_open: boolean) {
    this.edit_body_open = edit_body_open;
    this.current_list.classList.toggle('show', edit_body_open);
    this.edit_button.classList.toggle('open', edit_body_open);
    if (edit_body_open) {
      this.toggleNewForm(false);
    }
  }

  private toggleNewForm(new_form_open: boolean) {
    this.new_form_open = new_form_open;
    this.new_form.classList.toggle('show', new_form_open);
    this.new_form_button.classList.toggle('open', new_form_open);
    this.new_form_button.innerText = new_form_open ? 'Cancel' : `New ${this.sectionTitle()}`;
    if (new_form_open) {
      this.currentListOpen(false);
    } else {
      this.new_form_el.clearData();
    }
  }
}

customElements.define('cuf-dashboard-section', CufDashboardSection);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-dashboard-section': CufDashboardSection;
  }
}
