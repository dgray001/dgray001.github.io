// @ts-check

import {TestModule} from "../../test_module.js";
import {form_field_tests} from "./form_field.test.js";
import {bootstrap, it} from "../../test_util.js";
import {until} from "../../../scripts/util.js";
import {CufTextArea} from "../../../__components/model/text_area/text_area.js";

const selector = 'cuf-text-area';

export const text_area_tests = new TestModule('text area tests', [
  form_field_tests(selector),
], [
  it('should parse min-rows', async function() {
    /** @type {CufTextArea} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['min-rows', '3'],
    ])});
    await until(() => !!comp.form_field);
    this.expect(comp.min_height >= 2);
    this.expectEqual(comp.form_field.style.height, comp.min_height + 'px');
  }),

  it('should handle form data', async function() {
    /** @type {CufTextArea} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['min-rows', '3'],
    ])});
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getFormData(), '');
    // @ts-ignore
    comp.form_field.value = 'some\ntext\narea\nvalue\nwith\nmany\nlines';
    this.expectEqual(comp.getFormData(), 'some\ntext\narea\nvalue\nwith\nmany\nlines');
    comp.clearFormData();
    this.expectEqual(comp.getFormData(), '');
  }),
], true);
