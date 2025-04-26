import type e from "express";
import { zProfile } from "../../../common/zod_schema";
import { db } from "../db";
import { Users } from "../schema";
import { eq } from "drizzle-orm";

export async function get(req: e.Request, res: e.Response) {
	const user = req.user;
	delete (user as { password?: string }).password;

	res.status(200).send(user);
}

export async function edit(req: e.Request, res: e.Response) {
	try {
		req.body.name = JSON.parse(req.body.name);
		zProfile.parse(req.body);
		const val = {
			name: req.body.name,
			username: req.body.username,
			email: req.body.email,
		}

		if (req.file) {
			if (!req.file.mimetype.startsWith("image")) {
				throw new Error("Invalid file type");
			}
			val["avatar"] = 'http://localhost:5000/uploads/' + req.file.filename;
		}

		const user = (await db.update(Users).set(val).where(eq(Users.id, req.user.id)).returning())[0];
		delete (user as { password?: string }).password;
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.errors);
	}
}
