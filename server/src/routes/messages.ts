import type e from "express";
import { Messages } from "../schema";
import { and, desc, eq, or } from "drizzle-orm";
import { db } from "../db";


export async function get(req: e.Request, res: e.Response) {
	const currentUserId = req["user"].id;
	const buddyId = req.params["buddy_id"];
	const offset = parseInt(req.query["offset"] as string) || 0;
	const limit = parseInt(req.query["limit"] as string) || 20;

	const messages = await db.query.Messages.findMany({
		orderBy: desc(Messages.created_at),
		where: and(
			or(
				eq(Messages.from, currentUserId),
				eq(Messages.to, currentUserId)
			),
			or(
				eq(Messages.from, buddyId),
				eq(Messages.to, buddyId)
			)
		),
		limit: limit,
		offset: offset,
		with: {
			media: true
		}
	});
	
	return res.status(200).send(messages);
}
