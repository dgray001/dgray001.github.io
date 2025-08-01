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
export function until(condition: () => boolean, poll_timer = 300, max_time = 0): Promise<void> {
  let i = 0;
  let max_i = -1;
  if (max_time > 0 && poll_timer > 0) {
    max_i = Math.ceil(max_time / poll_timer);
  }
  const poll = (resolve: () => void, reject: () => void) => {
    i++;
    if (i === max_i) {
      reject();
    }
    if (condition()) {
      resolve();
    } else {
      setTimeout(() => poll(resolve, reject), poll_timer);
    }
  };
  return new Promise<void>(poll);
}

/** Awaits a specific amount of time */
export async function untilTimer(timer: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, timer));
}

/** Capitalizes each word in string */
export function capitalize(str: string): string {
  const str_split = str.trim().split(' ');
  return str_split
    .map((str) => {
      const lower = str.toLowerCase();
      return str.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

/** Trims specified chars from string */
export function trim(s: string, c: string): string {
  if (c === ']') c = '\\]';
  if (c === '^') c = '\\^';
  if (c === '\\') c = '\\\\';
  return s.replace(new RegExp('^[' + c + ']+|[' + c + ']+$', 'g'), '');
}

/** Change a file object's readonly name property */
export function renameFile(file: File, name: string) {
  return new File([file], name, {
    type: file.type,
    lastModified: file.lastModified,
  });
}

/** Header height */
export function headerHeight(): number {
  const fixed_container = document.querySelector('cuf-header #fixed-container');
  const header_margin = document.querySelector('cuf-header #margin');
  const curr_height = fixed_container.clientHeight + header_margin?.clientHeight;
  if (curr_height) {
    return curr_height;
  }
  // calculation but could be inaccurate esp w.r.t. future changes
  const title_height = 1.7 * (13 + 0.013 * window.innerWidth);
  const navigation_height = 2.5 * (11 + 0.005 * window.innerWidth);
  const fixed_container_height = Math.max(title_height, navigation_height);
  const padding_top = 8;
  if (window.innerWidth > 700 && window.innerWidth <= 1300) {
    // tablet mode
    return 2 * padding_top + title_height + navigation_height;
  }
  return fixed_container_height + padding_top;
}

/** Downloads input string as file */
export function downloadString(content: string, fileName: string, contentType = 'text/plain') {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

/** Downloads input blob as file */
export function downloadBlob(content: Blob, fileName: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = fileName;
  a.click();
}

/** Scrolls to the input element */
export function scrollToElement(el: HTMLElement, wait_time = 0) {
  const element_position = el.offsetTop;
  const scroll_y = element_position - headerHeight() - 4; // -4 for box shadow
  until(
    () => document.body.scrollHeight - document.body.clientHeight > scroll_y,
    40,
    wait_time
  ).then(() => {
    document.body.scrollTo({
      top: scroll_y,
      behavior: 'smooth',
    });
    el.classList.add('scrolled-to');
    setTimeout(() => {
      el.classList.add('just-scrolled-to');
    }, 1);
    setTimeout(() => {
      el.classList.remove('just-scrolled-to');
    }, 1000);
  });
}
