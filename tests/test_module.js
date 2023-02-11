import {UnitTest} from './unit_test.js';

export class TestModule {
  /** @type {string} display name of module */
  module_name;

  /** @type {Array<TestModule>} */
  sub_modules;

  /** @type {Array<UnitTest>} */
  unit_tests;

  /** @type {boolean} flag marked true when module finishes */
  module_finished = false;

  /** @type {boolean} flag marked true when module starts */
  module_started = false;

  /** @type {Promise} reference to promise returned when module run */
  module_promise;

  /** @type {boolean} true if all unit tests and submodules passed */
  all_tests_passed;

  /** @type {HTMLElement} element this module is bound to */
  test_el;
  
  /**
   * @param {string} module_name
   * @param {Array<TestModule>} sub_modules 
   * @param {Array<UnitTest>} unit_tests 
   */
  constructor(module_name, sub_modules, unit_tests) {
    this.module_name = module_name;
    this.sub_modules = sub_modules;
    this.unit_tests = unit_tests;
  }
  
  /**
   * Recursively generates HTML for the test module
   * @param {number} module_key unique key for this module
   * @returns {{module_html: string, updated_key: number, mapping: Map<number, TestModule|UnitTest>}}
   */
  getHTML(module_key, mapping = new Map()) {
    mapping.set(module_key, this);
    let return_html = `
      <div class="module" id="${module_key++}">
      <h3 class="module-title">${this.getTitleHTML()}</h3>
      <div class="module-tests">`;
    for (const test of this.unit_tests) {
      mapping.set(module_key, test);
      return_html += test.getHTML(module_key++);
    }
    return_html += '</div>';
    return_html += '<div class="sub-modules">';
    for (const module of this.sub_modules) {
      const {module_html, updated_key} = module.getHTML(module_key++, mapping);
      return_html += module_html;
      module_key = updated_key;
    }
    return_html += '</div>';
    return {module_html: return_html, updated_key: module_key, mapping: mapping};
  }
  
  /**
   * Returns title HTML
   * @returns {string} HTML to be placed in the title element
   */
  getTitleHTML() {
    let return_html = `<span class="expand-module">V</span>${this.module_name}`;
    if (this.module_finished) {
      if (this.all_tests_passed) {
        return_html += '<span class="run-module">Run Again</span><span class="module-result">Passed</span>';
      }
      else {
        return_html += `<span class="run-module">Run Again</span><span class="module-result">Failed</span>`;
      }
    }
    else if (this.module_started) {
      return_html += '<span class="module-running">Running</span>';
    }
    else {
      return_html += '<span class="run-module">Run Module</span>';
    }
    return return_html;
  }

  /**
   * Runs all tests and sub-modules
   * @returns {Promise} resolves when all tests and sub-modules are finished
   */
  run() {
    if (this.module_started && !this.module_finished) {
      return this.module_promise;
    }
    this.module_started = true;
    this.module_finished = false;
    const module_title = this.test_el.querySelector('.module-title');
    module_title.innerHTML = this.getTitleHTML();
    const promises = [];
    for (const test of this.unit_tests) {
      promises.push(test.run());
    }
    for (const module of this.sub_modules) {
      promises.push(module.run());
    }
    this.module_promise = Promise.all(promises).then(() => {
      this.module_finished = true;
      const module_title = this.test_el.querySelector('.module-title');
      module_title.innerHTML = this.getTitleHTML();
    });
    return this.module_promise;
  }

  /**
   * Adds event listeners to this module element
   */
  addEventListeners(test_mapping) {
    const module_title = this.test_el.querySelector('.module-title');
    module_title.addEventListener('mouseenter', (e) => {
      e.preventDefault();
      module_title.classList.add('hovered');
    });
    module_title.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      module_title.classList.remove('hovered');
    });
    module_title.addEventListener('click', (e) => {
      e.preventDefault();
      if (module_title.classList.contains('blockhovered')) {
        return;
      }
      const tests = this.test_el.querySelector('.module-tests');
      const sub_modules = this.test_el.querySelector('.sub-modules');
      const expand_module = this.test_el.querySelector('.expand-module');
      if (tests.hasAttribute('style')) {
        tests.removeAttribute('style');
        sub_modules.removeAttribute('style');
        expand_module.innerHTML = 'V';
      }
      else {
        tests.setAttribute('style', 'display: none;');
        sub_modules.setAttribute('style', 'display: none;');
        expand_module.innerHTML = '>';
      }
    });
    this.setModuleRunnerListeners(test_mapping);
  }

  /**
   * Sets event listeners on module runner
   * @param {Map<number, TestModule|UnitTest>} test_mapping
   */
  async setModuleRunnerListeners(test_mapping) {
    const module_runner = this.test_el.querySelector('.run-module');
    module_runner.addEventListener('mouseenter', (e) => {
      e.preventDefault();
      module_runner.classList.add('hovered');
      module_runner.parentElement.classList.add('blockhovered');
    });
    module_runner.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      module_runner.classList.remove('hovered');
      module_runner.parentElement.classList.remove('blockhovered');
    });
    module_runner.addEventListener('click', (e) => {
      e.preventDefault();
      this.runModule(test_mapping);
    });
  }

  /**
   * Runs test and sets event listener on newly-created child element
   * @param {Map<number, TestModule|UnitTest>} test_mapping
   */
  async runModule(test_mapping) {
    const module = test_mapping.get(parseInt(this.test_el.id));
    await module.run();
    module.setModuleRunnerListeners(test_mapping);
  }
}