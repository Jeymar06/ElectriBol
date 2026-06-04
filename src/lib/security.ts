const globalRateLimitStore = globalThis as typeof globalThis & {
  __electribolRateLimits__?: Map<string, { count: number; resetAt: number }>;
};

const rateLimitStore = globalRateLimitStore.__electribolRateLimits__ ?? new Map();
globalRateLimitStore.__electribolRateLimits__ = rateLimitStore;

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

export class RateLimitError extends Error {
  readonly retryAfter: number;

  constructor(retryAfter: number) {
    super('Demasiados intentos. Intenta mas tarde.');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

export function consumeRateLimit(
  scope: string,
  key: string,
  options: RateLimitOptions
): void {
  const now = Date.now();
  const storeKey = `${scope}:${key}`;
  const existing = rateLimitStore.get(storeKey);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(storeKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return;
  }

  if (existing.count >= options.limit) {
    throw new RateLimitError(Math.ceil((existing.resetAt - now) / 1000));
  }

  existing.count += 1;
  rateLimitStore.set(storeKey, existing);
}
