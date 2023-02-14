// @ts-check

import {countriesList, defaultMapping, panelsToIncludeFrom, specificMapping} from "../../scripts/datalists.js";
import {TestModule} from "../test_module.js";
import {it, mockFetch, pit} from "../test_util.js";

const mock_countries = new Map([['usa', 'U S of A'], ['fra', 'FRANCE'], ['chi', 'CHI-NUH']]);

export const datalist_tests = new TestModule('datalist tests', [], [
  pit('test panelsToIncludeFrom', [
    {panels_data: 'some gibberish', expected: []},
    {panels_data: '["some", "gibberish"]', expected: ['some', 'gibberish']},
    {panels_data: '["gibberish", "of", "some"]', expected: ['gibberish', 'of', 'some']},
    {panels_data: 'homepage', expected: ["prayer", "news", "papers"]},
    {panels_data: 'page', expected: ["prayer", "news", "jobs_available", "papers"]},
    {panels_data: 'page-whatever', expected: ["prayer", "news", "jobs_available", "papers"]},
    {panels_data: 'page-prayer', expected: ["news", "jobs_available", "papers"]},
    {panels_data: 'page-jobs_available', expected: ["prayer", "news", "papers"]},
  ], async function({panels_data, expected}) {
    this.expectObjectEqual(panelsToIncludeFrom(panels_data), expected);
  }),

  pit('test specificMapping', [
    {options_text: 'some gibberish', expected: []},
    {options_text: '["some", "gibberish"]', expected: ['some', 'gibberish']},
    {options_text: '["gibberish", "of", "some"]', expected: ['gibberish', 'of', 'some']},
    {options_text: 'prefixes', expected: ["", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Rev."]},
    {options_text: 'countries', expected: mock_countries},
  ], async function({options_text, expected}) {
    /**
     * Mocks countriesList form datalists.js
     * @return {Promise<Map<string, string>>} country_map<code, display name>
     */
    async function countriesList() {
      return new Promise(resolve => {
        resolve(mock_countries);
      });
    };
    this.expectObjectEqual(await specificMapping(options_text), expected);
  }),

  it('test countriesList', async function() {
    const mock = mockFetch(() => new Promise(resolve => resolve(
      new Response(JSON.stringify([
        {name: 'U S of A', 'alpha3': 'usa'},
        {name: 'FRANCE', 'alpha3': 'fra'},
        {name: 'CHI-NUH', 'alpha3': 'chi'},
      ])))));
    this.expectObjectEqual(await countriesList(), mock_countries);
    this.expectEqual(mock.last_input, './__data/countries.json');
    this.expectEqual(mock.calls, 1);
  }),

  pit('test defaultMapping', [
    {options_text: 'some gibberish', expected: null},
    {options_text: 'prefixes', expected: ''},
    {options_text: 'countries', expected: 'United States'},
  ], async function({options_text, expected}) {
    this.expectEqual(defaultMapping(options_text), expected);
  }),
], true);