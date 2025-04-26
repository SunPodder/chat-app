import type e from "express";
import { Messages } from "../schema";
import { and, desc, eq, or } from "drizzle-orm";
import { db } from "../db";

export async function get(req: e.Request, res: e.Response) {
	const currentUserId = req.user.id;
	const buddyId = req.params["buddy_id"]
	const offset = parseInt(req.query["offset"] as string) || 0;
	const limit = parseInt(req.query["limit"] as string) || 20;
	
	const messages = await db
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
		.offset(offset)
		.limit(limit);

	res.status(200).send(messages);
}
