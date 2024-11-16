import type e from "express";
import { db } from "../db";
import { Users } from "../schema";
import { eq } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response, param) {
	const users = await db
		.select()
		.from(Users)
		.where(eq(param, req.params.param));

	if (users.length === 0) {
		res.status(404).send("User not found");
		return;
	}
	const user = users[0] as { password?: string; email?: string };
	delete user.password;
	delete user.email;

	res.status(200).send(user);
}
