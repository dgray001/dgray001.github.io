// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {until} from "../../../../scripts/util.js";
import {form_section_tests} from "./form_section.test.js";
import {CufFormSectionContact} from "../../../../__components/model/form_sections/form_section_contact/form_section_contact.js";

const selector = 'cuf-form-section-contact';

export const form_section_contact_tests = new TestModule('form section contact tests', [
  form_section_tests(selector),
], [
  it('should have correct name', async function() {
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    const label = comp.shadowRoot.querySelector('.form-section-label');
    this.expectEqual(label.innerHTML, 'Contact');
  }),

  it('should have 2 form fields', async function() {
    /** @type {CufFormSectionContact} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    this.expectEqual(comp.form_fields.length, 2);
    this.expectEqual(comp.form_fields[0].id, 'contact-email');
    this.expectEqual(comp.form_fields[1].id, 'contact-phone');
  }),

  it('should return correct getFormData', async function() {
    /** @type {CufFormSectionContact} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'email';
    comp.form_fields[1].form_field.value = 'phone';
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'email': 'email', 'phone': 'phone'});
    const displayable_data = comp.getDisplayableData();
    this.expectObjectEqual(data, {'email': 'email', 'phone': 'phone'});
  }),
], true);