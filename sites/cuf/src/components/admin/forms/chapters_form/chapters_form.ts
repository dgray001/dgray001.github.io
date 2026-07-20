import { ChapterData } from '../../../common/chapters_list/chapters_list';
import { DwgForm } from '@core/components/form/form';
import { DwgInputText } from '@core/components/form/form_field/input_text/input_text';
import { DwgStringList } from '@core/components/form/form_field/string_list/string_list';

import html from './chapters_form.html';

import './chapters_form.scss';
import '@core/components/form/form_field/input_text/input_text';
import '@core/components/form/form_field/string_list/string_list';

export class CufChaptersForm extends DwgForm<ChapterData> {
  private chapter_name: DwgInputText;
  private other_lines: DwgStringList;
  private chapter_website: DwgInputText;
  private chapter_email: DwgInputText;
  private chapter_facebook: DwgInputText;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'chapter_name',
      'other_lines',
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
      other_lines: this.other_lines.getData(),
      website: this.chapter_website.getData() || undefined,
      email: this.chapter_email.getData() || undefined,
      facebook: this.chapter_facebook.getData() || undefined,
    };
  }

  protected override _setData(data: ChapterData): void {
    this.chapter_name.setData(data.name ?? '');
    this.other_lines.setData(data.other_lines);
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
