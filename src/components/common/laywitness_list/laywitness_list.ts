import { fetchJson } from '../../../data/data_control';
import { CufElement } from '../../cuf_element';

import html from './laywitness_list.html';

import './laywitness_list.scss';

/** Data describing all Lay Witness pubs */
export declare interface LaywitnessData {
  volumes: LaywitnessVolumeData[];
}

/** Data describing a lay witness volume */
export declare interface LaywitnessVolumeData {
  number: number;
  year: number;
  issues: LaywitnessIssueData[];
}

/** Data describing a lay witness issue */
export declare interface LaywitnessIssueData {
  number: number;
  title: string;
  insert?: number;
  addendum?: number;
}

export class CufLaywitnessList extends CufElement {
  private data: LaywitnessData;

  constructor() {
    super();
    this.htmlString = html;
  }

  protected override async parsedCallback(): Promise<void> {
    this.classList.add('section');
    this.data = await fetchJson<LaywitnessData>('lay_witness/lay_witness.json');
    for (const v of this.data.volumes) {
      const volume_element = document.createElement('div');
      volume_element.classList.add('section-content');
      volume_element.id = `volume-${v.number}`;
      const paragraph_element = document.createElement('p');
      const volume_title = document.createElement('strong');
      volume_title.innerText = `Vol. ${v.number} (${v.year})`;
      paragraph_element.appendChild(volume_title);
      const issues = document.createElement('ul');
      issues.classList.add('no-list-style');
      issues.role = 'list';
      for (const issue of v.issues) {
        const issue_element = document.createElement('li');
        const issue_link = document.createElement('a');
        issue_link.innerHTML = `Issue ${issue.number} — ${issue.title}`;
        issue_link.target = '_blank';
        issue_link.href =
          `/data/lay_witness/${v.number}/` + `${v.number}.${issue.number}-Lay-Witness`;
        if (issue.addendum) {
          issue_link.href += `-Addendum${issue.addendum}`;
          issue_link.innerHTML = `Addendum: ${issue.title}`;
          issue_link.classList.add('addendum');
        } else if (issue.insert) {
          issue_link.href += `-Insert${issue.insert}`;
          issue_link.innerHTML = `Insert: ${issue.title}`;
          issue_link.classList.add('insert');
        }
        issue_link.href += '.pdf';
        issue_element.appendChild(issue_link);
        issues.appendChild(issue_element);
      }
      paragraph_element.appendChild(issues);
      volume_element.appendChild(paragraph_element);
      this.appendChild(volume_element);
    }
  }
}

customElements.define('cuf-laywitness-list', CufLaywitnessList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-laywitness-list': CufLaywitnessList;
  }
}
