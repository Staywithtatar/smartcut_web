// Rate Limiting using Upstash Redis
// Prevents API abuse and ensures fair usage

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL || '',
    token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Check if Redis is configured
const isRedisConfigured = Boolean(
    process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN
);

// Create rate limiters for different resources
export const perUserRateLimit = isRedisConfigured
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(
            parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
            `${parseInt(process.env.RATE_LIMIT_WINDOW || '3600', 10)}s` // 1 hour window
        ),
        analytics: true,
        prefix: 'ratelimit:user',
    })
    : null;

export const perIPRateLimit = isRedisConfigured
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(20, '3600s'), // 20 requests per hour per IP
        analytics: true,
        prefix: 'ratelimit:ip',
    })
    : null;

// Global rate limit for all users combined
export const globalRateLimit = isRedisConfigured
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(100, '60s'), // 100 requests per minute globally
        analytics: true,
        prefix: 'ratelimit:global',
    })
    : null;

/**
 * Check rate limit for a user
 * @param userId - User ID to check
 * @returns Object with success status and limit info
 */
export async function checkUserRateLimit(userId: string) {
    if (!perUserRateLimit) {
        console.warn('⚠️  Rate limiting not configured (Redis not available)');
        return { success: true, limit: 0, remaining: 999, reset: 0 };
    }

    try {
        const identifier = `user:${userId}`;
        const result = await perUserRateLimit.limit(identifier);

        if (!result.success) {
            console.log(`🚫 Rate limit exceeded for user: ${userId}`);
        }

        return result;
    } catch (error) {
        console.error('Error checking user rate limit:', error);
        // Fail open - allow request  if rate limiting fails
        return { success: true, limit: 0, remaining: 0, reset: 0 };
    }
}

/**
 * Check rate limit for an IP address
 * @param ip - IP address to check
 * @returns Object with success status and limit info
 */
export async function checkIPRateLimit(ip: string) {
    if (!perIPRateLimit) {
        return { success: true, limit: 0, remaining: 999, reset: 0 };
    }

    try {
        const identifier = `ip:${ip}`;
        const result = await perIPRateLimit.limit(identifier);

        if (!result.success) {
            console.log(`🚫 Rate limit exceeded for IP: ${ip}`);
        }

        return result;
    } catch (error) {
        console.error('Error checking IP rate limit:', error);
        return { success: true, limit: 0, remaining: 0, reset: 0 };
    }
}

/**
 * Check global rate limit
 * @returns Object with success status and limit info
 */
export async function checkGlobalRateLimit() {
    if (!globalRateLimit) {
        return { success: true, limit: 0, remaining: 999, reset: 0 };
    }

    try {
        const result = await globalRateLimit.limit('global');

        if (!result.success) {
            console.log('🚫 Global rate limit exceeded');
        }

        return result;
    } catch (error) {
        console.error('Error checking global rate limit:', error);
        return { success: true, limit: 0, remaining: 0, reset: 0 };
    }
}

/**
 * Combined rate limit check (user + IP + global)
 * @param userId - User ID
 * @param ip - IP address
 * @returns Object with combined result
 */
export async function checkRateLimit(userId: string, ip: string) {
    const [userResult, ipResult, globalResult] = await Promise.all([
        checkUserRateLimit(userId),
        checkIPRateLimit(ip),
        checkGlobalRateLimit(),
    ]);

    // If any check fails, return failure
    if (!userResult.success) {
        return {
            success: false,
            reason: 'user_limit',
            message: `Too many requests. You can make ${userResult.limit} requests per hour. Try again in ${Math.ceil((userResult.reset - Date.now()) / 1000 / 60)} minutes.`,
            limit: userResult.limit,
            remaining: userResult.remaining,
            reset: userResult.reset,
        };
    }

    if (!ipResult.success) {
        return {
            success: false,
            reason: 'ip_limit',
            message: `Too many requests from this IP address. Try again in ${Math.ceil((ipResult.reset - Date.now()) / 1000 / 60)} minutes.`,
            limit: ipResult.limit,
            remaining: ipResult.remaining,
            reset: ipResult.reset,
        };
    }

    if (!globalResult.success) {
        return {
            success: false,
            reason: 'global_limit',
            message: 'System is currently experiencing high load. Please try again in a moment.',
            limit: globalResult.limit,
            remaining: globalResult.remaining,
            reset: globalResult.reset,
        };
    }

    return {
        success: true,
        userLimit: userResult.limit,
        userRemaining: userResult.remaining,
        ipLimit: ipResult.limit,
        ipRemaining: ipResult.remaining,
    };
}

/**
 * Reset rate limit for a user (admin function)
 * @param userId - User ID to reset
 */
export async function resetUserRateLimit(userId: string) {
    if (!isRedisConfigured) {
        return;
    }

    try {
        const identifier = `user:${userId}`;
        await redis.del(`ratelimit:user:${identifier}`);
        console.log(`✅ Rate limit reset for user: ${userId}`);
    } catch (error) {
        console.error('Error resetting user rate limit:', error);
    }
}

/**
 * Get rate limit status without consuming
 * @param userId - User ID
 * @returns Current rate limit status
 */
export async function getRateLimitStatus(userId: string) {
    if (!isRedisConfigured) {
        return {
            configured: false,
            limit: 0,
            remaining: 999,
            reset: 0,
        };
    }

    try {
        const identifier = `ratelimit:user:user:${userId}`;
        const count = await redis.get<number>(identifier);

        const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10);
        const remaining = Math.max(0, limit - (count || 0));

        return {
            configured: true,
            limit,
            remaining,
            used: count || 0,
        };
    } catch (error) {
        console.error('Error getting rate limit status:', error);
        return {
            configured: false,
            limit: 0,
            remaining: 0,
            used: 0,
        };
    }
}
