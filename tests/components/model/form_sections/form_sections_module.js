// @ts-check

import {TestModule} from '../../../test_module.js';
import {form_section_tests} from './form_section.test.js';
import {form_section_address_tests} from './form_section_address.test.js';
import {form_section_contact_tests} from './form_section_contact.test.js';
import {form_section_laywitness_tests} from './form_section_laywitness.test.js';
import {form_section_membership_request_tests} from './form_section_membership_request.test.js';
import {form_section_name_tests} from './form_section_name.test.js';
import {form_section_news_tests} from './form_section_news.test.js';
import {form_section_paper_tests} from './form_section_paper.test.js';

export const form_section_module = new TestModule('form section modules', [
  form_section_tests,
  form_section_address_tests,
  form_section_contact_tests,
  form_section_laywitness_tests,
  form_section_membership_request_tests,
  form_section_name_tests,
  form_section_news_tests,
  form_section_paper_tests,
], []);