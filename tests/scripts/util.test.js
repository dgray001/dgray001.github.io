import {TestModule} from "../test_module.js";
import {UnitTest} from "../unit_test.js";

export const util_tests = new TestModule('util tests', [], [
  new UnitTest('test test', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  }),
  new UnitTest('test test 2', async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
  }),
  new UnitTest('test test 3', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  }),
]);