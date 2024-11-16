import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { useAtomValue } from "jotai";
import { activeConversation } from "../../lib/store";
import { MessageCircleMore } from "lucide-react";
import { GET } from "../../lib/fetch";
import { socket } from "../../lib/socket";
import { useEffect, useState } from "react";
import { ChatHead } from "./ChatHead";
import { MessageArea } from "./MessageArea";
import { ChatInput } from "./ChatInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Chat({ className }: { className?: string }) {
	const chat: any = useAtomValue(activeConversation);
	const [message, setMessage] = useState("");
	const queryClient = useQueryClient();
	const {
		data: messages,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["messages"],
		queryFn: async () => {
			if (!chat) return [];
			return await GET(`http://localhost:5000/messages/${chat.to.id}`);
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
			queryClient.setQueryData(["messages"], (data: any) => {
				return [...data, msg];
			});
		});

		socket.on("recieve_message", (msg) => {
			queryClient.setQueryData(["messages"], (data: any) => {
				return [...data, msg];
			});
		});
	}, [queryClient]);

	useEffect(() => {
		refetch();
	}, [chat, refetch]);

	/**
	 * Handles sending a message.
	 *
	 * 1. Prevents the default form submission behavior.
	 * 2. Checks if the message is empty and returns early if it is.
	 * 3. If the conversation ID is not defined:
	 *    - Sends a POST request to create a new conversation using the recipient's profile ID.
	 *    - Updates the conversation state with the new conversation ID.
	 * 4. If the socket is connected:
	 *    - Adds the new message to the messages state.
	 *    - Emits the message event with the conversation ID and message.
	 *
	 * @param e - The form submission event.
	 */
	async function sendMsg(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!message) return;

		if (socket?.connected) {
			socket.emit(
				"send_message",
				{
					to: chat.to.id,
					message,
				},
				messages.length == 0
			);

			setMessage("");
		}
	}

	if (!chat) {
		return (
			<Card className={`flex justify-center items-center ${className}`}>
				<CardTitle className="text-2xl text-center opacity-40 flex items-center gap-1">
					<MessageCircleMore className="w-12 h-12" />
					Select a conversation to start chatting
				</CardTitle>
			</Card>
		);
	}

	if (isLoading) {
		return "Loading...";
	}

	if (error) {
		return "error";
	}

	return (
		<Card className={`flex flex-col ${className}`}>
			<CardHeader className="p-0">
				<ChatHead chat={chat} />
			</CardHeader>
			<CardContent className="flex-grow mb-5">
				<MessageArea messages={messages} />
			</CardContent>
			<CardFooter className="h-[56px]">
				<ChatInput
					value={message}
					onChange={setMessage}
					onSubmit={sendMsg}
				/>
			</CardFooter>
		</Card>
	);
}
