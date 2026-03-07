import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config({ path: "./src/config/.env.dev" });

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})


// check connection
export const checkRedisConnection = async () => {
    try {
        const pong = await redis.ping();
        console.log("✅ Redis connection successful:", pong);
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
    }
}