import { API_BASE_URL } from '../config/site.js';

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'UNKNOWN', fieldErrors } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

const TIMEOUT_MS = 15000;

/**
 * Minimal, hardened fetch wrapper:
 *  - JSON only, no cookies (credentials omitted) → no CSRF surface
 *  - hard timeout, caller-abortable
 *  - never leaks raw server/stack messages to the UI
 */
export async function http(path, { method = 'GET', body, signal, headers = {} } = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('The booking service is not configured yet.', { code: 'NOT_CONFIGURED' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    let data = null;
    const type = res.headers.get('content-type') || '';
    if (type.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      throw new ApiError(
        res.status === 429
          ? 'Too many attempts. Please wait a moment and try again.'
          : (data && typeof data.message === 'string' && data.message.slice(0, 200)) ||
              'Something went wrong. Please try again.',
        { status: res.status, code: (data && data.code) || 'HTTP_ERROR', fieldErrors: data?.fieldErrors },
      );
    }
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      if (signal?.aborted) throw err; // caller cancelled: let it bubble silently
      throw new ApiError('The request took too long. Check your connection and retry.', { code: 'TIMEOUT' });
    }
    throw new ApiError('Network error. Check your connection and retry.', { code: 'NETWORK' });
  } finally {
    clearTimeout(timer);
  }
}
