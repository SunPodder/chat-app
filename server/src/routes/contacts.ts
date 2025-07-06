import type e from "express";
import { db } from "../db";
import { Users } from "../schema";
import { ne } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	const contacts = await db.query.Users.findMany({
		where: ne(Users.id, (req.user.id + "") as string),
		with: {
			avatar: true,
		},
		columns: {
			email: false,
			password: false,
			created_at: false,
			updated_at: false,
		},
		limit: 10,
	});

	res.status(200).send(contacts);
}
