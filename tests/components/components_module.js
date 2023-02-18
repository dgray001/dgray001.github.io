// @ts-check

import {TestModule} from '../test_module.js';
import {content_card_tests} from './content_card.test.js';
import {faith_fact_category_tests} from './faith_fact_category.test.js';
import {faith_fact_category_list_tests} from './faith_fact_category_list.test.js';
import {footer_contact_tests} from './footer_contact.test.js';
import {footer_panels_tests} from './footer_panels.test.js';
import {header_tests} from './header.test.js';
import {navigation_pane_tests} from './navigation_pane.test.js';
import {sidebar_tests} from './sidebar.test.js';
import {model_module} from './model/model_module.js';

export const components_module = new TestModule('components modules', [
  content_card_tests,
  faith_fact_category_tests,
  faith_fact_category_list_tests,
  footer_contact_tests,
  footer_panels_tests,
  header_tests,
  navigation_pane_tests,
  sidebar_tests,
  model_module,
], [], true);