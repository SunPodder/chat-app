import { sql } from "drizzle-orm";
import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const Media = pgTable("media", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_id: uuid("user_id")
		.notNull()
		.references(() => Users.id, { onDelete: "cascade" }),
	created_at: timestamp("created_at").defaultNow().notNull(),
	url: text("url").notNull(),
	type: text("type").notNull(),
	thumbnail: text("thumbnail"),
});

export const Users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: json("name").$type<{ first: string; last: string }>().notNull(),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	avatar: uuid("avatar")
		.references(() => Media.id, { onDelete: "set null" }),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
	last_online: timestamp("last_online").defaultNow().notNull(),
});

export const Messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	text: text("text").notNull(),
	created_at: timestamp("created_at").defaultNow(),
	from: uuid("from_id")
		.notNull()
		.references(() => Users.id),

	to: uuid("to_id")
		.notNull()
		.references(() => Users.id),
	media: uuid("media_id")
		.references(() => Media.id)
		.array()
		.default(sql`'{}'::uuid[]`),
});

export const Sessions = pgTable("sessions", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_id: uuid("user_id")
		.notNull()
		.references(() => Users.id),
	created_at: timestamp("created_at").defaultNow().notNull(),
	expires_at: timestamp("expires_at").notNull(),
	ip: text("ip").notNull(),
	user_agent: text("user_agent").notNull(),
});
