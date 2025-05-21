import type e from "express";
import { zLoginUser } from "../../../common/zod_schema";
import { db, redis } from "../db";
import { Sessions, Users } from "../schema";
import { and, eq, getTableColumns } from "drizzle-orm";

export default async function (req: e.Request, res: e.Response) {
	try {
		zLoginUser.parse(req.body);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...fields } = getTableColumns(Users);

		const user = await db
			.select({ ...fields })
			.from(Users)
			.where(
				and(
					eq(Users.email, req.body.email),
					eq(Users.password, req.body.password)
				)
			) as ServerUser[];

		if (user.length === 0) {
			throw new Error("Invalid email or password");
		}

		const session: ServerSession = (
			await db
				.insert(Sessions)
				.values({
					user_id: user[0].id,
					expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
					ip: req.ip,
					user_agent: req.headers["user-agent"],
				})
				.returning()
		)[0];
		await redis.set(`session:${session.id}`, user[0].id);

		res.cookie("session", session.id, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.status(200).send(user[0]);
	} catch (error) {
		res.status(401).send(error.errors);
	}
}
