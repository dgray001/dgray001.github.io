// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {until} from "../../../../scripts/util.js";
import {form_section_tests} from "./form_section.test.js";
import {CufFormSectionLaywitness} from "../../../../__components/model/form_sections/form_section_laywitness/form_section_laywitness.js";

const selector = 'cuf-form-section-laywitness';

export const form_section_laywitness_tests = new TestModule('form section laywitness tests', [
  form_section_tests(selector),
], [
  it('should have correct name', async function() {
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    const label = comp.shadowRoot.querySelector('.form-section-label');
    this.expectEqual(label.innerHTML, 'Details');
  }),

  it('should have 5 form fields', async function() {
    /** @type {CufFormSectionLaywitness} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    this.expectEqual(comp.form_fields.length, 5);
    this.expectEqual(comp.form_fields[0].id, 'laywitness-volume');
    this.expectEqual(comp.form_fields[1].id, 'laywitness-issue');
    this.expectEqual(comp.form_fields[2].id, 'laywitness-title');
    this.expectEqual(comp.form_fields[3].id, 'checkbox-addendum');
    this.expectEqual(comp.form_fields[4].id, 'checkbox-insert');
  }),

  it('should return correct getFormData', async function() {
    /** @type {CufFormSectionLaywitness} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = '12';
    comp.form_fields[1].form_field.value = '-4';
    comp.form_fields[2].form_field.value = 'title';
    comp.form_fields[3].form_field.checked = true;
    comp.form_fields[4].form_field.checked = true;
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'volume': 12, 'issue': -4, 'title': 'title', 'addendum': true, 'insert': true});
  }),

  it('should properly clear form data', async function() {
    /** @type {CufFormSectionLaywitness} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = '12';
    comp.form_fields[1].form_field.value = '-4';
    comp.form_fields[2].form_field.value = 'title';
    comp.form_fields[3].form_field.checked = true;
    comp.form_fields[4].form_field.checked = true;
    comp.clearFormData();
    const data = comp.getFormData();
    this.expect(isNaN(data.volume));
    this.expect(isNaN(data.issue));
    this.expectEqual(data.title, '');
    this.expectEqual(data.addendum, false);
    this.expectEqual(data.insert, false);
  }),

  it('should focus volume field with focusFirst', async function() {
    /** @type {CufFormSectionLaywitness} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.focusFirst();
    // Have to traverse the shadow doms
    this.expect(document.activeElement.shadowRoot.activeElement.shadowRoot.
      activeElement === comp.form_fields[0].form_field);
  }),
], true);