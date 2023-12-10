// @ts-check

import {TestModule} from "../../test_module.js";
import {form_field_tests} from "./form_field.test.js";
import {bootstrap, it} from "../../test_util.js";
import {until} from "../../../scripts/util.js";
import {CufInputText} from "../../../__components/model/input_text/input_text.js";

const selector = 'cuf-input-text';

export const input_text_tests = new TestModule('input text tests', [
  form_field_tests(selector),
], [
  it('should parse autocomplete', async function() {
    /** @type {CufInputText} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['autocomplete', 'some autocomplete'],
    ])});
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getAttribute('autocomplete'), null);
    this.expectEqual(comp.form_field.getAttribute('autocomplete'), 'some autocomplete');
  }),

  it('should parse datatype', async function() {
    /** @type {CufInputText} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['datatype', 'some datatype'],
    ])});
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getAttribute('datatype'), null);
    this.expectEqual(comp.getAttribute('type'), null);
    this.expectEqual(comp.form_field.getAttribute('type'), 'some datatype');
  }),

  it('should parse datalist array', async function() {
    /** @type {CufInputText} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['datalist', '["1", "2", "3"]'],
    ])});
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getAttribute('datalist'), null);
    this.expect(!comp.use_data_value);
    const datalist_element = comp.shadowRoot.querySelector('#someid_datalist');
    this.expect(!!datalist_element);
    this.expectObjectEqual(Array.from(datalist_element.children).map(child => {
      return child.getAttribute('data_value');
    }), ['1', '2', '3']);
    this.expectEqual(comp.form_field.getAttribute('list'), 'someid_datalist');
    // @ts-ignore
    comp.form_field.value = '1';
    this.expectEqual(comp.getFormData(), '1');
    this.expect(comp.datalist_options[1].value === comp.datalist_values[1]);
  }),

  it('should parse datalist keyword', async function() {
    /** @type {CufInputText} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['datalist', 'countries'],
    ])});
    await until(() => !!comp.form_field);
    this.expectEqual(comp.getAttribute('datalist'), null);
    this.expect(comp.use_data_value);
    const datalist_element = comp.shadowRoot.querySelector('#someid_datalist');
    this.expect(!!datalist_element);
    // @ts-ignore
    this.expectEqual(comp.form_field.value, 'United States');
    this.expectEqual(datalist_element.children.length, 251);
    this.expectEqual(comp.datalist_options.length, 251);
    this.expectEqual(comp.datalist_values.length, 251);
    this.expect(comp.datalist_options[12].value !== comp.datalist_values[12]);
  }),

  it('should handle form data', async function() {
    /** @type {CufInputText} */
    // @ts-ignore
    const comp = await bootstrap(selector, {attributes: new Map([
      ['id', 'someid'],
      ['datalist', 'countries'],
    ])});
    await until(() => !!comp.form_field);
    await until(() => !!comp.shadowRoot.querySelector('#someid_datalist'));
    // @ts-ignore
    this.expectEqual(comp.form_field.value, 'United States');
    this.expectEqual(comp.getFormData(), 'USA');
    comp.clearFormData();
    this.expectEqual(comp.getFormData(), '');
  }),
], true);
