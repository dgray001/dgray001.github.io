import {CufForm} from '../../../common/form/form';

import html from './news_form.html';

import './news_form.scss';

/** Data captured in a news form */
export declare interface NewsFormData {
  //
}

export class CufNewsForm extends CufForm<NewsFormData> {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  override getData(): NewsFormData {
    return {
      //
    };
  }

  override setData(data: NewsFormData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-news-form', CufNewsForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-news-form': CufNewsForm;
  }
}
