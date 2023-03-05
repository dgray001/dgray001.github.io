// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {until} from "../../../../scripts/util.js";
import {form_section_tests} from "./form_section.test.js";
import {CufFormSectionNews} from "../../../../__components/model/form_sections/form_section_news/form_section_news.js";

const selector = 'cuf-form-section-news';

export const form_section_news_tests = new TestModule('form section news tests', [
  form_section_tests(selector),
], [
  it('should have correct name', async function() {
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    const label = comp.shadowRoot.querySelector('.form-section-label');
    this.expectEqual(label.innerHTML, 'Details');
  }),

  it('should have 3 form fields', async function() {
    /** @type {CufFormSectionNews} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    this.expectEqual(comp.form_fields.length, 3);
    this.expectEqual(comp.form_fields[0].id, 'news-title');
    this.expectEqual(comp.form_fields[1].id, 'news-titlelink');
    this.expectEqual(comp.form_fields[2].id, 'news-description');
  }),

  it('should return correct getFormData', async function() {
    /** @type {CufFormSectionNews} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'title';
    comp.form_fields[1].form_field.value = 'titlelink';
    comp.form_fields[2].form_field.value = 'description';
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'title': 'title', 'titlelink': 'titlelink', 'description': 'description'});
  }),

  it('should properly clear form data', async function() {
    /** @type {CufFormSectionNews} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'title';
    comp.form_fields[1].form_field.value = 'titlelink';
    comp.form_fields[2].form_field.value = 'description';
    comp.clearFormData();
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'title': '', 'titlelink': '', 'description': ''});
  }),

  it('should focus title field with focusFirst', async function() {
    /** @type {CufFormSectionNews} */
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
