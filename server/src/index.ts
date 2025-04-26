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
	const session = cookie.parse(
		socket.request.headers.cookie as string
	)["session"];
	if (!session) {
		socket.disconnect();
		return;
	}
	console.log("SOCKET: " + socket.id + " connected");

	const user_id = await redis.get(`session:${session}`);
	await redis.set(`socket:${user_id}`, socket.id);

	const sokcet_user = (
		await db.select().from(Users).where(eq(Users.id, user_id))
	)[0];

	socket.on("send_message", async (data, chat_user) => {
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

		if (chat_user) {
			chat_user = (
				await db.select().from(Users).where(eq(Users.id, data.to))
			)[0];
		}

		const toSocket = await redis.get(`socket:${data.to}`);
		if (toSocket) {
			socket.to(toSocket).emit("recieve_message", msg, sokcet_user);
		}
		socket.emit("sent_message", msg, chat_user);
	});

	socket.on("disconnect", async () => {
		await redis.del(`socket:${user_id}`);
		console.log("SOCKET: " + socket.id + " disconnected");
	});
});

server.listen(5000, () => {
	console.log("🚀🚀🚀 Server running on http://localhost:5000 🚀🚀🚀");
});
