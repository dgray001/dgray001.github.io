import {CufForm} from '../../../common/form/form';
import {CufInputText} from '../../../common/form/form_field/input_text/input_text';
import {CufTextArea} from '../../../common/form/form_field/text_area/text_area';

import html from './jobs_available_form.html';

import './jobs_available_form.scss';
import '../../../common/form/form_field/input_text/input_text';
import '../../../common/form/form_field/text_area/text_area';

/** Data captured in a jobs available form */
export declare interface JobsAvailableData {
  title?: string;
  description?: string;
}

export class CufJobsAvailableForm extends CufForm<JobsAvailableData> {
  private job_title: CufInputText;
  private job_description: CufTextArea;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'job_title',
      'job_description',
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

  override getData(): JobsAvailableData {
    return {
      title: this.job_title.getData() || undefined,
      description: this.job_description.getData() || undefined,
    };
  }

  override setData(data: JobsAvailableData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-jobs-available-form', CufJobsAvailableForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-jobs-available-form': CufJobsAvailableForm;
  }
}
