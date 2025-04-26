import type e from "express";
import { zLoginUser } from "../../../common/zod_schema";
import { db, redis } from "../db";
import { Sessions, Users } from "../schema";
import { and, eq } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	try {
		zLoginUser.parse(req.body);

		const user = await db
			.select()
			.from(Users)
			.where(
				and(
					eq(Users.email, req.body.email),
					eq(Users.password, req.body.password),
				),
			);

		if (user.length === 0) {
			throw new Error("Invalid email or password");
		}

		const session = (
			await db
				.insert(Sessions)
				.values({ user_id: user[0].id })
				.returning()
		)[0].id;
		await redis.set(`session:${session}`, user[0].id);

		delete (user[0] as { password?: string }).password;

		res.cookie("session", session, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.status(200).send(user[0]);
	} catch (error) {
		res.status(401).send(error.errors);
	}
}
