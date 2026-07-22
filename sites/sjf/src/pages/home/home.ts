import { fetchJson } from '@core/data/data_control';

const heading = document.createElement('h1');
heading.textContent = 'SJF dev';
document.body.appendChild(heading);

// named, admin-editable content area; id must match the admin dashboard's page content editor
const home_content = document.createElement('div');
home_content.id = 'home-content';
document.body.appendChild(home_content);

fetchJson<Record<string, string>>('page_content/page_content.json').then((page_content) => {
  home_content.innerHTML = page_content['home-content'] ?? '';
});

export {};
