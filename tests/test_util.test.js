// @ts-check

import {TestModule} from "./test_module.js";
import {bootstrap, mockFunction, it, pit, mockFetch} from "./test_util.js";

/** @type {TestModule} */
export const test_util_tests = new TestModule('test util tests', [], [
  it('test mock function', function() {
    const mock = mockFunction();
    mock();
    mock();
    this.expectEqual(mock.calls, 2);
  }),

  it('test mock function with callback', function() {
    const mock = mockFunction(() => {
      mock.calls = 0; // reset calls to 0
    });
    mock();
    mock();
    this.expectEqual(mock.calls, 1);
  }),

  it('test it', async function() {
    let calls = 0;
    const unit_test = it('mock unit test', function() {
      calls++;
      this.expectEqual(1, 1);
    });
    this.expectEqual(unit_test.test_name, 'mock unit test');
    this.expectEqual(calls, 0);
    unit_test.test_el = document.createElement('div');
    await unit_test.run();
    this.expectEqual(unit_test.test_passed, true);
    this.expectEqual(unit_test.test_finished, true);
    this.expectEqual(unit_test.something_tested, true);
    this.expectEqual(calls, 1);
  }),

  it('test pit', async function() {
    let calls = 0;
    let counter1 = 0;
    let counter2 = 0;
    const unit_test = pit('mock unit test', [
      {'param': 1, 'default_param': 3},
      {'param': 2, 'default_param': -1},
      {'param': 2, 'bad_param': 1},
    ], function({param, default_param = 0}) {
      calls++;
      counter1 += param;
      counter2 += default_param;
      this.expectEqual(1, 1);
    });
    this.expectEqual(unit_test.test_name, 'mock unit test');
    this.expectEqual(calls, 0);
    unit_test.test_el = document.createElement('div');
    await unit_test.run();
    this.expectEqual(unit_test.test_passed, true);
    this.expectEqual(unit_test.test_finished, true);
    this.expectEqual(unit_test.something_tested, true);
    this.expectEqual(calls, 3);
    this.expectEqual(counter1, 5);
    this.expectEqual(counter2, 2);
  }),

  pit('test mockFetch', [
    {mock_fetch: false, fetch_return: null, expected: 'TypeError: NetworkError when attempting to fetch resource.'},
    {mock_fetch: true, fetch_return: null, expected:
      '{"input":"http://a_nonexistant_api","init":{"method":"POST","body":"body"}}'},
    {mock_fetch: true, fetch_return: () => new Promise(resolve => resolve(
      new Response(JSON.stringify('some mock return data')))),
      expected: '"some mock return data"'},
    {mock_fetch: true, fetch_return: (_, init) => new Promise(resolve => resolve(
      new Response(JSON.stringify(init.body)))),
      expected: '"body"'},
  ], async function({mock_fetch, fetch_return, expected}) {
    if (mock_fetch) {
      if (fetch_return) {
        mockFetch(fetch_return);
      }
      else {
        mockFetch();
      }
    }
    let response_text = '';
    try {
      const response = await fetch('http://a_nonexistant_api', {
        method: 'POST',
        body: 'body',
      });
      const response_json = await response.json();
      response_text = JSON.stringify(response_json);
    } catch(error) {
      response_text = error.toString();
    }
    this.expectEqual(response_text, expected);
  }),

  it('bootstrap generates component', async function() {
    const comp = await bootstrap('div', {inner_html: 'test'});
    this.expectEqual(comp.innerText, 'test');
    const rect =  comp.getBoundingClientRect();
    this.expectEqual(rect.x + rect.width < 0, true);
  }),

  it('bootstrap generates inner HTML', async function() {
    const comp = await bootstrap('div', {inner_html: 'div text<span>span text</span>'});
    this.expectEqual(comp.innerText, 'div textspan text');
    this.expectEqual(comp.children.length, 1);
    const span = comp.querySelector('span');
    this.expectEqual(span.innerText, 'span text');
  }),

  it('bootstrap generates attributes', async function() {
    const comp = await bootstrap('div', {
      attributes: new Map([['style', 'height: 50px; width: 100px;']]),
      inner_html: 'test',
    });
    this.expectEqual(comp.offsetHeight, 50);
    this.expectEqual(comp.offsetWidth, 100);
  }),
]);
