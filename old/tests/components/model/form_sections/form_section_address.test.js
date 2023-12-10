// @ts-check

import {TestModule} from "../../../test_module.js";
import {bootstrap, it} from "../../../test_util.js";
import {until} from "../../../../scripts/util.js";
import {form_section_tests} from "./form_section.test.js";
import {CufFormSectionAddress} from "../../../../__components/model/form_sections/form_section_address/form_section_address.js";

const selector = 'cuf-form-section-address';

export const form_section_address_tests = new TestModule('form section address tests', [
  form_section_tests(selector),
], [
  it('should have correct name', async function() {
    /** @type {CufFormSectionAddress} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    const label = comp.shadowRoot.querySelector('.form-section-label');
    this.expectEqual(label.innerHTML, 'Address');
  }),

  it('should have 6 form fields', async function() {
    /** @type {CufFormSectionAddress} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    this.expectEqual(comp.form_fields.length, 6);
    this.expectEqual(comp.form_fields[0].id, 'address-first');
    this.expectEqual(comp.form_fields[1].id, 'address-second');
    this.expectEqual(comp.form_fields[2].id, 'address-city');
    this.expectEqual(comp.form_fields[3].id, 'address-state');
    this.expectEqual(comp.form_fields[4].id, 'address-zip');
    this.expectEqual(comp.form_fields[5].id, 'address-country');
  }),

  it('should return correct getFormData', async function() {
    /** @type {CufFormSectionAddress} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    await until (() => !!comp.shadowRoot.querySelector('.form-section-label'));
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'address 1';
    comp.form_fields[1].form_field.value = 'address 2';
    comp.form_fields[2].form_field.value = 'city';
    comp.form_fields[3].form_field.value = 'state';
    comp.form_fields[4].form_field.value = 'zip';
    comp.form_fields[5].form_field.value = 'country';
    const data = comp.getFormData();
    this.expectObjectEqual(data, {'address1': 'address 1', 'address2': 'address 2', 'city': 'city', 'state': 'state', 'zip': 'zip', 'country': 'country'});
  }),

  it('should return correct getDisplayableData', async function() {
    /** @type {CufFormSectionAddress} */
    // @ts-ignore
    const comp = await bootstrap(selector);
    for (const form_field of comp.form_fields) {
      await until(() => !!form_field.form_field);
    }
    comp.form_fields[0].form_field.value = 'address 1';
    comp.form_fields[1].form_field.value = 'address 2';
    comp.form_fields[2].form_field.value = 'city';
    comp.form_fields[3].form_field.value = 'state';
    comp.form_fields[4].form_field.value = 'zip';
    comp.form_fields[5].form_field.value = 'country';
    const data = comp.getDisplayableData();
    this.expectObjectEqual(data, {'1': 'address 1 address 2', '2': 'city, state zip', '3': 'country'});
  }),
], true);
