import { useAtomValue } from "jotai";
import { User } from "../../lib/store";
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../../components/ui/tooltip";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { GET } from "../../lib/fetch";
import { useEffect, useState } from "react";
import { socket } from "../../lib/socket";

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

function MessageAreaSkeleton() {
	return (
		<div className="w-full flex flex-col px-8 h-[calc(70vh)] overflow-y-scroll pb-4">
			{[...Array(5)].map((_, i) => (
				<div
					key={i}
					className={`flex ${
						i % 2 === 0 ? "justify-start" : "justify-end"
					} mt-3`}
				>
					<div
						className={`
              ${i % 2 === 0 ? "bg-secondary" : "bg-primary"}
              py-2 px-3 rounded-md
              animate-pulse
              w-[${Math.floor(Math.random() * 30 + 20)}%]
              min-w-[100px]
              h-[36px]
            `}
						style={{
							animationDelay: `${i * 0.1}s`,
							width: `${Math.floor(Math.random() * 30 + 20)}%`,
						}}
					/>
				</div>
			))}
		</div>
	);
}

function Messages({ chatId }: { chatId: string | null }) {
	const user = useAtomValue(User);
	const [isTyping, setIsTyping] = useState(false);
	const { ref: loadMoreRef, inView } = useInView();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteQuery({
			queryKey: ["messages", chatId],
			queryFn: async ({ pageParam = 0 }) => {
				if (!chatId) return { messages: [], nextCursor: undefined };
				const messages = await GET(
					`/messages/${chatId}?offset=${pageParam}&limit=20`
				);

				return {
					messages: messages as Message[],
					nextCursor:
						messages.length === 20 ? pageParam + 20 : undefined,
				};
			},
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: 0,
		});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}

		socket.on("typing", (chatId, isTyping) => {
			if (chatId === chatId) {
				setIsTyping(isTyping);
			}
		});
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (status === "pending") return <MessageAreaSkeleton />;
	if (status === "error") {
		return (
			<div className="h-full flex items-center justify-center text-destructive text-xl">
				Error loading messages
			</div>
		);
	}

	const messages: Message[] = data.pages
		.flatMap((page) => page.messages)
		.filter((msg, index, self) => {
			return (
				index ===
				self.findIndex((m) => m.id === msg.id && m.from === msg.from)
			);
		});

	if (!messages?.length) {
		return (
			<div className="h-full flex items-center justify-center text-muted-foreground text-xl">
				Start a conversation
			</div>
		);
	}

	return (
		<div className="flex flex-col-reverse w-full">
			{/* Typing indicator */}
			{isTyping && (
				<div className="flex justify-start mt-3">
					<div className="flex items-center gap-2">
						<div className="bg-secondary flex justify-center py-2 px-3 rounded-r-md animate-pulse w-[30%] min-w-[100px] h-[36px]">
							Typing
							<div className="flex justify-center items-end gap-1">
								<span
									className="w-1 h-1 bg-primary/70 rounded-full animate-bounce"
									style={{ animationDelay: "0s" }}
								></span>
								<span
									className="w-1 h-1 bg-primary/70 rounded-full animate-bounce"
									style={{ animationDelay: "0.2s" }}
								></span>
								<span
									className="w-1 h-1 bg-primary/70 rounded-full animate-bounce"
									style={{ animationDelay: "0.4s" }}
								></span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Messages list */}
			{messages.map((msg, index) => {
				const nextMsg = messages[index + 1]; // Since the array is reversed, we look at the next message
				return (
					<div
						className={`flex ${
							nextMsg?.from === msg.from ? "mt-[1px]" : "mt-3"
						} ${
							msg.from === user?.id
								? "justify-end"
								: "justify-start"
						}`}
						key={msg.id || index}
					>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger asChild>
									<div
										className={`${
											msg.from === user?.id
												? "bg-primary text-white rounded-l-md"
												: "bg-secondary rounded-r-md"
										} py-2 px-3 cursor-pointer flex flex-col gap-2`}
									>
										{msg.text}
										{msg.media && msg.media.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{msg.media.map((media) => (
													<img
														key={media.id}
														src={`${media.url}`}
														alt="Message attachment"
														className="max-w-[200px] rounded-md"
														loading="lazy"
													/>
												))}
											</div>
										)}
									</div>
								</TooltipTrigger>
								<TooltipContent side="right">
									{formatDate(msg.created_at)}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				);
			})}

			{/* Loading more indicator */}
			{isFetchingNextPage && <MessageAreaSkeleton />}

			{/* Intersection observer target */}
			<div ref={loadMoreRef} className="h-4" />
		</div>
	);
}

export function MessageArea({ chatId }: { chatId: string | null }) {
	return (
		<div
			className="w-full flex flex-col-reverse px-8 h-[calc(100vh-200px)] md:h-[calc(100vh-240px)] overflow-y-scroll pb-4"
			ref={(ref) => ref && (ref.scrollTop = ref.scrollHeight)}
		>
			<Messages chatId={chatId} />
		</div>
	);
}
