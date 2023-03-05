// @ts-check
'use strict';

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {DEV} = await import(`/scripts/util.js?v=${version}`);

import {TestModule} from './test_module.js';
import {components_module} from './components/components_module.js';
import {scripts_module} from './scripts/scripts_module.js';
import {test_util_tests} from './test_util.test.js';

window.onload = () => {
  if (!DEV) {
    throw new Error('Should only run tests in dev.');
  }

  const test_module = new TestModule('CUF tests', [
    components_module,
    scripts_module,
    test_util_tests,
  ], [], true);

  const mappingAndHtml = test_module.getHTML(1);
  const test_suite = document.getElementById('test-suite');
  if (!test_suite) {
    throw new Error('Test suite is null.');
  }
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
      if (value instanceof TestModule) {
        //value.closeModule();
      }
    }
    value.addEventListeners(test_mapping);
  });
};
