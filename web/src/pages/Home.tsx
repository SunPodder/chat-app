// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { activeConversation, User } from "../lib/store";
import { useAtomValue, useSetAtom } from "jotai";
import { GET } from "../lib/fetch";
import { socket } from "../lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const formatDate = (dateStr: Date) => {
	const date = new Date(dateStr);
	const now = new Date();
	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();
	const isYesterday =
		date.getDate() === now.getDate() - 1 &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	if (isToday) {
		return date.toLocaleTimeString();
	} else if (isYesterday) {
		return "Yesterday";
	} else {
		return date.toLocaleDateString();
	}
};

export default function Home() {
	const setActiveConv = useSetAtom(activeConversation);
	const user = useAtomValue(User);
	const queryClient = useQueryClient();
	const {
		data: chats,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["chats"],
		queryFn: () => GET("http://localhost:5000/conversations/"),
	});

	useEffect(() => {
		socket.on("sent_message", (msg, user) => {
			queryClient.setQueryData(["chats"], (data: Array<object>) => {
				if (!data) return data;
				const chatIndex = data.findIndex(
					// we're sending message, so we're the from
					// chat.to is the user we're sending the message to
					(chat: object) => chat.to.id === msg.to
				);

				if (chatIndex !== -1) {
					const updatedChat = {
						to: data[chatIndex].to,
						last_message: msg,
					};

					return [
						updatedChat,
						...data.slice(0, chatIndex),
						...data.slice(chatIndex + 1),
					];
				} else {
					return [{ last_message: msg, to: user }, ...data];
				}
			});
		});

		socket.on("recieve_message", (msg, user) => {
			queryClient.setQueryData(["chats"], (data: Array<object>) => {
				if (!data) return data;
				const chatIndex = data.findIndex(
					// we're recieving message, so we're the to
					// chat.to is the user who sent the message
					(chat: object) => chat.to.id === msg.from
				);

				if (chatIndex !== -1) {
					const updatedChat = {
						to: data[chatIndex].to,
						last_message: msg,
					};

					return [
						updatedChat,
						...data.slice(0, chatIndex),
						...data.slice(chatIndex + 1),
					];
				} else {
					return [{ last_message: msg, to: user }, ...data];
				}
			});
		});
	}, [queryClient]);

	function searchChat(s: string) {
		const q = s.toLowerCase();
		if (q === "") {
			// sort based on created_at
			queryClient.setQueryData(["chats"], (data: Array<object>) => {
				return [...data].sort((a: object, b: object) => {
					return (
						new Date(b.last_message.created_at) -
						new Date(a.last_message.created_at)
					);
				});
			});
		}

		// return all chats
		// but put those on top that match the query
		queryClient.setQueryData(["chats"], (data: any) => {
			return [...data].sort((a: any, b: any) => {
				const aName =
					`${a.to.name.first} ${a.to.name.last}`.toLowerCase();
				const bName =
					`${b.to.name.first} ${b.to.name.last}`.toLowerCase();

				if (aName.includes(q) && !bName.includes(q)) {
					return -1;
				} else if (!aName.includes(q) && bName.includes(q)) {
					return 1;
				} else {
					return 0;
				}
			});
		});
		console.log(s);
	}

	function openChat(conv) {
		setActiveConv({ ...conv });
	}

	if (error) return <div>Error: {error.message}</div>;
	if (isLoading) return <div>Loading...</div>;

	return (
		<Card className="w-full h-full flex flex-col">
			<CardHeader>
				<CardTitle className="py-2 flex items-center">
					<span className="flex-1">Chats</span>
				</CardTitle>

				<div className="flex items-center">
					<Input
						type="text"
						placeholder="Search conversations"
						onChange={(e) => searchChat(e.target.value)}
					/>
				</div>
			</CardHeader>
			<CardContent>
				<ul type="none">
					{chats.map((chat: any, i) => (
						<li
							key={i}
							className="mb-2 p-4 cursor-pointer border-t border-b border-gray-200 grid gap-1"
							onClick={() => openChat(chat)}
						>
							<div className="flex items-center w-full h-full gap-2">
								<Avatar className="w-8 h-8">
									<AvatarImage
										src={chat.to.avatar}
										alt={chat.to.name.first}
									/>
									<AvatarFallback>
										{chat.to.name.first[0]}
									</AvatarFallback>
								</Avatar>
								<div className="font-semibold">
									{chat.to.name.first} {chat.to.name.last}
								</div>
							</div>
							<div>
								<small className="ml-3 flex">
									<span className="flex-1">
										{chat.last_message.from === user?.id &&
											"You: "}
										{chat.last_message.text}
									</span>
									{formatDate(chat.last_message.created_at)}
								</small>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}