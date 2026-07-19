import { clientCookies, eraseAllCookies } from '@core/scripts/cookies';
import { apiGet, apiPost } from '@core/scripts/api';
import { permissions } from '@site/config/permissions';

/** Whether current user is logged in */
export async function loggedIn(check_backend = false): Promise<boolean> {
  if (!loggedInSync()) {
    return false;
  }
  if (check_backend) {
    console.error('Not implemented');
    const response = await apiGet<boolean>('logged_in');
    if (!response.success || !response.result) {
      eraseAllCookies();
      await apiPost('logout', {});
      return false;
    }
  }
  return true;
}

/** Whether current user is logged in */
export function loggedInSync(): boolean {
  const login_cookies = ['session', 'email', 'role'];
  const cookies = clientCookies();
  for (const cookie of login_cookies) {
    if (!cookies.get(cookie)) {
      return false;
    }
  }
  return true;
}

/** Returns whether the role has the input permission (see @site/config/permissions) */
export function hasPermission(role: string, permission: string): boolean {
  if (role === 'admin') {
    return true;
  }
  return permissions[permission]?.includes(role) ?? false;
}
