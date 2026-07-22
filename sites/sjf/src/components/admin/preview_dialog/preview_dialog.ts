import { DwgDialogBox } from '@core/components/dialog_box/dialog_box';

import html from './preview_dialog.html';

import './preview_dialog.scss';

interface PreviewDialogData {
  html: string;
}

export class SjfPreviewDialog extends DwgDialogBox<PreviewDialogData> {
  private preview_container!: HTMLDivElement;
  private close_button!: HTMLButtonElement;

  private preview_html = '';

  constructor() {
    super();
    this.configureElements('preview_container', 'close_button');
  }

  override getHTML(): string {
    return html;
  }

  getData(): PreviewDialogData {
    return { html: this.preview_html };
  }

  setData(data: PreviewDialogData, parsed?: boolean): void {
    this.preview_html = data.html;
    if (!parsed && !this.fully_parsed) {
      return;
    }
    this.preview_container.innerHTML = this.preview_html;
    this.close_button.addEventListener('click', () => {
      this.closeDialog();
    });
  }
}

customElements.define('sjf-preview-dialog', SjfPreviewDialog);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-preview-dialog': SjfPreviewDialog;
  }
}
