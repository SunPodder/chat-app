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
				`https://api.dicebear.com/9.x/thumbs/png?seed=${Math.random()}`,
		)
		.notNull(),
	created_at: timestamp("created_at").defaultNow().notNull(),
});


export const Messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	text: text("message").notNull(),
	created_at: timestamp("created_at").defaultNow(),
	from: uuid("from_id")
		.notNull()
		.references(() => Users.id),

	to: uuid("to_id")
		.notNull()
		.references(() => Users.id),
});

export const Sessions = pgTable("sessions", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_id: uuid("user_id")
		.notNull()
		.references(() => Users.id),
});
