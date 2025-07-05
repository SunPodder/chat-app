import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import CookieParser from "cookie-parser";
import routes from "./routes";
import { VerifySession } from "./authentication";
import morgan from "morgan";
import cookie from "cookie";
import { db, redis } from "./db";
import { Messages, Users } from "./schema";
import { eq } from "drizzle-orm";

const app = express();
const server = http.createServer(app);
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(CookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("common"));
app.use(VerifySession);
app.use(routes);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		credentials: true,
	},
});
io.on("connection", async (socket) => {
	const session = cookie.parse(socket.request.headers.cookie as string)[
		"session"
	];
	if (!session) {
		socket.disconnect();
		return;
	}

	const user_id = await redis.get(`session:${session}`);
	if (!user_id) {
		socket.disconnect();
		return;
	}

	// cache the socket id in redis
	// this will be used to send messages to the user
	await redis.set(`socket:${user_id}`, socket.id);

	const socket_user = (
		await db.select().from(Users).where(eq(Users.id, user_id))
	)[0] as User;

	await db
		.update(Users)
		.set({ last_online: new Date() })
		.where(eq(Users.id, user_id));

	socket.on("send_message", async (data, send_back_user) => {
		const msg = (
			await db
				.insert(Messages)
				.values({
					from: user_id,
					to: data.to,
					text: data.message,
				})
				.returning()
		)[0];
		let chat_user: User | undefined = undefined;

		if (send_back_user) {
			chat_user = (
				await db.select().from(Users).where(eq(Users.id, data.to))
			)[0] as User;
		}

		const toSocket = await redis.get(`socket:${data.to}`);

		if (toSocket) {
			socket.to(toSocket).emit("recieve_message", msg, socket_user);
		}
		socket.emit("sent_message", msg, chat_user);
	});

	socket.on("typing", async ({ chatId, isTyping }) => {
		const toSocket = await redis.get(`socket:${chatId}`);

		if (toSocket) {
			socket.to(toSocket).emit("typing", socket_user.id, isTyping);
		}
	});

	socket.on("disconnect", async () => {
		await redis.del(`socket:${user_id}`);
		console.log("SOCKET: " + socket.id + " disconnected");
	});
});

server.listen(5000, () => {
	console.log("🚀🚀🚀 Server running on http://localhost:5000 🚀🚀🚀");
});
