// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it, pit} from "../../../test_util.js";
import {CufFormSection} from "../../../../__components/model/form_sections/form_section/form_section.js";
import {until} from "../../../../scripts/util.js";
import {UnitTest} from "../../../unit_test.js";

/** @param {string} selector */
export const form_section_tests = (selector) => {
  /** @type {Array<UnitTest>} */
  const implementation_tests = selector === 'cuf-form-section' ? [
    // Tests only for CufFormSection
    it('returns error for getFormData', async function() {
    }),
  ] : [
    // Tests only for implementations of CufFormSection
    it('sets helper text property', async function() {
    }),
  ];

  return new TestModule('form section tests', [], [
    // Tests for both CufFormSection and implementations of CufFormSection
    it('component is truthy', async function() {
      const comp = await bootstrap(selector);
      this.expectEqual(!!comp, true);
    }),

    ...implementation_tests,
  ], true);
};