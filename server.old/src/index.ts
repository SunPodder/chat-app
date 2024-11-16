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
import { Conversations, Messages } from "./schema";
import { arrayContains } from "drizzle-orm";

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
	const session = cookie.parse(
		socket.request.headers.cookie as string
	).session;
	if (!session) {
		socket.disconnect();
		return;
	}

	console.log("SOCKET: " + socket.id + " connected");

	const user_id = await redis.get(`session:${session}`);
	await redis.set(`socket:${user_id}`, socket.id);

	socket.on("new_message", async (data) => {
		console.log(data);
		
		const msg = (
			await db
				.insert(Messages)
				.values({
					text: data.message,
					conversation_id: data.conversation_id,
					user_id: user_id,
				})
				.returning()
		)[0];

		const conversation = await db
			.select()
			.from(Conversations)
			.where(arrayContains(Conversations.users, [user_id as string]));

		const recipient_id = conversation[0].users.find((u) => u !== user_id);
		const recipient_socket = await redis.get(`socket:${recipient_id}`);

		io.to(recipient_socket).emit("new_message", msg);
		io.to(socket.id).emit("new_message", msg);
	});

	socket.on("disconnect", async () => {
		await redis.del(`socket:${user_id}`);
		console.log("SOCKET: " + socket.id + " disconnected");
	});
});

server.listen(5000, () => {
	console.log("🚀🚀🚀 Server running on http://localhost:5000 🚀🚀🚀");
});
