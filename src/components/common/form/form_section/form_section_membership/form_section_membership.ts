import {CufFormSection} from '../form_section';
import {CufCheckbox} from '../../form_field/checkbox/checkbox';

import html from './form_section_membership.html';

import './form_section_membership.scss';
import '../../form_field/checkbox/checkbox';

interface MembershipData {
  member: boolean;
  associate: boolean;
  chapters: boolean;
  start_chapter: boolean;
}

export class CufFormSectionMembership extends CufFormSection<MembershipData> {
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
