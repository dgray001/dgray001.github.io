// @ts-check

import {TestModule} from "../../test_module.js";
import {form_field_tests} from "./form_field.test.js";
import {bootstrap, it} from "../../test_util.js";
import {until} from "../../../scripts/util.js";
import {CufSelect} from "../../../__components/model/select/select.js";

const selector = 'cuf-select';

export const select_tests = new TestModule('select tests', [
  form_field_tests(selector),
], [
  it('should parse options array', async function() {
    /** @type {CufSelect} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['options', '["1", "2", "3"]'],
    ])});
    await until(() => !!comp.form_field);
    const select_element = comp.shadowRoot.querySelector('select');
    this.expect(!!select_element);
    this.expectObjectEqual(Array.from(select_element.children).map(child => {
      return child.getAttribute('value');
    }), ['1', '2', '3']);
    this.expectObjectEqual(comp.options, new Map([['1', '1'], ['2', '2'], ['3', '3']]));
  }),

  it('should parse options keyword', async function() {
    /** @type {CufSelect} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['options', 'countries'],
    ])});
    await until(() => !!comp.form_field);
    // @ts-ignore
    this.expectEqual(comp.form_field.value, 'USA');
    this.expectEqual(comp.form_field.children.length, 251);
    /** @type {HTMLOptionElement} */
    const selected_element = comp.shadowRoot.querySelector('option[selected="true"]');
    this.expect(!!selected_element);
    this.expectEqual(selected_element.value, 'USA');
    this.expectEqual(selected_element.innerText, 'United States');
  }),

  it('should handle form data', async function() {
    /** @type {CufSelect} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['options', 'countries'],
    ])});
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getFormData(), 'USA');
    this.expectEqual(comp.getDisplayableData(), 'United States');
    comp.clearFormData();
    this.expectEqual(comp.getFormData(), '');
    this.expectEqual(comp.getDisplayableData(), '');
  }),
], true);
