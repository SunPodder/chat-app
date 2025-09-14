import type e from "express";
import * as v from "valibot";
import { vLoginUser } from "../../../common/zod_schema";
import { db, redis } from "../db";
import { Sessions, Users } from "../schema";
import { and, eq } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	try {
		v.parse(vLoginUser, req.body);

		const user = await db.query.Users.findFirst({
			where: and(
				eq(Users.email, req.body.email),
				eq(Users.password, req.body.password)
			),
			with: {
				avatar: true,
			},
			columns: {
				password: false,
			},
		}) as User | undefined;

		if (!user) {
			throw new Error("Invalid email or password");
		}

		const session: Session = (
			await db
				.insert(Sessions)
				.values({
					user_id: user.id,
					expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
					ip: req.ip,
					user_agent: req.headers["user-agent"],
				})
				.returning()
		)[0];
		await redis.set(`session:${session.id}`, user.id);

		res.cookie("session", session.id, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.status(200).send(user[0]);
	} catch (error) {
		console.log(error)
		res.status(401).send(error.errors);
	}
}
