import type e from "express";
import { db } from "../db";
import { Users } from "../schema";
import { ne } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	const contacts = await db
		.select()
		.from(Users)
		.where(ne(Users.id, (req.user.id + "") as string))
		.limit(10);

	contacts.forEach((contact) => {
		delete (contact as { password?: string }).password;
		delete (contact as { email?: string }).email;
	});

	res.status(200).send(contacts);
}
