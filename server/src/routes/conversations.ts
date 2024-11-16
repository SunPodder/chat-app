import type e from "express";
import { db } from "../db";
import { Users } from "../schema";
import { eq, sql } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	const { id } = req.user;
	const records = await db.execute(
		sql.raw(`
			WITH ranked_messages AS (
    			SELECT *, ROW_NUMBER() OVER (
            		PARTITION BY LEAST("from_id", "to_id"), GREATEST("from_id", "to_id")
               		ORDER BY "created_at" DESC
           		) AS rn
    			FROM messages WHERE "from_id" = '${id}' OR "to_id" = '${id}'
			)
			SELECT * FROM ranked_messages WHERE rn = 1 ORDER BY created_at DESC;
		`)
	);
	const conversations = await Promise.all(
		records.map(async (record) => {
			const other_id =
				record.from_id === id ? record.to_id : record.from_id;
			const to = await db
				.select()
				.from(Users)
				.where(eq(Users.id, other_id));
			const last_message = {
				text: record.message,
				created_at: record.created_at,
				from: record.from_id,
				to: record.to_id,
			};
			return {
				to: to[0],
				last_message,
			};
		})
	);

	res.json(conversations);
}
