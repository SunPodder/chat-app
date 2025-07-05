import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../components/ui/avatar";

function formatLastOnline(lastOnline: Date) {
	const now = new Date();
	const diffInMs = now.getTime() - lastOnline.getTime();
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

	if (diffInMinutes <= 5) {
		return (
			<div className="flex items-center gap-1">
				<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
				Active Now
			</div>
		);
	} else if (diffInMinutes <= 1440) {
		const diffInHours = Math.floor(diffInMinutes / 60);
		return diffInMinutes < 60
			? `Active ${diffInMinutes} mins ago`
			: `Active ${diffInHours} hours ago`;
	} else {
		return lastOnline.toLocaleDateString();
	}
}

export function ChatHead({ chat }: { chat: Chat }) {
	return (
		<div className="flex gap-2 border-b py-4 px-6">
			<Avatar className="w-10 h-10">
				<AvatarImage
					src={chat.to.avatar?.url}
					alt={chat.to.name.first}
				/>
				<AvatarFallback>{chat.to.name.first[0]}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col justify-center">
				<div className="text-lg font-medium">
					{chat.to.name.first} {chat.to.name.last}
				</div>
				<div className="text-slate-500 text-sm">
					{formatLastOnline(new Date(chat.to.last_online))}
				</div>
			</div>
		</div>
	);
}
