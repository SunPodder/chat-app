import { getTableColumns } from "drizzle-orm";
import { zRegisterUser } from "../../../common/zod_schema";
import { db, redis } from "../db";
import { Sessions, Users } from "../schema";
import type e from "express";

export default async function (req: e.Request, res: e.Response) {
	try {
		zRegisterUser.parse(req.body);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...fields } = getTableColumns(Users);
		const user: ServerUser = (
			await db
				.insert(Users)
				.values(req.body)
				.returning({ ...fields })
		)[0];
		const session: string = (
			await db
				.insert(Sessions)
				.values({
					user_id: user.id,
					expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
					ip: req.ip,
					user_agent: req.headers["user-agent"],
				})
				.returning()
		)[0].id;

		await redis.set(`session:${session}`, user.id);

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
