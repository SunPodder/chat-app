import type e from "express";

export default async function (req: e.Request, res: e.Response) {
	const user = req.user;
	res.status(200).send(user);
	return
	delete (user as { password?: string }).password;

	res.status(200).send(user);
}
