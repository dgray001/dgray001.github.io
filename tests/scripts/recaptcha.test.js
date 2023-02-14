// @ts-check

import {TestModule} from "../test_module.js";
import {it, mockFetch} from "../test_util.js";
import {verifyRecaptcha, public_recaptcha_site_key} from "../../scripts/recaptcha.js";

export const recaptcha_tests = new TestModule('recaptcha tests', [], [
  it('sends to recaptcha api', async function() {
    const mock = mockFetch();
    await verifyRecaptcha('some token');
    this.expectEqual(mock.calls, 1);
    const fetch_call = await mock.last_response.json();
    this.expectObjectEqual(fetch_call, {
      input: '/server/recaptcha.php',
      init: {
        method: 'POST',
        headers: {"Content-Type": 'application/json'},
        body: "\"some token\""}
    });
  }),

  it('it returns false for fake data', async function() {
    this.expectEqual(await verifyRecaptcha('fake token'), false);
  }),

  it('it returns true for real data', async function() {
    // @ts-ignore
    const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
    this.expectEqual(await verifyRecaptcha(token), true);
  }),
], true);