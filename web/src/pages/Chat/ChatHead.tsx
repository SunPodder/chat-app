import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../components/ui/avatar";

export function ChatHead({ chat }) {
	return (
		<div className="flex gap-2 border-b py-4 px-6">
			<Avatar className="w-10 h-10">
				<AvatarImage
					src={chat.to.avatar}
					alt={chat.to.name.first}
				/>
				<AvatarFallback>{chat.to.name.first[0]}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col justify-center">
				<div className="text-lg font-medium">
					{chat.to.name.first} {chat.to.name.last}
				</div>
				<div className="text-slate-500 text-sm">
					{chat.last_active}
				</div>
			</div>
		</div>
	);
}
