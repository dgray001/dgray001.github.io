// @ts-check

import {TestModule} from "../../test_module.js";
import {bootstrap, it, pit} from "../../test_util.js";
import {CufFormField} from "../../../__components/model/form_field/form_field.js";
import {until} from "../../../scripts/util.js";
import {UnitTest} from "../../unit_test.js";

/** @param {string} selector */
export const form_field_tests = (selector) => {
  /** @type {Array<UnitTest>} */
  const implementation_tests = selector === 'cuf-form-field' ? [
    // Tests only for CufFormField
    it('returns error for getFormData', async function() {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector);
      await until(() => !!comp.form_field_wrapper);
      this.expectEqual(comp.getFormData(), 'error');
    }),
  ] : [
    // Tests only for implementations of CufFormField
    it('sets helper text property', async function() {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {attributes: new Map([
        ['id', 'someid'],
        ['helper-text', 'some default helper text'],
      ])});
      await until(() => !!comp.form_field);
      const helpertext = comp.form_field_helper_text;
      const helpertext_from_dom = comp.shadowRoot.querySelector('.helper-text');
      this.expect(helpertext === helpertext_from_dom);
      this.expectEqual(helpertext.innerText, 'some default helper text');
    }),

    it('sets form field property', async function() {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {attributes: new Map([
        ['id', 'someid'],
      ])});
      await until(() => !!comp.form_field);
      const formfield = comp.form_field;
      const formfield_from_dom = comp.shadowRoot.querySelector('.form-field');
      this.expect(formfield === formfield_from_dom);
      this.expectEqual(formfield.id, 'someid');
      this.expectEqual(formfield.getAttribute('name'), 'someid');
    }),

    it('updates form field wrapper', async function() {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {attributes: new Map([
        ['id', 'someid'],
      ])});
      await until(() => !!comp.form_field);
      const wrapper = comp.form_field_wrapper;
      this.expectEqual(wrapper.children.length, 4); // label, stylesheet, input, helper text
      this.expectEqual(wrapper.children[3], comp.form_field_helper_text);
    }),

    it('adds focus class to wrapper', async function() {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {attributes: new Map([
        ['id', 'someid'],
      ])});
      await until(() => !!comp.form_field);
      const wrapper = comp.form_field_wrapper;
      this.expect(!wrapper.classList.contains('focused'));
      comp.form_field.focus({
        preventScroll: true
      });
      this.expect(wrapper.classList.contains('focused'));
      comp.form_field.blur();
      this.expect(!wrapper.classList.contains('focused'));
    }),

    pit('properly validates', [
      {validators: '[]', input: '', pass: true},
      {validators: '["required"]', input: 'something', pass: true},
      {validators: '["required"]', input: '', pass: false},
      {validators: '["required", "integer"]', input: 'not integer', pass: false},
      {validators: '["required", "integer"]', input: '34', pass: true},
    ], async function({validators, input, pass}) {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {attributes: new Map([
        ['id', 'someid'],
        ['validators', validators],
        ['helper-text', 'some default helper text'],
      ])});
      await until(() => !!comp.form_field);
      const helpertext = comp.form_field_helper_text;
      comp.getFormData = () => input;
      comp.validate();
      this.expect(comp.valid === pass);
      if (pass) {
        this.expectEqual(helpertext.innerText, 'some default helper text');
      }
      else {
        this.expect(helpertext.innerText !== 'some default helper text');
      }
    }),
  ];

  return new TestModule('form field tests', [], [
    // Tests for both CufFormField and implementations of CufFormField
    it('component is truthy', async function() {
      const comp = await bootstrap(selector);
      this.expectEqual(!!comp, true);
    }),

    it('parses attributes', async function() {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {
        attributes: new Map([
          ['id', 'someid'],
          ['helper-text', 'some default helper text'],
          ['flex_option', '3'],
          ['label', 'some\nlabel'],
          ['validators', '["required", "some validator"]'],
        ]),
      });
      await until(() => !!comp.form_field_wrapper);
      const styles = getComputedStyle(comp);
      // Takes an unknown amount of time (sometimes instant, sometimes a couple seconds)
      await until(() => styles.flex !== null && styles.flex !== '0 1 auto');
      this.expectEqual(comp.id, 'someid');
      this.expect(comp.classList.contains('form-field'));
      this.expectEqual(comp.default_helper_text, 'some default helper text');
      this.expectEqual(styles.flex, '3 0 0px');
      this.expectEqual(comp.label, 'somelabel');
      this.expectObjectEqual(comp.validators, new Set(['required', 'some validator']));
    }),

    it('sets wrapper property and id', async function() {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {
        attributes: new Map([
          ['id', 'someid'],
        ]),
      });
      await until(() => !!comp.form_field_wrapper);
      const wrapper = comp.form_field_wrapper;
      const wrapper_from_dom = comp.shadowRoot.querySelector('#someid-wrapper');
      this.expect(wrapper === wrapper_from_dom);
      this.expectEqual(wrapper.id, 'someid-wrapper');
      this.expectEqual(wrapper_from_dom.id, 'someid-wrapper');
    }),

    pit('sets label property and inner text', [
      {validators: '[]', inner_text: 'somelabel'},
      {validators: '["required"]', inner_text: 'somelabel *'},
    ], async function({validators, inner_text}) {
      /** @type {CufFormField} */
      // @ts-ignore
      const comp = await bootstrap(selector, {attributes: new Map([
        ['id', 'someid'],
        ['label', 'some\nlabel'],
        ['validators', validators],
      ])});
      await until(() => !!comp.form_field_wrapper);
      const label = comp.form_field_label;
      const label_from_dom = comp.shadowRoot.querySelector('.form-field-label');
      this.expect(label === label_from_dom);
      this.expectEqual(label.innerText, inner_text);
    }),

    ...implementation_tests,
  ], true);
};
