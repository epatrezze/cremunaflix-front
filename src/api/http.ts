import type { ErrorDTO } from '../types/dtos';

export type ApiRequestOptions = {
  baseUrl?: string;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 10000;
const API_PREFIX = '/api/v1';

const resolveRuntimeBaseUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  const basePath = import.meta.env.BASE_URL || '/';
  const resolved = new URL(basePath, window.location.origin).toString();
  return resolved.replace(/\/$/, '');
};

const resolveBaseUrl = (baseUrl?: string) => {
  const raw =
    baseUrl?.trim() ||
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    import.meta.env.VITE_SF_API_BASE_URL?.trim() ||
    '';

  if (raw) {
    return raw.replace(/\/$/, '');
  }

  return resolveRuntimeBaseUrl();
};

const joinPath = (baseUrl: string, path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const prefix = baseUrl.endsWith(API_PREFIX) ? '' : API_PREFIX;
  return `${baseUrl}${prefix}${cleanPath}`;
};

export const withQuery = (
  path: string,
  params: Record<string, string | number | boolean | null | undefined>
) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    search.set(key, String(value));
  });
  const suffix = search.toString();
  return suffix ? `${path}?${suffix}` : path;
};

const readBody = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  return response.text();
};

const toApiError = (status: number, body: unknown): ErrorDTO & { status: number } => {
  if (body && typeof body === 'object') {
    const maybeError = body as Partial<ErrorDTO>;
    return {
      status,
      code: maybeError.code ?? `HTTP_${status}`,
      message: maybeError.message ?? 'Request failed',
      details: maybeError.details ?? null
    };
  }

  if (typeof body === 'string' && body.trim()) {
    return { status, code: `HTTP_${status}`, message: body, details: null };
  }

  return { status, code: `HTTP_${status}`, message: 'Request failed', details: null };
};

export const fetchJson = async <T>(
  path: string,
  init: RequestInit = {},
  options: ApiRequestOptions = {}
): Promise<T> => {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const url = joinPath(baseUrl, path);
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...init,
      headers,
      credentials: 'omit',
      signal: controller.signal
    });

    const body = await readBody(response);

    if (!response.ok) {
      const safePayload =
        body && typeof body === 'object'
          ? {
              code: (body as { code?: string }).code,
              message: (body as { message?: string }).message,
              details: (body as { details?: string | null }).details ?? null
            }
          : body;
      console.error('[API]', response.status, url, safePayload);
      throw toApiError(response.status, body);
    }

    console.info('[API]', response.status, url, body);
    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw { status: 0, code: 'TIMEOUT', message: 'Request timed out', details: path } satisfies ErrorDTO & {
        status: number;
      };
    }

    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }

    throw {
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Network error',
      details: String(error)
    } satisfies ErrorDTO & { status: number };
  } finally {
    clearTimeout(timeoutId);
  }
};
