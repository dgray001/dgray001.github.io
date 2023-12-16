
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

/** Scrolls to the input element */
export function scrollToElement(el: HTMLElement) {
  const element_position = el.offsetTop;
  const fixed_header_height = 0; // TODO: implement

  window.scrollTo({
    top: element_position - fixed_header_height,
    behavior: "smooth"
  });
}
