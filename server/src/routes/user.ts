import type e from "express";
import { db } from "../db";
import { Users } from "../schema";
import { eq } from "drizzle-orm";
import type { User } from "./types";

export default async function (req: e.Request, res: e.Response, param) {
	const users = await db
		.select()
		.from(Users)
		.where(eq(param, req.params["user_id"]));

	if (users.length === 0) {
		res.status(404).send("User not found");
		return;
	}
	const user: User = users[0];
	delete user.password;
	delete user.email;
	delete user.created_at;

	res.status(200).send(user);
}
