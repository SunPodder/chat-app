import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/schema.ts",
	out: "./migrations",
	dbCredentials: {
		host: (process.env.DB_HOST as string) || "localhost",
		port: parseInt(process.env.DB_PORT as string) || 5432,
		user: (process.env.DB_USER as string) || "postgres",
		database: (process.env.DB_NAME as string) || "rchat",
		password: (process.env.DB_PASSWORD as string) || "password",
	},
	verbose: true,
	strict: true,
	dialect: "postgresql",
});
