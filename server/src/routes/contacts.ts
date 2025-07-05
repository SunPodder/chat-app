import type e from "express";
import { db } from "../db";
import { Media, Users } from "../schema";
import { eq, getTableColumns, ne } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	const {email, password, ...fields} = getTableColumns(Users);
	const contacts = await db
		.select({
			...fields,
			avatar: Media
		})
		.from(Users)
		.where(ne(Users.id, (req.user.id + "") as string))
		.limit(10)
		.leftJoin(Media, eq(Users.id, Media.user_id));

		console.log(contacts);
		

	res.status(200).send(contacts);
}
