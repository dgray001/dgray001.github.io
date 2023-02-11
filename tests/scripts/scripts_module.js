import {TestModule} from '../test_module.js';
import {util_tests} from './util.test.js';

export const scripts_module = new TestModule('scripts modules', [
  util_tests,
], []);