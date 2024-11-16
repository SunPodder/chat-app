import express from "express";
import { db } from "./db";
import { Messages } from "./schema";
import { eq } from "drizzle-orm";
import register from "./routes/register";
import login from "./routes/login";
import logout from "./routes/logout";
import contacts from "./routes/contacts";
import * as conversations from "./routes/conversations";
import user from "./routes/user";
import me from "./routes/me";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/@:username", user);
router.get("/me", me);
router.get("/contacts", contacts);
router.get("/conversations/list", conversations.list);
router.get("/conversations/user/:recipient_id", conversations.get);
router.post("/conversations/create", conversations.create);
router.get("/conversations/info/:id", conversations.info);

router.get("/messages/:id", async (req, res) => {
	const messages = await db
		.select()
		.from(Messages)
		.where(eq(Messages.conversation_id, req.params.id))
		.limit(20);

	res.status(200).send(messages);
});

export default router;
