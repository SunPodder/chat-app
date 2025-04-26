import { zRegisterUser } from "../../../common/zod_schema";
import { db, redis } from "../db";
import { Sessions, Users } from "../schema";
import type e from "express";

export default async function (req: e.Request, res: e.Response) {
	try {
		zRegisterUser.parse(req.body);

		const user = (await db.insert(Users).values(req.body).returning())[0];
		const session = (
			await db.insert(Sessions).values({ user_id: user.id }).returning()
		)[0].id;

		await redis.set(`session:${session}`, user.id);

		delete (user as { password?: string }).password;

		res.cookie("session", session, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.status(200).send(user);
	} catch (err) {
		console.log(err);

		res.status(401).send(err);
		return;
	}
}
