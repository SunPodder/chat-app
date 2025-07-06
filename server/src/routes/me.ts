import type e from "express";
import { vProfile } from "../../../common/zod_schema";
import * as v from 'valibot';
import { db } from "../db";
import { Media, Users } from "../schema";
import { eq, getTableColumns } from "drizzle-orm";

export async function get(req: e.Request, res: e.Response) {
	res.status(200).send(req.user);
}

export async function edit(req: e.Request, res: e.Response) {
	try {
		req.body.name = JSON.parse(req.body.name);
		v.parse(vProfile, req.body);
		const val = {
			name: req.body.name,
			username: req.body.username,
			email: req.body.email,
		};

		if (req["file"]) {
			if (!req["file"].mimetype.startsWith("image")) {
				throw new Error("Invalid file type");
			}

			const media = await db
				.insert(Media)
				.values({
					user_id: req.user.id,
					type: req.file.mimetype,
					url:
						"http://localhost:5000/uploads/" + req.file.filename,
				})
				.returning()
				.then((res) => res[0] as Media);

			val["avatar"] = media.id;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...fields } = getTableColumns(Users);
		const user = (
			await db
				.update(Users)
				.set(val)
				.where(eq(Users.id, req.user.id))
				.returning({...fields})
		)[0] as User;
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
}
