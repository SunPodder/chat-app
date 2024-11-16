import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

async function main() {
	const migrationClient = postgres(process.env.DB_URL as string);
	await migrate(drizzle(migrationClient), {
		migrationsFolder: "./migrations",
	});

	await migrationClient.end();
}

main().catch(console.error);
