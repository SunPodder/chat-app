import { db, redis } from "./db";
import type e from "express";
import { Sessions, Users } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Verifies the session of the user
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function VerifySession(
	req: e.Request,
	res: e.Response,
	next: e.NextFunction
) {
	// Allow login and register without session verification
	if (req.url === "/login" || req.url === "/register") {
		next();
		return;
	}

	const token = req.cookies["session"];
	if (!token) {
		res.status(401).send("Unauthorized");
		return;
	}

	// Check if the session is in the cache
	let user_id = await redis.get(`session:${token}`);
	if (!user_id) {
		try {
			// check if the session is in the database
			const session = await db
				.select()
				.from(Sessions)
				.where(eq(Sessions.id, token));

			// session not found
			if (session.length === 0) {
				res.status(401).send("Unauthorized");
				return;
			}

			// cache the session
			await redis.set(`session:${token}`, session[0].user_id);
			user_id = session[0].user_id;
		} catch (e) {
			console.log(e.message);
		}
	}

	// get the user from the database
	req.user = (await db.select().from(Users).where(eq(Users.id, user_id)))[0];
	
	next();
}
