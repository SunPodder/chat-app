import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: json("name").$type<{ first: string; last: string }>().notNull(),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	avatar: text("avatar")
		.$defaultFn(
			() =>
				`https://api.dicebear.com/9.x/lorelei/png?seed=${Math.random()}`,
		)
		.notNull(),
	created_at: timestamp("created_at").defaultNow().notNull(),
});

export const Conversations = pgTable("conversations", {
	id: uuid("id").defaultRandom().primaryKey(),
	users: text("users").array().notNull(),
	created_at: timestamp("created_at").defaultNow(),
});

export const Messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	text: text("message").notNull(),
	created_at: timestamp("created_at").defaultNow(),
	user_id: uuid("user_id")
		.notNull()
		.references(() => Users.id),

	conversation_id: uuid("conversation_id")
		.notNull()
		.references(() => Conversations.id),
});

export const Sessions = pgTable("sessions", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_id: uuid("user_id")
		.notNull()
		.references(() => Users.id),
});
