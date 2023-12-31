import {CufElement} from '../../cuf_element';
import {CufForm} from '../../common/form/form';
import {JsonData, fetchJson} from '../../../data/data_control';
import {LaywitnessData} from '../../common/laywitness_list/laywitness_list';
import {FaithFactsData} from '../../common/faith_fact_category_list/faith_fact_category_list';

import html from './dashboard_section.html';
import {getListJsonData, getListLaywitnessData} from './util';

import './dashboard_section.scss';
import '../forms/jobs_available_form/jobs_available_form';
import '../forms/lay_witness_form/lay_witness_form';
import '../forms/news_form/news_form';
import '../forms/position_papers_form/position_papers_form';

type AdminFormType = 'cuf-jobs-available-form'|'cuf-lay-witness-form'|'cuf-news-form'|'cuf-position-papers-form';

type DashboardSectionData = JsonData|LaywitnessData|FaithFactsData;

export class CufDashboardSection extends CufElement {
  private section_title: HTMLButtonElement;
  private section_body: HTMLDivElement;
  private edit_button: HTMLButtonElement;
  private new_button_container: HTMLDivElement;
  private current_list: HTMLDivElement;
  private new_form: HTMLFormElement;

  private section_key = '';
  private body_open = false;
  private new_form_open = false;
  private new_form_button: HTMLButtonElement;
  private new_form_el: CufForm<any>;
  private current_data: DashboardSectionData;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('section_title');
    this.configureElement('section_body');
    this.configureElement('edit_button');
    this.configureElement('new_button_container');
    this.configureElement('current_list');
    this.configureElement('new_form');
  }

  protected override async parsedCallback(): Promise<void> {
    this.classList.add('section');
    this.section_key = this.getAttribute('section');
    this.section_title.innerText = this.sectionTitle();
    this.edit_button.innerText = `Edit ${this.sectionTitle()} [Not implemented]`;
    this.edit_button.disabled = true;
    this.setNewButton();
    this.setNewForm();
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
      this.new_form_button.innerText = `New ${this.sectionTitle()}`;
      this.new_form_button.addEventListener('click', () => {
        this.toggleNewForm(!this.new_form_open);
      });
      this.new_button_container.appendChild(this.new_form_button);
    } else if (['layWitness', 'positionPapers'].includes(this.section_key)) {
      const file_input = document.createElement('input');
      file_input.id = 'file-input';
      file_input.setAttribute('type', 'file');
      file_input.setAttribute('accept', 'application/pdf');
      const file_label = document.createElement('label');
      file_label.innerText = `Upload New ${this.sectionTitle()}`;
      file_label.setAttribute('for', 'file-input');
      file_input.addEventListener('change', () => {
        // TODO
      });
      this.new_button_container.appendChild(file_label);
      this.new_button_container.appendChild(file_input);
    } else {
      // TODO: implement for faith facts
    }
  }

  private setNewForm() {
    const form_tag_type = this.section_key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    const form_tag = `cuf-${form_tag_type}-form` as AdminFormType;
    this.new_form_el = document.createElement(form_tag);
    this.new_form.appendChild(this.new_form_el);
  }

  private async setCurrentList() {
    const json_key = this.section_key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
    this.current_data = await fetchJson<DashboardSectionData>(`${json_key}/${json_key}.json`);
    if (['jobs_available', 'news', 'position_papers'].includes(json_key)) {
      this.current_list.replaceChildren(...getListJsonData(this.current_data as JsonData));
    } else if (json_key === 'lay_witness') {
      this.current_list.replaceChildren(...getListLaywitnessData(this.current_data as LaywitnessData));
    } else if (json_key === 'faith_facts') {
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
