// @ts-check

import {UnitTest} from "./unit_test.js";
import {until} from "../scripts/util.js";

/**
 * Generates a dummy mock function that tracks number of callbacks
 * @param {Function=} callback
 */
export function mockFunction(callback = () => {}) {
  const mock = () => {
    callback();
    mock.calls++;
  }
  mock.calls = 0;
  return mock;
}

/**
 * Mocked fetch method
 * @callback mocked_fetch
 * @param {RequestInfo | URL} input
 * @param {RequestInit=} init
 * @returns {Promise<Response>}
 */

/**
 * Mocks the global fetch method
 * @param {mocked_fetch} return_data
 * @returns {{mocked_fetch: mocked_fetch, last_input?: RequestInfo | URL,
 *   last_init?: RequestInit, last_response?: Response, calls: number}} mocked fetch and calls
 */
export function mockFetch(return_data = (input, init) => {
  return new Promise(resolve => resolve(new Response(
    JSON.stringify({input: input, init: init}))));
}) {
  /**
   * @type {{mocked_fetch: mocked_fetch, last_input?: RequestInfo | URL,
   *   last_init?: RequestInit, last_response?: Response, calls: number}}
   */
  const return_object = {mocked_fetch: (input, init) => {
    const reponse_promise = return_data(input, init);
    reponse_promise.then(response => {
      return_object.last_response = response.clone();
    });
    return_object.last_input = input;
    return_object.last_init = init;
    return_object.calls++;
    return reponse_promise;
  }, calls: 0};
  const original_fetch = globalThis.fetch;
  globalThis.fetch = return_object.mocked_fetch;
  globalThis.afterTest = () => {
    globalThis.fetch = original_fetch;
  }
  return return_object;
}

/**
 * Creates UnitTest allowing calls to the expect functions
 * @param {string} test_name
 * @param {Function} test_runnable
 * @param {boolean=} potentially_flaky
 * @returns {UnitTest}
 */
export function it(test_name, test_runnable, potentially_flaky = false) {
  const unit_test = new UnitTest(test_name, () => {}, potentially_flaky);
  unit_test.test_runnable = test_runnable.bind(unit_test);
  return unit_test;
}

/**
 * Creates UnitTest whose test_runnable is parametrized
 * @param {string} test_name
 * @param {Array<{}>} parameters
 * @param {Function} test_runnable
 * @param {boolean=} potentially_flaky
 * @returns {UnitTest}
 */
export function pit(test_name, parameters, test_runnable, potentially_flaky = false) {
  const unit_test = new UnitTest(test_name, () => {}, potentially_flaky);
  const parametrized_runnable = async () => {
    for (const parameter of parameters) {
      globalThis.afterTest = () => {};
      await test_runnable.call(unit_test, parameter);
      globalThis.afterTest();
    }
  };
  unit_test.test_runnable = parametrized_runnable.bind(unit_test);
  unit_test.parametrized = parameters.length;
  return unit_test;
}

/**
 * Renders template in offscreen iframe and returns component and iframe dom
 * @param {string} component selector of component
 * @param {{attributes?: Map<string, string>, inner_html?: string}} args optional args
 * @returns {Promise<HTMLElement>} resolves when element fully parsed
 */
export async function bootstrap(component, args = {
  attributes: new Map(),
  inner_html: '',
}) {
  const wrapper = document.createElement('div');
  const comp = document.createElement(component);
  if (args.attributes) {
    for (const attribute of args.attributes) {
      comp.setAttribute(attribute[0], attribute[1]);
    }
  }
  comp.innerHTML = args.inner_html;
  wrapper.appendChild(comp);
  const dummy = document.createElement('div');
  dummy.innerHTML = 'dummy';
  wrapper.appendChild(dummy);
  document.body.appendChild(wrapper);
  // need to wait or shadow dom doesn't fill (sometimes)
  await new Promise(resolve => setTimeout(resolve, 100));
  wrapper.style.position = 'absolute';
  wrapper.style.right = '101vw';
  globalThis.afterTest = () => {
    wrapper.remove();
  };
  return comp;
}
