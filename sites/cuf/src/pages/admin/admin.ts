// styles
import './admin.scss';

// html
import html from './admin.html';

// dependencies
import '../../components/admin/admin_dashboard/admin_dashboard';

// initialize
import { initializePage } from '../common';
initializePage(html);

// permission
import { hasPermission } from '../../scripts/session';
import { getPage, navigate, removeUrlParam } from '../../scripts/url';
import { getCookie } from '../../scripts/cookies';
import { trim } from '../../scripts/util';

if (!hasPermission(getCookie('role'), 'viewAdminDashboard')) {
  navigate(`/login?redirect=${trim(getPage(), '/')}`);
}
