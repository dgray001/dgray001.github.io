import {CufFormSection} from '../form_section';
import {CufCheckbox} from '../../form_field/checkbox/checkbox';

import html from './form_section_membership.html';

import './form_section_membership.scss';
import '../../form_field/checkbox/checkbox';

/** Data describing which membership desire checkbox a person checked */
export declare interface MembershipData {
  member: boolean;
  associate: boolean;
  chapters: boolean;
  start_chapter: boolean;
}

export class CufFormSectionMembership extends CufFormSection<MembershipData, string> {
  private checkbox_member: CufCheckbox;
  private checkbox_associate: CufCheckbox;
  private checkbox_chapters: CufCheckbox;
  private checkbox_start_chapter: CufCheckbox;

  constructor() {
    super();
    this.configureFormSection(html, 'Membership Request (optional)', [
      'checkbox_member',
      'checkbox_associate',
      'checkbox_chapters',
      'checkbox_start_chapter',
    ]);
  }

  getData(): MembershipData {
    return {
      member: this.checkbox_member.getData(),
      associate: this.checkbox_associate.getData(),
      chapters: this.checkbox_chapters.getData(),
      start_chapter: this.checkbox_start_chapter.getData(),
    };
  }

  getOutputData(): string {
    const data = this.getData();
    const memberships: string[] = [];
    if (data.member) {
      memberships.push(' - I want to be a CUF member.');
    }
    if (data.associate) {
      memberships.push(' - I want to be a CUF associate.');
    }
    if (data.chapters) {
      memberships.push(' - I want information regarding CUF chapters in my area.');
    }
    if (data.start_chapter) {
      memberships.push(' - I want information on starting a new CUF chapter.');
    }
    return memberships.join(',');
  }

  setData(data: MembershipData): void {
    this.checkbox_member.setData(data.member);
    this.checkbox_associate.setData(data.associate);
    this.checkbox_chapters.setData(data.chapters);
    this.checkbox_start_chapter.setData(data.start_chapter);
  }
}

customElements.define('cuf-form-section-membership', CufFormSectionMembership);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-membership': CufFormSectionMembership;
  }
}
