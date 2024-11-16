import { redis } from "../db";
import type { UserRequest } from "./types";
import type { Request } from "express";

export default async function (req: UserRequest, res: Request) {
	try {
		await redis.del(req.cookies.session);
		res.clearCookie("session");
		res.status(200).send("Logged out");
	} catch (error: any) {
		res.status(400).send(error.errors);
	}
}
