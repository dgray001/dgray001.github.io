export const DEV = true;

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
 * Smooth scrolls to the input element, accounting for fixed header height
 * @param {HTMLElement} element element to scroll to
 */
export function scrollToElement(element) {
  const element_position = element.offsetTop;
  const fixed_header_size = 15 + 2 * Math.max(0.02 * window.innerHeight, 15);
  window.scrollTo({
    top: element_position - fixed_header_size,
    behavior: "smooth"
  });
}

/**
 * Returns promise that resolves when condition function becomes true
 * @param {Function} conditionFunction element to scroll to
 * @return {Promise}
 */
export function until(conditionFunction) {
  const poll = resolve => {
    if(conditionFunction) resolve();
    else setTimeout(_ => poll(resolve), 400);
  }
  return new Promise(poll);
}

export function createContactEmail(form_data) {
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
        <font style="font-family: sans-serif; font-size:12px;">${form_data['membership'].replace(',', '<br />')}</font>
      </td>
    </tr>`;
  }
  return `
    <html>
      <head>
        <title>New submission from CUF.org - Contact Us Page</title>
      </head>
      <body>
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