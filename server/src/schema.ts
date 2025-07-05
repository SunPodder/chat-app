import { relations } from "drizzle-orm";
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
	message_id: uuid("message_id").references(() => Messages.id, {
		onDelete: "cascade",
	}),
});

export const Users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: json("name").$type<{ first: string; last: string }>().notNull(),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	avatar: uuid("avatar").references(() => Media.id, { onDelete: "set null" }),
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

export const SessionsRelations = relations(Sessions, ({ one }) => ({
	user: one(Users, {
		fields: [Sessions.user_id],
		references: [Users.id],
	}),
}));

export const MediaRelations = relations(Media, ({ one }) => ({
	message: one(Messages, {
		fields: [Media.message_id],
		references: [Messages.id],
	}),
}));

export const MessagesRelations = relations(Messages, ({ many, one }) => ({
	media: many(Media),
	sender: one(Users, {
		fields: [Messages.from],
		references: [Users.id],
		relationName: "sent",
	}),
	receiver: one(Users, {
		fields: [Messages.to],
		references: [Users.id],
		relationName: "recieved",
	}),
}));

export const UsersRelations = relations(Users, ({ many, one }) => ({
	sent_messages: many(Messages, {
		relationName: "sent",
	}),
	recieved_messages: many(Messages, {
		relationName: "recieved",
	}),
	avatar: one(Media, {
		fields: [Users.avatar],
		references: [Media.id],
	}),
	sessions: many(Sessions),
}));
