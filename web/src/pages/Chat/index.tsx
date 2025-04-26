import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { MessageCircleMore } from "lucide-react";
import { socket } from "../../lib/socket";
import { useEffect, useState } from "react";
import { ChatHead } from "./ChatHead";
import { MessageArea } from "./MessageArea";
import { ChatInput } from "./ChatInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { GET } from "../../lib/fetch";

export default function Chat({ className }: { className?: string }) {
	const [message, setMessage] = useState("");
	const queryClient = useQueryClient();
	const { chatId } = useParams();
	const { data: chat, isLoading: isLoadingChat } = useQuery<Chat>({
		queryKey: ["chat", chatId],
		queryFn: async () => {
			if (!chatId) return null;
			return await GET(`http://localhost:5000/conversations/${chatId}`);
		},
	});

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected");
		});

		socket.on("disconnect", () => {
			console.log("disconnected");
		});

		socket.on("sent_message", (msg) => {
			queryClient.setQueryData(["messages", chatId], (data: any) => {
				if (!data?.pages) return data;
				return {
					...data,
					pages: [
						{
							messages: [msg, ...(data.pages[0]?.messages || [])],
							nextCursor: data.pages[0]?.nextCursor,
						},
						...data.pages.slice(1),
					],
				};
			});
		});

		socket.on("recieve_message", (msg) => {
			queryClient.setQueryData(["messages", chatId], (data: any) => {
				if (!data?.pages) return data;
				return {
					...data,
					pages: [
						{
							messages: [msg, ...(data.pages[0]?.messages || [])],
							nextCursor: data.pages[0]?.nextCursor,
						},
						...data.pages.slice(1),
					],
				};
			});
		});
	}, [queryClient, chatId]);

	async function sendMsg(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!message) return;

		if (socket?.connected) {
			socket.emit(
				"send_message",
				{
					to: chatId,
					message,
				},
				chat.last_message === null
			);

			setMessage("");
		}
	}

	if (isLoadingChat) {
		return (
			<Card className={`flex justify-center items-center ${className}`}>
				<CardTitle className="text-2xl text-center opacity-40 flex items-center gap-1">
					<MessageCircleMore className="w-12 h-12" />
					Loading conversation...
				</CardTitle>
			</Card>
		);
	}

	if (!chatId) {
		return (
			<Card className={`flex justify-center items-center ${className}`}>
				<CardTitle className="text-2xl text-center opacity-40 flex items-center gap-1">
					<MessageCircleMore className="w-12 h-12" />
					Select a conversation to start chatting
				</CardTitle>
			</Card>
		);
	}

	return (
		<Card className={`flex flex-col ${className}`}>
			<CardHeader className="p-0">
				<ChatHead chat={chat} />
			</CardHeader>
			<MessageArea />
			<ChatInput
				value={message}
				onChange={setMessage}
				onSubmit={sendMsg}
			/>
		</Card>
	);
}
