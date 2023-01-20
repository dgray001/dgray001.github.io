/**
 * Smooth scrolls to the input element, accounting for fixed header height
 * @param {HTMLElement} element element to scroll to
 */
function scrollToElement(element) {
  const element_position = element.offsetTop;
  const fixed_header_size = 15 + 2 * Math.max(0.02 * window.innerHeight, 15);
  window.scrollTo({
    top: element_position - fixed_header_size,
    behavior: "smooth"
  });
}

/**
 * Smooth scrolls to the input element, accounting for fixed header height
 * @param {HTMLElement} element element to scroll to
 * @return {Promise}
 */
function until(conditionFunction) {
  const poll = resolve => {
    if(conditionFunction) resolve();
    else setTimeout(_ => poll(resolve), 400);
  }
  return new Promise(poll);
}