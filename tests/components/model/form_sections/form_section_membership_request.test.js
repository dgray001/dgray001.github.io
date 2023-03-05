// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {until} from "../../../../scripts/util.js";
import {form_section_tests} from "./form_section.test.js";
import {CufFormSectionMembershipRequest} from "../../../../__components/model/form_sections/form_section_membership_request/form_section_membership_request.js";

const selector = 'cuf-form-section-membership-request';

export const form_section_membership_request_tests = new TestModule('form section membership request tests', [
  form_section_tests(selector),
], [
  it('should have correct name', async function() {
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    const label = comp.shadowRoot.querySelector('.form-section-label');
    this.expectEqual(label.innerHTML, 'Membership Request (optional)');
  }),

  it('should have 4 form fields', async function() {
    /** @type {CufFormSectionMembershipRequest} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    this.expectEqual(comp.form_fields.length, 4);
    this.expectEqual(comp.form_fields[0].id, 'checkbox-member');
    this.expectEqual(comp.form_fields[1].id, 'checkbox-associate');
    this.expectEqual(comp.form_fields[2].id, 'checkbox-chapters');
    this.expectEqual(comp.form_fields[3].id, 'checkbox-start-chapter');
  }),

  it('should return correct getFormData', async function() {
    /** @type {CufFormSectionMembershipRequest} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.checked = true;
    comp.form_fields[1].form_field.checked = true;
    comp.form_fields[2].form_field.checked = true;
    comp.form_fields[3].form_field.checked = true;
    const data = comp.getFormData();
    this.expectObjectEqual(data, {
      'member': 'true',
      'associate': 'true',
      'join_chapter': 'true',
      'start_chapter': 'true',
    });
  }),

  it('should return correct getDisplayableData', async function() {
    /** @type {CufFormSectionMembershipRequest} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.checked = true;
    comp.form_fields[1].form_field.checked = true;
    comp.form_fields[2].form_field.checked = true;
    comp.form_fields[3].form_field.checked = true;
    const data = comp.getDisplayableData();
    console.log(data);
    this.expectEqual(data, ' - I want to be a CUF member., - I want to be a CUF associate., - I want information regarding CUF chapters in my area., - I want information on starting a new CUF chapter.');
  }),
], true);
