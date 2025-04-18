// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {CufFormSection} = await import(`../form_section/form_section.js?v=${version}`);
await import(`../../checkbox/checkbox.js?v=${version}`);

export class CufFormSectionMembershipRequest extends CufFormSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await super.connectedCallback();
    const res = await fetch(`/__components/model/form_sections/form_section_membership_request/form_section_membership_request.html?v=${version}`);
    const form_section = await this.setFormSectionAttributes(res, 'Membership Request (optional)');
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/model/form_sections/form_section_membership_request/form_section_membership_request.css?v=${version}`);
    this.shadowRoot.appendChild(stylesheet);
    form_section.form_fields.push(this.shadowRoot.getElementById('checkbox-member'));
    form_section.form_fields.push(this.shadowRoot.getElementById('checkbox-associate'));
    form_section.form_fields.push(this.shadowRoot.getElementById('checkbox-chapters'));
    form_section.form_fields.push(this.shadowRoot.getElementById('checkbox-start-chapter'));
  }

  /**
   * @typedef {Object} MembershipRequestFormData
   * @property {boolean} member
   * @property {boolean} associate
   * @property {boolean} join_chapter
   * @property {boolean} start_chapter
   */

  /**
   * Returns membership request data
   * @return {MembershipRequestFormData}
   */
  getFormData() {
    const member = this.shadowRoot.getElementById('checkbox-member').getFormData();
    const associate = this.shadowRoot.getElementById('checkbox-associate').getFormData();
    const join_chapter = this.shadowRoot.getElementById('checkbox-chapters').getFormData();
    const start_chapter = this.shadowRoot.getElementById('checkbox-start-chapter').getFormData();
    return {'member': member, 'associate': associate, 'join_chapter': join_chapter, 'start_chapter': start_chapter};
  }

  /**
   * Sets membership request data
   * @param {MembershipRequestFormData} data
   */
  setFormData(data) {
    this.shadowRoot.getElementById('checkbox-member').setFormData(data.member.toString());
    this.shadowRoot.getElementById('checkbox-associate').setFormData(data.associate.toString());
    this.shadowRoot.getElementById('checkbox-chapters').setFormData(data.join_chapter.toString());
    this.shadowRoot.getElementById('checkbox-start-chapter').setFormData(data.start_chapter.toString());
  }

  /**
   * Returns string indicating which boxes where checked
   * @return {string}
   */
  getDisplayableData() {
    const member = this.shadowRoot.getElementById('checkbox-member').getFormData();
    const associate = this.shadowRoot.getElementById('checkbox-associate').getFormData();
    const join_chapter = this.shadowRoot.getElementById('checkbox-chapters').getFormData();
    const start_chapter = this.shadowRoot.getElementById('checkbox-start-chapter').getFormData();
    const memberships = [];
    if (member == true.toString()) {
      memberships.push(' - I want to be a CUF member.');
    }
    if (associate == true.toString()) {
      memberships.push(' - I want to be a CUF associate.');
    }
    if (join_chapter == true.toString()) {
      memberships.push(' - I want information regarding CUF chapters in my area.');
    }
    if (start_chapter == true.toString()) {
      memberships.push(' - I want information on starting a new CUF chapter.');
    }
    return memberships.join(',');
  }
}

customElements.define("cuf-form-section-membership-request", CufFormSectionMembershipRequest);
