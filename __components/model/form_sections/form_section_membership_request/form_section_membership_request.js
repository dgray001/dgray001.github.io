import {CufFormSection} from '../form_section/form_section.js';
import {CufCheckbox} from '../../checkbox/checkbox.js';

class CufFormSectionMembershipRequest extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch('./__components/model/form_sections/form_section_membership_request/form_section_membership_request.html');
    const form_section = await this.setFormSectionAttributes(res, 'Membership Request [optional]');
  }
}

customElements.define("cuf-form-section-membership-request", CufFormSectionMembershipRequest);
