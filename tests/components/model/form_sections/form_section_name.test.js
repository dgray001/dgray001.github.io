// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {until} from "../../../../scripts/util.js";
import {form_section_tests} from "./form_section.test.js";
import {CufFormSectionName} from "../../../../__components/model/form_sections/form_section_name/form_section_name.js"; 

const selector = 'cuf-form-section-name';

export const form_section_name_tests = new TestModule('form section name tests', [
  form_section_tests(selector),
], [
  it('should have correct name', async function() {
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    const label = comp.shadowRoot.querySelector('.form-section-label');
    this.expectEqual(label.innerHTML, 'Name');
  }),

  it('should have 4 form fields', async function() {
    /** @type {CufFormSectionName} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    this.expectEqual(comp.form_fields.length, 4);
    this.expectEqual(comp.form_fields[0].id, 'name-prefix');
    this.expectEqual(comp.form_fields[1].id, 'name-first');
    this.expectEqual(comp.form_fields[2].id, 'name-last');
    this.expectEqual(comp.form_fields[3].id, 'name-suffix');
  }),

  it('should return correct getFormData', async function() {
    /** @type {CufFormSectionName} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'Mr.';
    comp.form_fields[1].form_field.value = 'first';
    comp.form_fields[2].form_field.value = 'last';
    comp.form_fields[3].form_field.value = 'suffix';
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'prefix': 'Mr.', 'first': 'first', 'last': 'last', 'suffix': 'suffix'});
  }),

  it('should return correct getDisplayableData', async function() {
    /** @type {CufFormSectionName} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'Mr.';
    comp.form_fields[1].form_field.value = 'first';
    comp.form_fields[2].form_field.value = 'last';
    comp.form_fields[3].form_field.value = 'suffix';
    const data = comp.getDisplayableData();
    this.expectEqual(data, 'Mr. first last suffix');
  }),
], true);