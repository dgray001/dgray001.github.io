import {CufForm} from '../../../common/form/form';

import html from './jobs_available_form.html';

import './jobs_available_form.scss';

/** Data captured in a jobs available form */
export declare interface JobsAvailableData {
  //
}

export class CufJobsAvailableForm extends CufForm<JobsAvailableData> {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  override getData(): JobsAvailableData {
    return {
      //
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
