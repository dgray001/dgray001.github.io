import {ChapterData} from '../../../common/chapters_list/chapters_list';
import {CufForm} from '../../../common/form/form';
import {CufInputText} from '../../../common/form/form_field/input_text/input_text';

import html from './chapters_form.html';

import './chapters_form.scss';

export class CufChaptersForm extends CufForm<ChapterData> {
  private chapter_name: CufInputText;
  private chapter_website: CufInputText;
  private chapter_email: CufInputText;
  private chapter_facebook: CufInputText;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'chapter_name',
      'chapter_website',
      'chapter_email',
      'chapter_facebook',
    ]);
    this.configureElement('submit_button');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.submit_button.addEventListener('click', this.submit_callback);
  }

  setSubmitCallback(submit_callback: () => Promise<void>) {
    this.submit_callback = submit_callback;
  }

  getSubmitButton(): HTMLButtonElement {
    return this.submit_button;
  }

  override getData(): ChapterData {
    return {
      name: this.chapter_name.getData(),
      other_lines: [], // TODO: implement
      website: this.chapter_website.getData() || undefined,
      email: this.chapter_email.getData() || undefined,
      facebook: this.chapter_facebook.getData() || undefined,
    };
  }

  protected override _setData(data: ChapterData): void {
    this.chapter_name.setData(data.name ?? '');
    // this.chapter_other_lines.setData(data.other_lines);
    this.chapter_website.setData(data.website ?? '');
    this.chapter_email.setData(data.email ?? '');
    this.chapter_facebook.setData(data.facebook ?? '');
  }
}

customElements.define('cuf-chapters-form', CufChaptersForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-chapters-form': CufChaptersForm;
  }
}
