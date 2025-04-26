import type e from "express";
import { redis } from "../db";

export default async function (req: e.Request, res: e.Response) {
	try {
		await redis.del(req.cookies["session"]);
		res.clearCookie("session");
		res.status(200).send("Logged out");
	} catch (error) {
		res.status(400).send(error.errors);
	}
}
