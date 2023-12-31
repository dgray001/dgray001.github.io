import {CufElement} from '../../cuf_element';
import {JsonData, fetchJson} from '../../../data/data_control';
import {LaywitnessData} from '../../common/laywitness_list/laywitness_list';
import {FaithFactsData} from '../../common/faith_fact_category_list/faith_fact_category_list';
import {CufNewsForm} from '../forms/news_form/news_form';
import {recaptchaCallback} from '../../../scripts/recaptcha';
import {apiPost} from '../../../scripts/api';
import {CufPositionPapersForm} from '../forms/position_papers_form/position_papers_form';
import {CufJobsAvailableForm} from '../forms/jobs_available_form/jobs_available_form';

import html from './dashboard_section.html';
import {getListJsonData, getListLaywitnessData} from './util';

import './dashboard_section.scss';
import '../forms/jobs_available_form/jobs_available_form';
import '../forms/lay_witness_form/lay_witness_form';
import '../forms/news_form/news_form';
import '../forms/position_papers_form/position_papers_form';

type AdminFormType = CufNewsForm | CufPositionPapersForm | CufJobsAvailableForm;

type DashboardSectionData = JsonData|LaywitnessData|FaithFactsData;

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
  private new_form_open = false;
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

  protected override async parsedCallback(): Promise<void> {
    this.classList.add('section');
    this.section_key = this.getAttribute('section');
    this.tag_key = this.section_key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    this.json_key = this.section_key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
    this.section_title.innerText = this.sectionTitle();
    this.edit_button.innerText = `Edit ${this.sectionTitle()} [Not implemented]`;
    this.edit_button.disabled = true;
    this.setNewForm();
    this.setNewButton();
    await this.setCurrentList();
    if (['faithFacts'].includes(this.section_key)) {
      this.section_title.disabled = true;
    } else {
      this.section_title.addEventListener('click', () => {
        this.setBodyOpen(!this.body_open);
      });
    }
  }

  private sectionTitle() {
    switch(this.section_key) {
      case 'layWitness':
        return 'Lay Witness';
      case 'positionPapers':
        return 'Position Papers';
      case 'news':
        return 'News';
      case 'faithFacts':
        return 'Faith Facts [not implemented]';
      case 'jobsAvailable':
        return 'Jobs Available';
      default:
        return 'Unknown';
    }
  }

  private setNewButton() {
    if (['news', 'jobsAvailable'].includes(this.section_key)) {
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
    } else {
      // TODO: implement for faith facts
    }
    this.toggleNewForm(false);
  }

  private setNewForm() {
    this.new_form_el = document.createElement(`cuf-${this.tag_key}-form`) as AdminFormType;
    this.new_form_el.setSubmitCallback(async () => {
      if (!this.new_form_el.validate()) {
        this.errorStatus('Please fix the validation errors');
        return;
      }
      recaptchaCallback(async () => {
        if (['layWitness', 'positionPapers'].includes(this.section_key)) {
          const r = await apiPost(`admin_dashboard/${this.json_key}_file`, this.file_input.files[0]);
          if (!r.success) {
            this.errorStatus(r.error_message ?? 'An unknown error occurred trying to upload the file');
            return;
          }
        }
        this.current_data = this.addNewData(this.new_form_el.getData());
        const r = await apiPost(`admin_dashboard/${this.json_key}_data`, this.current_data);
        if (r.success) {
          this.successStatus(`Successfully added a new ${this.sectionTitle().toLowerCase()}`);
          this.toggleNewForm(false);
        } else {
          this.errorStatus(r.error_message ?? 'An unknown error has occurrred');
        }
      }, this.new_form_el.getSubmitButton(), this.status_message, 'Uploading');
    });
    this.new_form.appendChild(this.new_form_el);
  }

  private addNewData(new_data: any): DashboardSectionData {
    if (['news', 'jobs_available', 'position_papers'].includes(this.json_key)) {
      const d = this.current_data as JsonData;
      if (this.json_key === 'position_papers') {
        new_data.titlelink = `/data/position_papers/${this.file_input.files[0].name}`;
      }
      d.content.unshift(new_data);
      return d;
    } else if ([].includes(this.json_key)) {
      //
    }
    console.error('Not implemented');
    return this.current_data;
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

  private async setCurrentList() {
    this.current_data = await fetchJson<DashboardSectionData>(`${this.json_key}/${this.json_key}.json`);
    if (['jobs_available', 'news', 'position_papers'].includes(this.json_key)) {
      this.current_list.replaceChildren(...getListJsonData(this.current_data as JsonData));
    } else if (this.json_key === 'lay_witness') {
      this.current_list.replaceChildren(...getListLaywitnessData(this.current_data as LaywitnessData));
    } else if (this.json_key === 'faith_facts') {
      // TODO: implement
    }
  }

  private setBodyOpen(body_open: boolean) {
    this.body_open = body_open;
    this.section_body.classList.toggle('show', body_open);
  }

  private toggleNewForm(new_form_open: boolean) {
    this.new_form_open = new_form_open;
    this.new_form.classList.toggle('show', new_form_open);
    this.new_form_button.classList.toggle('open', new_form_open);
    this.new_form_button.innerText = new_form_open ? 'Cancel' : `New ${this.sectionTitle()}`;
    if (new_form_open) {
      // TODO: close edit list
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
