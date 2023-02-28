// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
await import(`/__components/admin_dashboard/admin_dashboard_laywitness/admin_dashboard_laywitness.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_news/admin_dashboard_news.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_papers/admin_dashboard_papers.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_jobs/admin_dashboard_jobs.js?v=${version}`);