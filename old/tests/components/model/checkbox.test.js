// @ts-check

import {TestModule} from "../../test_module.js";
import {form_field_tests} from "./form_field.test.js";
import {bootstrap, it} from "../../test_util.js";
import {until} from "../../../scripts/util.js";
import {CufCheckbox} from "../../../__components/model/checkbox/checkbox.js";

const selector = 'cuf-checkbox';

export const checkbox_tests = new TestModule('checkbox tests', [
  form_field_tests(selector),
], [
  it('should return whether checkbox is checked', async function() {
    /** @type {CufCheckbox} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getFormData(), 'false');
    comp.form_field.click();
    this.expectEqual(comp.getFormData(), 'true');
    comp.form_field.click();
    this.expectEqual(comp.getFormData(), 'false');
  }),

  it('should set checked to false when field cleared', async function() {
    /** @type {CufCheckbox} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getFormData(), 'false');
    comp.form_field.click();
    this.expectEqual(comp.getFormData(), 'true');
    comp.clearFormData();
    this.expectEqual(comp.getFormData(), 'false');
  }),
], true);
