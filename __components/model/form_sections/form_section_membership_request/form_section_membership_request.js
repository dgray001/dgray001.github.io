import {CufFormSection} from '../form_section/form_section.js';
import {CufCheckbox} from '../../checkbox/checkbox.js';

class CufFormSectionMembershipRequest extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_membership_request/form_section_membership_request.html');
    const form_section = await this.setFormSectionAttributes(res, 'Membership Request (optional)');
  }

  /**
   * Returns map of name data for the name form section
   * @return {{member:boolean, associate:boolean, join_chapter:boolean, start_chapter:boolean}}
   */
  getFormData() {
    const member = this.shadowRoot.getElementById('checkbox-member').getFormData();
    const associate = this.shadowRoot.getElementById('checkbox-associate').getFormData();
    const join_chapter = this.shadowRoot.getElementById('checkbox-chapters').getFormData();
    const start_chapter = this.shadowRoot.getElementById('checkbox-start-chapter').getFormData();
    return {'member': member, 'associate': associate, 'join_chapter': join_chapter, 'start_chapter': start_chapter};
  }
}

customElements.define("cuf-form-section-membership-request", CufFormSectionMembershipRequest);
