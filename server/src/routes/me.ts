import type e from "express";
import { zProfile } from "../../../common/zod_schema";
import { db } from "../db";
import { Media, Users } from "../schema";
import { eq, getTableColumns } from "drizzle-orm";

export async function get(req: e.Request, res: e.Response) {
	const user = req["user"];
	const media = await db
		.select()
		.from(Media)
		.where(eq(Media.user_id, user.id))
		.then((res) => res[0] as Media);

	if (!media) {
		res.status(404).send({ error: "Media not found" });
		return;
	}

	const userData: ClientUser = { ...user, avatar: media };

	res.status(200).send(userData);
}

export async function edit(req: e.Request, res: e.Response) {
	try {
		req.body.name = JSON.parse(req.body.name);
		zProfile.parse(req.body);
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
					user_id: req["user"].id,
					type: req["file"].mimetype,
					url:
						"http://localhost:5000/uploads/" + req["file"].filename,
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
				.where(eq(Users.id, req["user"].id))
				.returning({...fields})
		)[0] as ServerUser;
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.errors);
	}
}
