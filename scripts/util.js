// @ts-check

export const DEV = true;

export const base_url = DEV ?
  'https://371c-2603-8080-1600-efda-1c8-dab8-a917-6e79.ngrok.io' :
  'https://cuf.org';

/**
 * Bases permission from cookie so can be spoofed
 * @param {string} role
 * @param {string} permission
 * @return {boolean} whether this role allows this permission
 */
export function hasPermission(role, permission) {
  if (role == 'admin') {
    return true;
  }
  switch(permission) {
    case "viewAdminDashboard":
    case "layWitness":
      return role == 'employee';
    case "positionPapers":
    case "news":
    case "faithFacts":
    case "jobsAvailable":
    default:
      return false;
  }
}

/**
 * Loop helper function
 * @param {number} times times to loop
 * @param {Function} callback function to call
 */
export const loop = (times, callback) => {
  for (let i = 0; i < times; i++) {
    callback(i);
  }
};

/**
 * Loop helper function
 * @param {number} times times to loop
 * @param {Function} callback function to call
 * @returns {Promise<void>} resolves when loop finished
 */
export const asyncLoop = async (times, callback) => {
  return new Promise(async (resolve) => {
    for (let i = 0; i < times; i++) {
      await callback(i);
    }
    resolve();
  });
};

/**
 * @callback conditionCallback
 * @return {boolean}
 */
/**
 * Returns promise that resolves when condition function becomes true
 * @param {conditionCallback} conditionFunction
 * @return {Promise}
 */
export function until(conditionFunction) {
  const poll = (resolve) => {
    if (conditionFunction()) {
      resolve();
    }
    else {
      setTimeout(() => poll(resolve), 400);
    }
  }
  return new Promise(poll);
}

/**
 * Recursively checks objects to see if they are equal
 * @param {object} obj1
 * @param {object} obj2
 * @param {string=} obj1_name name for obj1 in return string
 * @param {string=} obj2_name name for obj1 in return string
 * @returns {string} error message or empty if objects are equal
 */
export function objectsEqual(obj1, obj2, obj1_name = 'obj1', obj2_name = 'obj2') {
  if (typeof obj1 !== 'object') {
    return `${obj1_name} is not an object.`;
  }
  if (typeof obj2 !== 'object') {
    return `${obj2_name} is not an object.`;
  }
  for (const i in obj1) {
    if (!obj2.hasOwnProperty(i)) {
      return `${obj2_name} missing property ${i} found in ${obj1_name}.`;
    }
    if (typeof obj1[i] === 'object' || obj2[i] === 'object') {
      return objectsEqual(obj1[i], obj2[i], obj1_name + `[${i}]`, obj2_name + `[${i}]`);
    }
    if (obj1[i] !== obj2[i]) {
      return `Property ${i} in ${obj1_name} (${obj1[i]}) is not equal to ${obj2_name}[${i}] (${obj2[i]}).`;
    }
  }
  for (const i in obj2) {
    if (!obj1.hasOwnProperty(i)) {
      return `${obj1_name} missing property ${i} found in ${obj2_name}.`;
    }
  }
  return '';
}

/**
 * Trims input string of the input character
 * @param {string} str string to trim
 * @param {string} ch character to trim
 * @return {string} trimmed string
 */
export function trim(str, ch) {
  if (ch === "]") ch = "\\]";
  if (ch === "^") ch = "\\^";
  if (ch === "\\") ch = "\\\\";
  return str.replace(new RegExp(
    "^[" + ch + "]+|[" + ch + "]+$", "g"
  ), "");
}

/**
 * Smooth scrolls to the input element, accounting for fixed header height
 * @param {HTMLElement} element element to scroll to
 */
export function scrollToElement(element) {
  const element_position = element.offsetTop;
  const header_height_unit = Math.max(
    Math.min(0.02 * window.innerHeight, 0.0275 * window.innerWidth), 15);
  const navigation_height = 2.8 * (12 + 0.005 * window.innerWidth);
  let fixed_header_height = 15 + Math.max(navigation_height, 2.5 * header_height_unit);

  if (window.innerWidth >= 700 && window.innerWidth <= 1200) { // tablet mode
    fixed_header_height = 15 + navigation_height + 2 * header_height_unit;
  }

  window.scrollTo({
    top: element_position - fixed_header_height,
    behavior: "smooth"
  });
}

/**
 * Scrolls to the input value over the input time
 * @param {HTMLElement} element element to scroll
 * @param {number} target value to scroll to
 * @param {number} duration duration to take
 */
export function scrollOverDuration(element, target, duration) {
  const frame_time = 10;
  if (duration < 0) {
    return;
  }
  let frames = Math.ceil(duration / frame_time);
  if (frames == 0) {
    frames = 1;
  }
  const frame_scroll = Math.round((target - element.scrollTop) / frames);
  if (frame_scroll == 0) {
    return;
  }
  // account for rounding error in frame_scroll since scrollTop is an integer
  frames = Math.floor((target - element.scrollTop) / frame_scroll);
  const interval = setInterval(() => {
    frames--;
    element.scrollBy(0, frame_scroll);
    if (frames <= 0) {
      clearInterval(interval);
      element.scrollTop = target;
    }
  }, frame_time);
}

/**
 * Returns mapping of client-side cookies
 * @returns {object} cookies
 */
export function clientCookies() {
  return !document.cookie ? {} : document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

/**
 * Returns whether user is logged in based on client cookies
 * @returns {boolean}
 */
export function loggedIn() {
  const cookies = clientCookies();
  return cookies.hasOwnProperty('PHPSESSID') && cookies.hasOwnProperty('email') && cookies.hasOwnProperty('role');
}

/**
 * @param {{ [x: string]: any; name?: any; address?: any; contact?: any; message?: any; membership?: any; }} form_data
 * @param {boolean} contact_page
 */
export function createContactEmail(form_data, contact_page = true) {
  const page_name = contact_page ? 'Contact Us' : 'Donate';
  const donate_message = contact_page ? '' : '<div><em>This email is not receipt of an actual donation. This email is sent when the user submits the donate form on CUF.org/donate. They will be redirected to authorize.net to complete their payment; authorize.net will send a receipt email if they complete the actual donation.</em></div>';

  let membership_html = '';
  if (form_data['membership']) {
    membership_html += `
    <tr bgcolor="#EAF2FA">
      <td colspan="2">
        <font style="font-family: sans-serif; font-size:12px;"><strong>Membership Requests</strong></font>
      </td>
    </tr>
    <tr bgcolor="#FFFFFF">
      <td width="20">&nbsp;</td>
      <td>
        <font style="font-family: sans-serif; font-size:12px;">${form_data['membership'].replaceAll(',', '<br />')}</font>
      </td>
    </tr>`;
  }
  return `
    <html>
      <head>
        <title>New submission from CUF.org - ${page_name} Page</title>
      </head>
      <body>
        ${donate_message}
        <table width="99%" border="0" cellpadding="1" cellspacing="0" bgcolor="#EAEAEA"><tr><td>
          <table width="100%" border="0" cellpadding="5" cellspacing="0" bgcolor="#FFFFFF">
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Name</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${form_data['name']}</font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Address</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${form_data['address']['1']}<br />${form_data['address']['2']}<br />${form_data['address']['3']}<br/><a href='http://maps.google.com/maps?q=some+address+some+city%2C+some+state+some+zip+United+States' target='_blank' class='map-it-link'>Map It</a></font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Phone</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${form_data['contact']['phone']}</font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Email</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;"><a href='mailto:${form_data['contact']['email']}'>${form_data['contact']['email']}</a></font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Message</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${form_data['message']}</font>
            </td>
          </tr>
          ${membership_html}
          </table>
        </td></tr></table>
      </body>
    </html>`;
  }