import {fetchJson} from '../../../data/data_control';
import {scrollToElement} from '../../../scripts/util';
import {CufElement} from '../../cuf_element';
import {CufFaithFactCategory} from '../faith_fact_category/faith_fact_category';

import html from './faith_fact_category_list.html';

import './faith_fact_category_list.scss';
import '../faith_fact_category/faith_fact_category';

/** Data describing all Faith Facts */
export declare interface FaithFactsData {
  faith_fact_categories: CategoryData[];
}

interface CategoryData {
  category: string;
  category_display: string;
}

export class CufFaithFactCategoryList extends CufElement {
  private category_container: HTMLDivElement;
  private faith_facts_container: HTMLDivElement;

  private loading = false;
  private current_category = '';
  private category_els = new Map<string, HTMLDivElement>();
  loaded_json_data = new Map();

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('category_container');
    this.configureElement('faith_facts_container');
  }

  protected override async parsedCallback(): Promise<void> {
    const json_data = await fetchJson<FaithFactsData>('faith_facts/faith_facts.json');
    for (const category of json_data.faith_fact_categories) {
      const category_link = document.createElement('div');
      category_link.classList.add('category-link');
      category_link.id = category.category;
      const ripple = document.createElement('div');
      ripple.classList.add('ripple-container');
      const title_container = document.createElement('div');
      title_container.classList.add('title-container');
      title_container.id = category.category;
      title_container.innerText = category.category_display;
      category_link.appendChild(ripple);
      category_link.appendChild(title_container);
      this.category_container.appendChild(category_link);
      this.category_els.set(category.category, category_link);
      category_link.addEventListener('mousedown', (e) => {
        this.createRipple(category_link, e);
      });
      category_link.addEventListener('click', (e) => {
        this.setCategory(category_link, e);
      });
    }
    document.addEventListener('mouseup', this.removeRipples.bind(this));
    this.category_container.addEventListener('mouseover', () => {
      if (!document.body.classList.contains('mobile')) {
        document.body.style.overflow = 'hidden';
      }
    });
    this.category_container.addEventListener('mouseout', () => {
      document.body.style.overflow = 'auto';
    });
    this.category_container.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.category_container.scrollLeft += 0.5 * e.deltaY;
    });
  }

  async setCategory(button_wrapper: HTMLDivElement, e: MouseEvent) {
    if (this.loading) {
      return;
    }
    const category = button_wrapper.id;
    if (category === this.current_category) {
      scrollToElement(this);
      return;
    }

    this.loading = true;
    button_wrapper.classList.add('current-category');
    const last_wrapper = this.category_els.get(this.current_category);
    if (!!last_wrapper) {
      last_wrapper.classList.remove('current-category');
    }
    this.current_category = category;

    const new_category_element: CufFaithFactCategory = document.createElement('cuf-faith-fact-category');
    new_category_element.setAttribute('category', category);
    
    const previous_children: Element[] = [];
    for (const child of this.faith_facts_container.children) {
      previous_children.push(child);
    }
    if (this.loaded_json_data.has(category)) {
      new_category_element.json_data = this.loaded_json_data.get(category);
    }
    new_category_element.callback = this.renderChildCallback.bind(this, () => {
      for (const child of previous_children) {
        this.faith_facts_container.removeChild(child);
      }
    });
    this.faith_facts_container.appendChild(new_category_element);
  }

  renderChildCallback(remove_previous_child: () => void, json_data?: any) {
    if (remove_previous_child) {
      remove_previous_child();
    }
    if (!!json_data) {
      this.loaded_json_data.set(json_data['category'], json_data);
    }
    scrollToElement(this);
    this.loading = false;
  }

  createRipple(button_wrapper: HTMLDivElement, e: MouseEvent) {
    if (e.button !== 0) {
      return;
    }

    const circle = document.createElement('span');
    const diameter = Math.max(button_wrapper.clientWidth, button_wrapper.clientHeight);
    const radius = diameter / 2.0;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX + this.category_container.scrollLeft - button_wrapper.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY + document.body.scrollTop - button_wrapper.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple_container = button_wrapper.querySelector('.ripple-container');

    if (!!ripple_container) {
      for (const previous_ripple of ripple_container.getElementsByClassName('ripple')) {
        previous_ripple.remove();
      }
      ripple_container.appendChild(circle);
    }
  }

  removeRipples() {
    for (const ripple of this.querySelectorAll('.ripple')) {
      ripple.remove();
    }
  }
}

customElements.define('cuf-faith-fact-category-list', CufFaithFactCategoryList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-faith-fact-category-list': CufFaithFactCategoryList;
  }
}
