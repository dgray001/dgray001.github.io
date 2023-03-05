// @ts-check
'use strict';

const fs = require('fs');

function runBundler() {
  // first copy static shit
  const dist_path = `${process.cwd()}/___dist`
  if (!fs.existsSync(dist_path)) {
    fs.mkdirSync(dist_path, {recursive: true});
  }
  copyFolder('__data', '___dist');
  // then bundle pages
  try {
    const data = fs.readFileSync(`${process.cwd()}/pages.json`, 'utf8');
    bundlePages(JSON.parse(data));
  } catch (e) {
    console.log('Could not open pages json file');
    console.log(e);
  }
}

/**
 * @param {JSON} pages_data
 * @param {string} current_path
 */
function bundlePages(pages_data, current_path = '') {
  // bundle poge
  const page_path = current_path ? `${current_path}/${pages_data['path']}` : pages_data['path']
  const filename = pages_data['name'] ? pages_data['name'] : pages_data['path']
  bundlePage(page_path, filename);
  if (!pages_data['pages']) {
    return;
  }
  // bundle subpages
  for (const page_data of pages_data['pages']) {
    bundlePages(page_data, page_path);
  }
}

/**
 * @param {string} path
 * @param {string} filename
 */
function bundlePage(path, filename) {
  const full_path = path ? `${process.cwd()}/${path}/` : `${process.cwd()}/`
  const html_path = fs.existsSync(`${full_path}index.html`) ?
    `${full_path}index.html` :
    `${full_path}index.php`
  const js_path = `${full_path}${filename}.js`
  const css_path = `${full_path}${filename}.css`
  console.log(html_path);
  console.log(js_path);
  console.log(css_path);
  const html = fs.readFileSync(html_path, 'utf8');
}

runBundler();
