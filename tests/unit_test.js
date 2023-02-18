import {asyncLoop, objectsEqual} from "../scripts/util.js";

export class UnitTest {
  /** @type {string} display name of test*/
  test_name;

  /** @type {number} mapping tree depth of the module */
  tree_depth;

  /** @type {number} number of parametrized cases (undefined if not parametrized) */
  parametrized;

  /** @type {Function} that returns a boolean */
  test_runnable;

  /** @type {boolean} marking a unit test as flaky will make it run multiple times */
  potentially_flaky;

  /** @type {number} times the test was ran */
  times_ran;

  /** @type {number} times the test passed */
  times_passed;

  /** @type {boolean} if test run multiple times, must pass every time to be marked an overall pass */
  test_passed;

  /** @type {string} */
  failure_message;

  /** @type {boolean} flag marked true when at least one expect is run */
  something_tested = false;

  /** @type {boolean} flag marked true when test finishes */
  test_finished = false;

  /** @type {boolean} flag marked true when test starts */
  test_started = false;

  /** @type {Promise} reference to promise returned when test run */
  test_promise;

  /** @type {HTMLElement} element this unit test is bound to */
  test_el;

  /**
   * Must give a UnitTest a name and runnable
   * @param {string} test_name
   * @param {Function} test_runnable
   * @param {boolean=} potentially_flaky
   */
  constructor(test_name, test_runnable, potentially_flaky = false) {
    this.test_name = test_name;
    this.test_runnable = test_runnable;
    this.potentially_flaky = potentially_flaky;
  }

  /**
   * Runs test_runnable and necessary cleanup logic
   */
  async runRunnable() {
    await this.test_runnable();
    this.times_ran++;
    if (this.test_passed) {
      this.times_passed++;
    }
  }

  /**
   * Runs test
   * @returns {Promise} resolves when test is finished
   */
  async run() {
    if (this.test_started && !this.test_finished) {
      return this.test_promise;
    }
    globalThis.afterTest = () => {};
    this.test_started = true;
    this.test_passed = undefined;
    this.times_ran = 0;
    this.times_passed = 0;
    this.test_finished = false;
    this.test_el.innerHTML = this.getBodyHTML(); // running
    this.test_el.setAttribute('style', 'background-color: lightyellow; margin-left: 1rem;');
    let this_run_finished = false;
    const run_promise = new Promise(async (resolve) => {
      // Make tests take minimum of 50ms to complete
      await new Promise(resolve => setTimeout(resolve, 50));
      await this.runRunnable();
      globalThis.afterTest();
      if (this.test_finished) {
        resolve();
        return;
      }
      if (this.potentially_flaky) {
        await asyncLoop(4, async () => {
          await this.runRunnable();
          globalThis.afterTest();
          if (this.test_finished) {
            resolve();
            return;
          }
        });
        if (this.times_passed < this.times_ran) {
          this.test_passed = false;
          this.failure_message = `Flaky test passed ${this.times_passed} / ` +
            `${this.times_ran} times. Last failure message: ${this.failure_message}`;
        }
      }
      this.test_finished = true;
      this_run_finished = true;
      if (!this.something_tested) {
        this.test_passed = false;
        this.failure_message = 'Test had no expects';
      }
      resolve();
    });
    const timeout_promise = new Promise(resolve => {
      setTimeout(() => {
        if (!this.test_finished && !this_run_finished) {
          this.test_finished = true;
          this.test_passed = false;
          this.failure_message = 'Test timed out.';
        }
        resolve();
      }, 3000);
    });
    this.test_promise = Promise.race([run_promise, timeout_promise]).then(_ => {
      this.test_el.innerHTML = this.getBodyHTML();
      if (this.test_passed) {
        this.test_el.setAttribute('style', 'background-color: lightgreen; margin-left: 1rem;');
      }
      else {
        this.test_el.setAttribute('style', 'background-color: red; margin-left: 1rem;');
      }
    });
    return this.test_promise;
  }
  
  /**
   * Generates HTML for the unit test
   * @param {number} test_key unique key for this test
   * @param {number} tree_depth mapping tree depth of the module
   * @returns {string} inner HTML
   */
  getHTML(test_key, tree_depth) {
    this.tree_depth = tree_depth;
    let return_html = `
      <div class="test" id="${test_key}">
      `;
    return_html += this.getBodyHTML();
    return_html += '</div>';
    return return_html;
  }
  
  /**
   * Generates HTML for the body of the unit test
   * @returns {string} inner HTML
   */
  getBodyHTML() {
    let title_name = this.test_name;
    if (typeof this.parametrized !== 'undefined') {
      title_name += ` (${this.parametrized} cases)`;
    }
    if (this.potentially_flaky) {
      title_name += ' (flaky)';
    }
    let return_html = `<h4 class="test-title">${title_name}</h4>`;
    if (this.test_finished) {
      if (this.test_passed) {
        return_html += '<span class="run-test">Run Again</span><span class="test-result">Passed</span>';
      }
      else {
        if (this.times_ran > 1) {
          return_html += `<span class="run-test">Run Again</span><span class="test-result">` +
            `Failed (${this.times_ran - this.times_passed} times): ${this.failure_message}</span>`;
        }
        else {
          return_html += `<span class="run-test">Run Again</span><span class="test-result">` +
            `Failed: ${this.failure_message}</span>`;
        }
      }
    }
    else if (this.test_started) {
      return_html += '<span class="test-running">Running</span>';
    }
    else {
      return_html += '<span class="run-test">Run Test</span>';
    }
    return return_html;
  }

  /**
   * Adds event listeners to this module element
   * @param {Map<number, TestModule|UnitTest>} test_mapping
   */
  addEventListeners(test_mapping) {
    const test_runner = this.test_el.querySelector('.run-test');
    test_runner.addEventListener('click', (e) => {
      e.preventDefault();
      this.runTest(test_mapping);
    });
  }

  /**
   * Runs test and sets event listener on newly-created child element
   * @param {Map<number, TestModule|UnitTest>} test_mapping
   */
  async runTest(test_mapping) {
    const test = test_mapping.get(parseInt(this.test_el.id));
    await test.run(this.test_el);
    test.addEventListeners(test_mapping);
  }

  /**
   * Checks if operand is true
   * @param {any} operand
   */
  expect = (operand) => {
    this.something_tested = true;
    if (operand === true) {
      if (typeof this.test_passed === 'undefined') {
        this.test_passed = true;
      }
      return;
    }
    this.test_passed = false;
    this.failure_message = `expected ${operand} to be true`;
  }

  /**
   * Compares operands
   * @param {any} actual
   * @param {any} expected
   */
  expectEqual = (actual, expected) => {
    this.something_tested = true;
    if (actual === expected) {
      if (typeof this.test_passed === 'undefined') {
        this.test_passed = true;
      }
      return;
    }
    this.test_passed = false;
    this.failure_message = `expected ${actual} to equal ${expected}`;
  }

  /**
   * Compares objects
   * @param {object} actual
   * @param {object} expected
   */
  expectObjectEqual = (actual, expected) => {
    this.something_tested = true;
    const failure_message = objectsEqual(actual, expected);
    if (failure_message && failure_message !== '') {
      this.test_passed = false;
      this.failure_message = failure_message;
    }
    else if (typeof this.test_passed === 'undefined') {
      this.test_passed = true;
    }
  }

  /**
   * expect function to throw (or not throw) error
   * @param {function} callback
   * @param {boolean=} throws
   */
  expectErrorThrown = (callback, throws = true) => {
    this.something_tested = true;
    let error_thrown = false;
    try {
      callback();
    } catch(e) {
      error_thrown = true;
    }
    if (throws === error_thrown) {
      if (typeof this.test_passed === 'undefined') {
        this.test_passed = true;
      }
      return;
    }
    this.test_passed = false;
    this.failure_message = `expected ${actual} to equal ${expected}`;
  }
}