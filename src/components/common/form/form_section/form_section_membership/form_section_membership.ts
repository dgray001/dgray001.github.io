import {CufFormSection} from '../form_section';
import {CufCheckbox} from '../../form_field/checkbox/checkbox';

import html from './form_section_membership.html';

import './form_section_membership.scss';
import '../../form_field/checkbox/checkbox';

interface MembershipData {
  //
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
    return {};
  }

  setData(data: MembershipData): void {
    //
  }
}

customElements.define('cuf-form-section-membership', CufFormSectionMembership);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-form-section-membership': CufFormSectionMembership;
  }
}
