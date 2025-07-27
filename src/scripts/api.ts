/** Data structure for all returns to get requests */
export interface GetResponse<T> {
  success: boolean;
  result?: T;
  error_message?: string;
}

/** Data structure for all returns to post requests */
export interface PostResponse {
  success: boolean;
  error_message?: string;
}

/** Converts string api to actual api url */
function apiToUrl(api: string) {
  return `/server/${api}.php`;
}

/** Calls and returns the input get api */
export async function apiGet<T>(api: string): Promise<GetResponse<T>> {
  try {
    const response = await fetch(apiToUrl(api), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response_json = (await response.json()) as GetResponse<T>;
    return response_json;
  } catch (error) {
    console.log(error);
  }
  return {
    success: false,
    error_message: 'Server error. Please report this bug.',
  };
}

/** Calls api that returns a blob */
export async function apiGetFile(api: string, data: any, signal?: AbortSignal): Promise<Blob> {
  const is_file = data instanceof File;
  const content_type = is_file ? data.type : 'application/json';
  const filename = is_file ? data.name : undefined;
  const body = is_file ? data : JSON.stringify(data);
  try {
    const response = await fetch(apiToUrl(api), {
      method: 'POST',
      headers: {
        'Content-Type': content_type,
        'X-File-Name': filename,
      },
      body,
      signal,
    });
    const response_blob = await response.blob();
    return response_blob;
  } catch (e) {
    console.error(e);
  }
  return new Blob();
}

/** Calls and returns the input post api that returns data */
export async function apiGetPost<T>(
  api: string,
  data: any,
  signal?: AbortSignal
): Promise<GetResponse<T>> {
  const is_file = data instanceof File;
  const content_type = is_file ? data.type : 'application/json';
  const filename = is_file ? data.name : undefined;
  const body = is_file ? data : JSON.stringify(data);
  try {
    const response = await fetch(apiToUrl(api), {
      method: 'POST',
      headers: {
        'Content-Type': content_type,
        'X-File-Name': filename,
      },
      body,
      signal,
    });
    const response_json = (await response.json()) as GetResponse<T>;
    return response_json;
  } catch (error) {
    console.error(error);
  }
  return {
    success: false,
    error_message: 'Server error. Please report this bug.',
  };
}

/** Calls and returns the input post api, using json input */
export async function apiPost(api: string, data: any): Promise<PostResponse> {
  const is_file = data instanceof File;
  const content_type = is_file ? data.type : 'application/json';
  const filename = is_file ? data.name : undefined;
  const body = is_file ? data : JSON.stringify(data);
  try {
    const response = await fetch(apiToUrl(api), {
      method: 'POST',
      headers: {
        'Content-Type': content_type,
        'X-File-Name': filename,
      },
      body,
    });
    const response_json = (await response.json()) as PostResponse;
    return response_json;
  } catch (error) {
    console.error(error);
  }
  return {
    success: false,
    error_message: 'Server error. Please report this bug.',
  };
}

/**
 * Calls input callback if post api returns successful
 * Should be used in conjunction with recaptchaCallback
 */
export async function apiPostCallback(
  api: string,
  data: any,
  callback: () => Promise<void> | void,
  status_message: HTMLElement,
  success_message: string
): Promise<void> {
  const response = await apiPost(api, data);
  if (response.success) {
    status_message.setAttribute('style', 'display: block; color: var(--success-color);');
    status_message.innerText = success_message;
    await callback();
  } else {
    status_message.setAttribute('style', 'display: block; color: var(--warning-color);');
    status_message.innerText = response.error_message;
  }
}

/**
 * Returns true if post api returns successful
 * Should be used in conjunction with recaptchaCallback
 */
export async function apiPostSuccess(
  api: string,
  data: any,
  status_message: HTMLElement,
  success_message: string
): Promise<boolean> {
  const response = await apiPost(api, data);
  if (response.success) {
    status_message.setAttribute('style', 'display: block; color: var(--success-color);');
    status_message.innerText = success_message;
    return true;
  }
  status_message.setAttribute('style', 'display: block; color: var(--warning-color);');
  status_message.innerText = response.error_message;
  return false;
}
