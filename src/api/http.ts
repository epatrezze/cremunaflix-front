type ApiErrorDto = {
  code: string;
  message: string;
  details?: string;
};

export type ApiRequestOptions = {
  baseUrl?: string;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 10000;

const resolveBaseUrl = (baseUrl?: string) => {
  const raw = baseUrl ?? import.meta.env.VITE_SF_API_BASE_URL ?? '';
  return raw.replace(/\/$/, '');
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

const toApiError = (status: number, body: unknown): ApiErrorDto => {
  if (body && typeof body === 'object') {
    const maybeError = body as Partial<ApiErrorDto>;
    return {
      code: maybeError.code ?? `HTTP_${status}`,
      message: maybeError.message ?? 'Request failed',
      details: maybeError.details
    };
  }

  if (typeof body === 'string' && body.trim()) {
    return { code: `HTTP_${status}`, message: body };
  }

  return { code: `HTTP_${status}`, message: 'Request failed' };
};

export const fetchJson = async <T>(
  path: string,
  init: RequestInit = {},
  options: ApiRequestOptions = {}
): Promise<T> => {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      credentials: 'omit',
      signal: controller.signal
    });

    if (!response.ok) {
      const errorBody = await readBody(response);
      throw toApiError(response.status, errorBody);
    }

    return (await readBody(response)) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw { code: 'TIMEOUT', message: 'Request timed out', details: path } satisfies ApiErrorDto;
    }

    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }

    throw {
      code: 'NETWORK_ERROR',
      message: 'Network error',
      details: String(error)
    } satisfies ApiErrorDto;
  } finally {
    clearTimeout(timeoutId);
  }
};
