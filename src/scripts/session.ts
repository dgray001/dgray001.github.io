import {clientCookies, eraseAllCookies} from './cookies';
import {apiGet, apiPost} from './api';

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

/** Returns whether cookies indicate the role has the input permission */
export function hasPermission(role: string, permission: string): boolean {
  if (role === 'admin') {
    return true;
  }
  switch(permission) {
    case 'viewAdminDashboard':
    case 'layWitness':
      return role === 'employee';
    case 'positionPapers':
    case 'news':
    case 'chapters':
    case 'prayer':
    case 'involvement':
    case 'faithFacts':
    case 'jobsAvailable':
    default:
      return false;
  }
}
