import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "redis";
import * as schema from "./schema";

const queryClient = postgres(
	(process.env["DB_URL"] as string) ||
		"postgres://postgres:password@localhost:5432/rchat"
);
export const db = drizzle(queryClient, { schema });

export const redis = createClient();
await redis.connect();

redis.on("error", (err) => console.error("Redis Client Error", err));
