import { FandomApiError } from '../types/pokemon';

const DEFAULT_BACKOFF_MS = [250, 500, 1000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FetchOptions {
  method?: 'GET' | 'POST';
  body?: URLSearchParams;
}

export async function fetchJson<T>(url: string, opts: FetchOptions = {}): Promise<T> {
  let lastErr: unknown;
  const attempts = DEFAULT_BACKOFF_MS.length + 1;
  const method = opts.method ?? 'GET';

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const init: RequestInit = {
        method,
        mode: 'cors',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
      };
      if (method === 'POST') {
        init.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        init.body = opts.body?.toString() ?? '';
      }
      const res = await fetch(url, init);

      if (res.status === 429 || res.status === 503) {
        const retryAfterHeader = res.headers.get('Retry-After');
        const retryAfterSec = retryAfterHeader ? Number(retryAfterHeader) : undefined;

        if (attempt < attempts - 1) {
          const waitMs = Number.isFinite(retryAfterSec)
            ? Math.max((retryAfterSec ?? 0) * 1000, DEFAULT_BACKOFF_MS[attempt])
            : DEFAULT_BACKOFF_MS[attempt];
          await sleep(waitMs);
          continue;
        }
        throw new FandomApiError('rate-limit', `Rate limited (${res.status})`, {
          retryAfter: retryAfterSec,
          status: res.status,
        });
      }

      if (!res.ok) {
        throw new FandomApiError('http', `HTTP ${res.status}`, { status: res.status });
      }

      const text = await res.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        throw new FandomApiError('parse', '응답을 JSON으로 파싱할 수 없습니다.');
      }
    } catch (err) {
      lastErr = err;
      if (err instanceof FandomApiError) {
        if (err.kind === 'rate-limit' || err.kind === 'network') {
          if (attempt < attempts - 1) {
            await sleep(DEFAULT_BACKOFF_MS[attempt]);
            continue;
          }
        }
        throw err;
      }
      if (attempt < attempts - 1) {
        await sleep(DEFAULT_BACKOFF_MS[attempt]);
        continue;
      }
      throw new FandomApiError('network', err instanceof Error ? err.message : String(err));
    }
  }

  throw lastErr instanceof Error
    ? lastErr
    : new FandomApiError('network', '알 수 없는 네트워크 오류');
}
