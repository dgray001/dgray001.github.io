// @ts-check
'use strict';
export {};

// Get a new version each day, so caching can still be effective
const {attachBundle} = await import(`/scripts/init.js?v=${Math.floor(Date.now() / 86400000)}`);

attachBundle('admin');
