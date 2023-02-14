// @ts-check

import {TestModule} from "../test_module.js";
import {pit} from "../test_util.js";
import {validate} from "../../scripts/validation.js";

export const validation_tests = new TestModule('validation tests', [], [
  pit('test validate', [
    {validator: 'unknown', input: 'some input', element: null, expected: '', error_thrown: true},
    {validator: 'required', input: '', element: null, expected: 'This field is required'},
    {validator: 'required', input: 'some input', element: null, expected: ''},
    {validator: 'datalist', input: 'some input', element: {}, expected: ''},
    {validator: 'datalist', input: 'value', element: {datalist_values: ['value 1', 'value 2']},
      expected: 'Please enter one of the suggested values'},
    {validator: 'datalist', input: 'value 1', element: {datalist_values: ['value 1', 'value 2']}, expected: ''},
    {validator: 'name', input: '123', element: null, expected: 'Please enter a valid name'},
    {validator: 'name', input: '', element: null, expected: 'Please enter a valid name'},
    {validator: 'name', input: '[]|', element: null, expected: 'Please enter a valid name'},
    {validator: 'name', input: 'this name is too long because it has more than thirty characters',
      element: null, expected: 'Please enter a valid name'},
    {validator: 'name', input: 'less than thirty characters', element: null, expected: ''},
    {validator: 'name', input: 'a', element: null, expected: ''},
    {validator: 'name', input: 'àÁáÂâĹĺĻÑÖŔŕŤťÜüŴÝŹ', element: null, expected: ''},
    {validator: 'address', input: 'a!4^%2o vio;a ', element: null, expected: ''},
    {validator: 'address', input: 'this address is just way too long because it is over 60 characters long, well not yet but now it i', element: null, expected: 'The address is too long'},
    {validator: 'email', input: '', element: null, expected: 'Please enter a valid email address'},
    {validator: 'email', input: 'no at symbol', element: null, expected: 'Please enter a valid email address'},
    {validator: 'email', input: 'an @ but no period', element: null, expected: 'Please enter a valid email address'},
    {validator: 'email', input: 'an @ and a .', element: null, expected: 'Please enter a valid email address'},
    {validator: 'email', input: 'an@anda.', element: null, expected: 'Please enter a valid email address'},
    {validator: 'email', input: 'an@anda.passing', element: null, expected: ''},
    {validator: 'email', input: '123@anda.c', element: null, expected: ''},
    {validator: 'email', input: 'weird+em{ail}.test@a.a', element: null, expected: ''},
    {validator: 'suffix', input: '!', element: null, expected: 'Please enter a valid suffix'},
    {validator: 'suffix', input: 'too long!', element: null, expected: 'Please enter a valid suffix'},
    {validator: 'suffix', input: 'III', element: null, expected: ''},
    {validator: 'suffix', input: '3rd', element: null, expected: ''},
    {validator: 'suffix', input: 'jr.', element: null, expected: ''},
    {validator: 'suffix', input: 'the 2nd', element: null, expected: ''},
    {validator: 'suffix', input: '', element: null, expected: ''},
    {validator: 'number', input: '', element: null, expected: 'Please enter a valid number'},
    {validator: 'number', input: 'abc', element: null, expected: 'Please enter a valid number'},
    {validator: 'number', input: '6f', element: null, expected: 'Please enter a valid number'},
    {validator: 'number', input: '1.2', element: null, expected: ''},
    {validator: 'number', input: '-2.1', element: null, expected: ''},
    {validator: 'number', input: '12', element: null, expected: ''},
    {validator: 'number', input: '-3', element: null, expected: ''},
    {validator: 'integer', input: '', element: null, expected: 'Please enter a valid integer'},
    {validator: 'integer', input: 'abc', element: null, expected: 'Please enter a valid integer'},
    {validator: 'integer', input: '6f', element: null, expected: 'Please enter a valid integer'},
    {validator: 'integer', input: '1.2', element: null, expected: 'Please enter a valid integer'},
    {validator: 'integer', input: '-2.1', element: null, expected: 'Please enter a valid integer'},
    {validator: 'integer', input: '2-1', element: null, expected: 'Please enter a valid integer'},
    {validator: 'integer', input: '12', element: null, expected: ''},
    {validator: 'integer', input: '-3', element: null, expected: ''},
  ], function({validator, input, element, expected, error_thrown = false}) {
    if (error_thrown) {
      this.expectErrorThrown(() => validate(validator, input, element));
    }
    else {
      this.expectEqual(validate(validator, input, element), expected);
    }
  }),
]);