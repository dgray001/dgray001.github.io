/** Returns mapping of client-side cookies */
export function clientCookies(): Map<string, string> {
  return !document.cookie ? new Map() : document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((acc, v) => {
      acc.set(decodeURIComponent(v[0].trim()), decodeURIComponent(v[1].trim()));
      return acc;
    }, new Map<string, string>());
}

/** Returns specified cookie, or an empty string if it doesn't exist */
export function getCookie(cookie: string): string {
  return clientCookies().get(cookie) ?? '';
}

/** Clears all cookies that javascript can 'see' */
export function eraseAllCookies(): void {
  for (const cookie of document.cookie.split(',')) {
    eraseCookie(cookie.split('=')[0]);
  }
}

/** Erases the specified cookie */
export function eraseCookie(name: string, domain?: string, path?: string): void {
  domain = domain ?? location.hostname;
  path = path ?? '/';
  const date = Date.now() - 1;
  document.cookie = `${name}=; expires=${date}; domain=${domain}; path=${path}`;
}
