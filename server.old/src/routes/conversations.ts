import type e from "express";
import { db } from "../db";
import { Conversations, Messages, Users } from "../schema";
import { arrayContains, desc, eq } from "drizzle-orm";

/**
 * Get conversation by recipient_id
 */
export async function get(req: e.Request, res: e.Response) {
	const { recipient_id } = req.params;
	const user_id = req.user.id;
	const existingConversation = (
		await db
			.select()
			.from(Conversations)
			.where(arrayContains(Conversations.users, [user_id, recipient_id]))
	)[0];

	if (existingConversation) {
		return res.status(200).json({ id: existingConversation.id });
	}

	return res.status(404).json({ id: null });
}

async function formatConversation(conversation, recipient_id) {
	const recipient = (
		await db.select().from(Users).where(eq(Users.id, recipient_id))
	)[0];

	if (recipient) {
		conversation.name = recipient.name;
		conversation.avatar = recipient.avatar;
	}

	const lastMsg = (
		await db
			.select()
			.from(Messages)
			.where(eq(Messages.conversation_id, conversation.id))
			.orderBy(desc(Messages.created_at))
			.limit(1)
	)[0];
	if (lastMsg) {
		// tslint-disable
		let d = new Date(lastMsg.created_at);
		// if today, show only time
		// if yesterday, show "Yesterday"
		// else show date
		let today = new Date();
		if (
			d.getDate() === today.getDate() &&
			d.getMonth() === today.getMonth() &&
			d.getFullYear() === today.getFullYear()
		) {
			lastMsg.created_at = d.toLocaleTimeString();
		} else if (
			d.getDate() === today.getDate() - 1 &&
			d.getMonth() === today.getMonth() &&
			d.getFullYear() === today.getFullYear()
		) {
			lastMsg.created_at = "Yesterday";
		} else {
			lastMsg.created_at = d.toLocaleDateString();
		}
		conversation.lastMessage = lastMsg;
	}
	return conversation;
}

export async function info(req: e.Request, res: e.Response) {
	const user_id = req.user.id;
	const conversation_id = req.params.id;
	let conversation = (
		await db
			.select()
			.from(Conversations)
			.where(eq(Conversations.id, conversation_id))
	)[0];

	if (!conversation) {
		return res.status(404).json({ error: "Conversation not found" });
	}

	if (!conversation.users.includes(user_id)) {
		return res.status(403).json({ error: "Forbidden" });
	}

	const recipient_id = conversation.users.find((id) => id !== user_id);

	conversation = await formatConversation(conversation, recipient_id);
	res.status(200).json(conversation);
}

export async function create(req: e.Request, res: e.Response) {
	const { recipient_id } = req.body;
	const user_id = req.user.id;

	// Check if conversation already exists
	const existingConversation = (
		await db
			.select()
			.from(Conversations)
			.where(arrayContains(Conversations.users, [user_id, recipient_id]))
	)[0];

	if (existingConversation) {
		return res.status(200).json({ id: existingConversation.id });
	}

	// Create new conversation
	const conversation = (
		await db
			.insert(Conversations)
			.values({
				users: [user_id, recipient_id],
			})
			.returning()
	)[0];

	res.status(201).json(conversation);
}

export async function list(req: e.Request, res: e.Response) {
	const user_id = req.user.id;

	const conversations = await db
		.select()
		.from(Conversations)
		.where(arrayContains(Conversations.users, [user_id]));

	for (let conversation of conversations) {
		const recipient_id = conversation.users.find((id) => id !== user_id);
		if (recipient_id)
			conversation = await formatConversation(conversation, recipient_id);
	}
	res.status(200).send(conversations);
}
