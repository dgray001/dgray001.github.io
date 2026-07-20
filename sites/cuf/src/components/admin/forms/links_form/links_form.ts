import { DwgForm } from '@core/components/form/form';
import { DwgInputText } from '@core/components/form/form_field/input_text/input_text';
import { DwgTextArea } from '@core/components/form/form_field/text_area/text_area';
import { LinksData } from '@core/components/links_list/links_list';
import { until } from '@core/scripts/util';

import html from './links_form.html';

import './links_form.scss';
import '@core/components/form/form_field/input_text/input_text';
import '@core/components/form/form_field/text_area/text_area';

/** Data captured in a links form */
export declare interface LinksFormData {
  group: string;
  title: string;
  titlelink: string;
  description?: string;
}

export class CufLinksForm extends DwgForm<LinksFormData> {
  private links_group: DwgInputText;
  private links_title: DwgInputText;
  private links_titlelink: DwgInputText;
  private links_description: DwgTextArea;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm(['links_group', 'links_title', 'links_titlelink', 'links_description']);
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

  override getData(): LinksFormData {
    return {
      group: this.links_group.getData() || undefined,
      title: this.links_title.getData() || undefined,
      titlelink: this.links_titlelink.getData() || undefined,
      description: this.links_description.getData() || undefined,
    };
  }

  protected override _setData(data: LinksFormData): void {
    this.links_group.setData(data.group ?? '');
    this.links_title.setData(data.title ?? '');
    this.links_titlelink.setData(data.titlelink ?? '');
    this.links_description.setData(data.description ?? '');
  }

  async setJsonData(data: LinksData) {
    await until(() => this.fully_parsed);
    this.links_group.setDatalist(JSON.stringify(data.groups.map((g) => g.subheader)));
  }
}

customElements.define('cuf-links-form', CufLinksForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-links-form': CufLinksForm;
  }
}
