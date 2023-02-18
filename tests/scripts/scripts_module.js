// @ts-check

import {TestModule} from '../test_module.js';
import {util_tests} from './util.test.js';
import {validation_tests} from './validation.test.js';
import {recaptcha_tests} from './recaptcha.test.js';
import {datalist_tests} from './datalist.test.js';

export const scripts_module = new TestModule('scripts modules', [
  util_tests,
  validation_tests,
  recaptcha_tests,
  datalist_tests,
], [], true);