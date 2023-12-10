import {clientCookies, eraseAllCookies} from './cookies';
import {apiGet, apiPost} from './api';

/** Whether current user is logged in */
export async function loggedIn(check_backend = false): Promise<boolean> {
  const login_cookies = ['session', 'username', 'email', 'role'];
  const cookies = clientCookies();
  for (const cookie of login_cookies) {
    if (!cookies.get(cookie)) {
      return false;
    }
  }
  if (check_backend) {
    const response = await apiGet<boolean>('logged_in');
    if (!response.success || !response.result) {
      eraseAllCookies();
      await apiPost('logout', {});
      return false;
    }
  }
  return true;
}

/** Whether current user has permission to do something */
export async function hasPermission(permission: string, check_backend = false): Promise<boolean> {
  const cookies = clientCookies();
  const role = cookies.get('role') ?? '';
  let frontend_permission = false;
  if (role === 'admin') {
    frontend_permission = true;
  }
  else {
    switch(permission) {
      case 'add_user_none':
        return true;
      case 'access_site':
        frontend_permission = role === 'soldier';
        break;
      case 'access_admin_dashboard':
      case 'add_version':
      case 'edit_wiki':
      default:
        frontend_permission = false;
        break;
    }
  }
  if (!frontend_permission) {
    return false;
  }
  if (check_backend) {
    const response = await apiPost('permission', {permission});
    return response.success;
  }
  return true;
}

/** Interface describing a user from the database */
export declare interface User {
  id: number,
  username: string,
  email: string,
  role: string,
  activated: boolean,
  last_activated: number,
  last_logged_in: number,
}