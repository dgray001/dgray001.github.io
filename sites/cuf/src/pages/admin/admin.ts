// styles
import './admin.scss';

// html
import html from './admin.html';

// dependencies
import '../../components/admin/admin_dashboard/admin_dashboard';
import '../../components/common/footer/footer';

// initialize
import { initializePage } from '@core/scripts/page_init';
initializePage(html);

// permission
import { hasPermission } from '@core/scripts/session';
import { getPage, navigate } from '@core/scripts/url';
import { getCookie } from '@core/scripts/cookies';
import { trim } from '@core/scripts/util';

if (!hasPermission(getCookie('role'), 'viewAdminDashboard')) {
  navigate(`/login?redirect=${trim(getPage(), '/')}`);
}
