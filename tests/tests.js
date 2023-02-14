// @ts-check

import {DEV} from '../scripts/util.js';
import {TestModule} from './test_module.js';
import {scripts_module} from './scripts/scripts_module.js';
import {test_util_tests} from './test_util.test.js';

window.onload = () => {
  if (!DEV) {
    console.log('Should only run tests in dev.');
    return;
  }

  const test_module = new TestModule('CUF tests', [
    scripts_module,
    test_util_tests,
  ], [], true);

  const mappingAndHtml = test_module.getHTML(1);
  const test_suite = document.getElementById('test-suite');
  test_suite.innerHTML = mappingAndHtml.module_html;
  const test_mapping = mappingAndHtml.mapping;
  test_mapping.forEach((value, key) => {
    if (value.test_el) {
      console.log('ERROR: Duplicate test object in testing module.');
      return;
    }
    value.test_el = document.getElementById(key.toString());
    if (value.tree_depth) {
      value.test_el.style.marginLeft = `1rem`;
    }
    value.addEventListeners(test_mapping);
  });
};