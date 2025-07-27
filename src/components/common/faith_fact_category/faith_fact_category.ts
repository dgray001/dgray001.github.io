import { fetchJson } from '../../../data/data_control';
import { CufElement } from '../../cuf_element';

import html from './faith_fact_category.html';

import './faith_fact_category.scss';
import '../faith_fact/faith_fact';

/** Data describing a category of faith facts */
export declare interface FaithFactCategoryData {
  category: string;
  category_display: string;
  faith_facts: FaithFactData[];
}

/** Data describing a single faith fact */
export declare interface FaithFactData {
  title: string;
  question?: string;
  summary: string;
}

export class CufFaithFactCategory extends CufElement {
  private subtitle: HTMLHeadingElement;
  private faith_fact_list: HTMLDivElement;

  json_data: FaithFactCategoryData;
  callback: (data: FaithFactCategoryData) => void;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('subtitle');
    this.configureElement('faith_fact_list');
  }

  protected override async parsedCallback(): Promise<void> {
    const category_name = this.attributes.getNamedItem('category')?.value || '';
    if (!this.json_data) {
      this.json_data = await fetchJson(`faith_facts/${category_name}.json`);
    }
    for (const faith_fact of this.json_data.faith_facts) {
      const faith_fact_el = document.createElement('cuf-faith-fact');
      faith_fact_el.classList.add('faith-fact');
      faith_fact_el.setFaithFact(faith_fact, category_name);
      this.faith_fact_list.appendChild(faith_fact_el);
    }
    if (this.callback) {
      this.callback(this.json_data);
    }
  }
}

customElements.define('cuf-faith-fact-category', CufFaithFactCategory);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-faith-fact-category': CufFaithFactCategory;
  }
}
