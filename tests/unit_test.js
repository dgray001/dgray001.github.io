export class UnitTest {
  /** @type {string} display name of test*/
  test_name;

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
    this.test_started = true;
    this.test_finished = false;
    this.test_el.innerHTML = this.getBodyHTML(); // running
    let this_run_finished = false;
    const run_promise = new Promise(async (resolve) => {
      await this.runRunnable();
      if (this.test_finished) {
        resolve();
        return;
      }
      if (this.potentially_flaky) {
        for (const _ of 4) { // run flaky tests 5 times
          await this.runRunnable();
          if (this.test_finished) {
            resolve();
            return;
          }
        }
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
      }, 1000);
    });
    this.test_promise = Promise.race([run_promise, timeout_promise]).then(_ => {
      this.test_el.innerHTML = this.getBodyHTML();
    });
    return this.test_promise;
  }
  
  /**
   * Generates HTML for the unit test
   * @param {number} test_key unique key for this test
   * @returns {string} inner HTML
   */
  getHTML(test_key) {
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
    let return_html = `<h4 class="test-title">${this.test_name}</h4>`;
    if (this.test_finished) {
      if (this.test_passed) {
        return_html += '<span class="run-test">Run Again</span><span class="test-result">Passed</span>';
      }
      else {
        return_html += `<span class="run-test">Run Again</span><span class="test-result">Failed: ${this.failure_message}</span>`;
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
}