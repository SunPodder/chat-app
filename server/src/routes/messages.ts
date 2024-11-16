import type e from "express";
import { Messages } from "../schema";
import { eq, or } from "drizzle-orm";
import { db } from "../db";

export async function get(req: e.Request, res: e.Response) {
	console.log(req.params.id);
	
	const messages = await db
		.select()
		.from(Messages)
		.where(
			or(eq(Messages.from, req.params.id), eq(Messages.to, req.params.id))
		)
		.limit(20);

	res.status(200).send(messages);
}
