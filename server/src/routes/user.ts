import type e from "express";
import { db } from "../db";
import { Users } from "../schema";
import { eq } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	const user = await db.query.Users.findFirst({
		where: eq(Users.id, req.params["user_id"]),
		with: {
			avatar: true, // Include avatar if needed
		},
		columns: {
			email: false,
			password: false,
			created_at: false,
			updated_at: false,
		}
	})

	if (!user) {
		res.status(404).send("User not found");
		return;
	}

	res.status(200).send(user);
}
