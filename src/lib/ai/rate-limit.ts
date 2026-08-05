type RateBucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateBucket>;

const globalRateLimit = globalThis as typeof globalThis & {
  __sirSaqibRateLimit?: RateLimitStore;
};

const buckets = globalRateLimit.__sirSaqibRateLimit ?? new Map<string, RateBucket>();
globalRateLimit.__sirSaqibRateLimit = buckets;

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

/**
 * A small process-local limiter for local development and a single server process.
 * Production can replace this boundary with a distributed store such as Redis/KV.
 */
export function consumeRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  const current = buckets.get(key);
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      remaining: 0,
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (buckets.size > 1_000) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, limit - bucket.count),
  };
}

export function getRequestClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "local-development";
}

