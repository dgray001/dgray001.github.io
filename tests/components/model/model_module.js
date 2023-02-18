// @ts-check

import {TestModule} from '../../test_module.js';
import {checkbox_tests} from './checkbox.test.js';
import {form_field_tests} from './form_field.test.js';
import {HTML_base_element_tests} from './HTML_base_element.test.js';
import {input_text_tests} from './input_text.test.js';
import {select_tests} from './select.test.js';
import {text_area_tests} from './text_area.test.js';
import {form_section_module} from './form_sections/form_sections_module.js';

export const model_module = new TestModule('model modules', [
  checkbox_tests,
  form_field_tests('cuf-form-field'),
  HTML_base_element_tests,
  input_text_tests,
  select_tests,
  text_area_tests,
  form_section_module,
], [], true);