// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {until} from "../../../../scripts/util.js";
import {form_section_tests} from "./form_section.test.js";
import {CufFormSectionPaper} from "../../../../__components/model/form_sections/form_section_paper/form_section_paper.js";

const selector = 'cuf-form-section-paper';

export const form_section_paper_tests = new TestModule('form section paper tests', [
  form_section_tests(selector),
], [
  it('should have correct name', async function() {
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    const label = comp.shadowRoot.querySelector('.form-section-label');
    this.expectEqual(label.innerHTML, 'Details');
  }),

  it('should have 2 form fields', async function() {
    /** @type {CufFormSectionPaper} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    this.expectEqual(comp.form_fields.length, 2);
    this.expectEqual(comp.form_fields[0].id, 'paper-title');
    this.expectEqual(comp.form_fields[1].id, 'paper-description');
  }),

  it('should return correct getFormData', async function() {
    /** @type {CufFormSectionPaper} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'title';
    comp.form_fields[1].form_field.value = 'description';
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'title': 'title', 'description': 'description'});
  }),

  it('should properly clear form data', async function() {
    /** @type {CufFormSectionPaper} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'title';
    comp.form_fields[1].form_field.value = 'description';
    comp.clearFormData();
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'title': '', 'description': ''});
  }),

  it('should focus volume field with focusFirst', async function() {
    /** @type {CufFormSectionPaper} */
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
