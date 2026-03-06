import { Redis } from '@upstash/redis';

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// check connection
(async () => {
    try {
        const pong = await redis.ping(); // ping server
        console.log("✅ Redis connection successful:", pong); // عادة بيرجع "PONG"
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
    }
})();