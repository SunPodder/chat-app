import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "redis";

const queryClient = postgres(process.env.DB_URL as string);
export const db = drizzle(queryClient);

export const redis = createClient();
await redis.connect();

redis.on("error", (err) => console.error("Redis Client Error", err));
