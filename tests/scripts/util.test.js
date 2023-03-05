// @ts-check

import {TestModule} from "../test_module.js";
import {mockFunction, it, pit} from "../test_util.js";
import {loop, until, objectsEqual, clientCookies} from "../../scripts/util.js";

export const util_tests = new TestModule('util tests', [], [
  it('test loop', async function() {
    const times = Math.floor(Math.random() * 10);
    const mock = mockFunction();
    loop(times, mock);
    this.expectEqual(mock.calls, times);
  }),

  it('test until', async function() {
    let condition_flag = false;
    const condition = () => condition_flag == true;
    let promise_flag = false;
    until(condition).then(() => {
      promise_flag = true;
    });
    await new Promise(resolve => setTimeout(resolve, 401));
    this.expectEqual(promise_flag, false);
    condition_flag = true;
    await new Promise(resolve => setTimeout(resolve, 401));
    this.expectEqual(promise_flag, true);
  }),

  pit('test objectsEqual', [
    {obj1: {}, obj2: {}, expected: ''},
    {obj1: 1, obj2: 1, expected: 'obj1 is not an object.'},
    {obj1: {}, obj2: 1, expected: 'obj2 is not an object.'},
    {obj1: {prop: 1}, obj2: {}, expected: 'obj2 missing property prop found in obj1.'},
    {obj1: {prop: 1}, obj2: {prop: 2}, expected: 'Property prop in obj1 (1) is not equal to obj2[prop] (2).'},
    {obj1: {}, obj2: {prop: 1}, expected: 'obj1 missing property prop found in obj2.'},
    {obj1: {prop: {proper: 1}}, obj2: {prop: {proper: 2}}, expected:
      'Property proper in obj1[prop] (1) is not equal to obj2[prop][proper] (2).'},
    {obj1: {prop: {proper: 1}}, obj2: {prop: {proper: 1}}, expected: ''},
    {obj1: {prop1: 1, prop2: 2}, obj2: {prop2: 2, prop1: 1}, expected: ''},
  ], function({obj1, obj2, expected}) {
    this.expectEqual(objectsEqual(obj1, obj2), expected);
  }),

  pit('tests clientCookies', [
    {'cookie': '', 'expected': {}},
    {'cookie': 'somecookie=cook', 'expected': {somecookie: 'cook'}},
    {'cookie': 'somecookie=cook;someblankcookie=', 'expected': {somecookie: 'cook'}},
  ], async function({cookie, expected}) {
    // first erase cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      document.cookie = `${cookie.split('=')[0]}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    document.cookie = cookie;
    this.expectObjectEqual(clientCookies(), expected);
  }),
]);
