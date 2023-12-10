// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {CufFormSection} from "../../../../__components/model/form_sections/form_section/form_section.js";
import {until} from "../../../../scripts/util.js";
import {UnitTest} from "../../../unit_test.js";

/** @param {string} selector */
export const form_section_tests = (selector) => {
  /** @type {Array<UnitTest>} */
  const implementation_tests = selector === 'cuf-form-section' ? [
    // Tests only for CufFormSection
    it('setFormSectionAttributes adds label', async function() {
      /** @type {CufFormSection} */
      // @ts-ignore
      const comp = await bootstrap(selector);
      await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
      const label = comp.shadowRoot.querySelector('.form-section-label');
      this.expect(!label.innerHTML);
      await comp.setFormSectionAttributes({text: () => new Promise(
        resolve => resolve('some inner html'))}, 'form section name');
    }),
  ] : [
    // Tests only for implementations of CufFormSection
    it('called setFormSectionAttributes', async function() {
      /** @type {CufFormSection} */
      // @ts-ignore
      const comp = await bootstrap(selector);
      await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
      const label = comp.shadowRoot.querySelector('.form-section-label');
      await until (() => !!label.innerHTML);
      this.expect(!!label.innerHTML);
    }),

    it('has nonempty form_fields array', async function() {
      /** @type {CufFormSection} */
      // @ts-ignore
      const comp = await bootstrap(selector);
      await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
      const label = comp.shadowRoot.querySelector('.form-section-label');
      await until (() => !!label.innerHTML);
      this.expect(!!comp.form_fields.length);
    }),

    it('should validate form section if all form fields valid', async function() {
      /** @type {CufFormSection} */
      // @ts-ignore
      const comp = await bootstrap(selector);
      await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
      for (const form_field of comp.form_fields) {
        // all valid
        form_field.validate = () => true;
      }
      comp.validate();
      this.expect(comp.valid);
    }),

    it('should invalidate form section if one form field is invalid', async function() {
      /** @type {CufFormSection} */
      // @ts-ignore
      const comp = await bootstrap(selector);
      await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
      for (const form_field of comp.form_fields) {
        // all valid
        form_field.validate = () => true;
      }
      comp.form_fields[0].validate = () => false;
      comp.validate();
      this.expect(!comp.valid);
    }),
  ];

  return new TestModule('form section tests', [], [
    // Tests for both CufFormSection and implementations of CufFormSection
    it('component is truthy', async function() {
      const comp = await bootstrap(selector);
      this.expectEqual(!!comp, true);
    }),

    it('has form section elements', async function() {
      const comp = await bootstrap(selector);
      await until (() => !!comp.shadowRoot.querySelector('.section-wrapper'));
      const section = comp.shadowRoot.querySelector('.form-section');
      const label = comp.shadowRoot.querySelector('.form-section-label');
      const wrapper = comp.shadowRoot.querySelector('.section-wrapper');
      this.expectEqual(!!section, true);
      this.expectEqual(!!label, true);
      this.expectEqual(!!wrapper, true);
    }),

    ...implementation_tests,
  ], true);
};
