import type e from "express";
import { db } from "../db";
import { Messages, Users } from "../schema";
import { and, desc, eq, or, sql } from "drizzle-orm";

export async function get(req: e.Request, res: e.Response) {
	const buddyId = req.params["buddy_id"];
	const currentUserId = req.user.id;

	const buddy = await db
		.select()
		.from(Users)
		.where(eq(Users.id, buddyId))
		.limit(1);

	if (buddy.length === 0) {
		return res.status(404).json({ error: "Buddy not found" });
	}

	const last_message = await db
		.select()
		.from(Messages)
		.where(
			and(
				// One participant must be the current user
				or(
					eq(Messages.from, currentUserId),
					eq(Messages.to, currentUserId)
				),
				// Other participant must be the requested user
				or(eq(Messages.from, buddyId), eq(Messages.to, buddyId))
			)
		)
		.orderBy(desc(Messages.created_at))
		.limit(1);

	const buddy_info = buddy[0];
	const last_message_info = last_message[0] ?? null;

	res.json({
		to: buddy_info,
		last_message: last_message_info,
	});
}

export async function list(req: e.Request, res: e.Response) {
	const { id: user_id } = req.user;
	const records = await db.execute(
		sql.raw(`
			WITH ranked_messages AS (
    			SELECT *, ROW_NUMBER() OVER (
            		PARTITION BY LEAST("from_id", "to_id"), GREATEST("from_id", "to_id")
               		ORDER BY "created_at" DESC
           		) AS rn
    			FROM messages WHERE "from_id" = '${user_id}' OR "to_id" = '${user_id}'
			)
			SELECT * FROM ranked_messages WHERE rn = 1 ORDER BY created_at DESC;
		`)
	);
	const conversations = await Promise.all(
		records.map(async (record) => {
			const buddy_id =
				record["from_id"] === user_id
					? (record["to_id"] as string)
					: (record["from_id"] as string);
			const to = await db
				.select()
				.from(Users)
				.where(eq(Users.id, buddy_id));
			const last_message = {
				text: record["message"],
				created_at: record["created_at"],
				from: record["from_id"],
				to: record["to_id"],
			};
			return {
				to: to[0],
				last_message,
			};
		})
	);

	res.json(conversations);
}
