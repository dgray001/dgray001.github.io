import {CufForm} from '../../../common/form/form';
import {CufInputText} from '../../../common/form/form_field/input_text/input_text';
import {CufTextArea} from '../../../common/form/form_field/text_area/text_area';

import html from './news_form.html';

import './news_form.scss';
import '../../../common/form/form_field/input_text/input_text';
import '../../../common/form/form_field/text_area/text_area';

/** Data captured in a news form */
export declare interface NewsFormData {
  title?: string;
  titlelink?: string;
  description?: string;
}

export class CufNewsForm extends CufForm<NewsFormData> {
  private news_title: CufInputText;
  private news_titlelink: CufInputText;
  private news_description: CufTextArea;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'news_title',
      'news_titlelink',
      'news_description',
    ]);
    this.configureElement('submit_button');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.submit_button.addEventListener('click', this.submit_callback);
  }

  setSubmitCallback(submit_callback: () => Promise<void>) {
    this.submit_callback = submit_callback;
  }

  override getData(): NewsFormData {
    return {
      title: this.news_title.getData() || undefined,
      titlelink: this.news_titlelink.getData() || undefined,
      description: this.news_description.getData() || undefined,
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
