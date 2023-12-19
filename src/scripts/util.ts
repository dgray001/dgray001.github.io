
/** Frontend flags marking environment */
export const DEV = true;
export const STAGING = false;

/** Loop helper function */
export const loop = (times: number, callback: (i?: number) => void) => {
  for (let i = 0; i < times; i++) {
    callback(i);
  }
};

/** Async loop helper function */
export const asyncLoop = async (times: number, callback: Function) => {
  return new Promise<void>(async (resolve) => {
    for (let i = 0; i < times; i++) {
      await callback(i);
    }
    resolve();
  });
};

/** Returns promise that resolves when condition function becomes true */
export function until(condition: () => boolean, poll_timer = 300): Promise<void> {
  const poll = (resolve: () => void) => {
    if (condition()) {
      resolve();
    }
    else {
      setTimeout(() => poll(resolve), poll_timer);
    }
  }
  return new Promise<void>(poll);
}

/** Awaits a specific amount of time */
export async function untilTimer(timer: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, timer));
}

/** Capitalizes each word in string */
export function capitalize(str: string): string {
  const str_split = str.trim().split(' ');
  return str_split.map(str => {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

/** Trims specified chars from string */
export function trim(s: string, c: string): string {
  if (c === "]") c = "\\]";
  if (c === "^") c = "\\^";
  if (c === "\\") c = "\\\\";
  return s.replace(new RegExp(
    "^[" + c + "]+|[" + c + "]+$", "g"
  ), "");
}

/** Header height */
export function headerHeight(): number {
  const fixed_container = document.querySelector('cuf-header #fixed-container');
  const header_margin = document.querySelector('cuf-header #margin');
  const curr_height = fixed_container.clientHeight + header_margin?.clientHeight;
  if (!!curr_height) {
    return curr_height;
  }
  // calculation but could be inaccurate esp w.r.t. future changes
  const title_height = 1.7 * (13 + 0.013 * window.innerWidth);
  const navigation_height = 2.5 * (11 + 0.005 * window.innerWidth);
  const fixed_container_height = Math.max(title_height, navigation_height);
  const padding_top = 8;
  if (window.innerWidth > 700 && window.innerWidth <= 1300) { // tablet mode
    return 2 * padding_top + title_height + navigation_height;
  }
  return fixed_container_height + padding_top;
}

/** Scrolls to the input element */
export function scrollToElement(el: HTMLElement) {
  const element_position = el.offsetTop;
  window.scrollTo({
    top: element_position - headerHeight() - 4, // -4 for box shadow
    behavior: "smooth"
  });
}
