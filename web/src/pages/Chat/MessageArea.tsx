import { useAtomValue } from "jotai";
import { User } from "../../lib/store";
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../../components/ui/tooltip";

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


export function MessageArea({ messages }: { messages: any[] }) {
	const user: any = useAtomValue(User);
	return (
		<div className="w-full flex flex-col px-4 mb-3 max-h-[600px] overflow-y-scroll">
			{messages.map((msg, index) => (
				<div
					className={`flex cursor-pointer
							${messages[index - 1]?.from == messages[index]?.from ? "mt-0" : "mt-3"} ${
						msg.from == user?.id ? "justify-end" : "justify-start"
					}`}
					key={index}
				>
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div
									className={`${
										msg.from == user?.id
											? "bg-primary text-white"
											: "bg-secondary"
									} py-2 px-3 rounded-md`}
								>
									{msg.text}
								</div>
							</TooltipTrigger>
							<TooltipContent side="right">
								{formatDate(msg.created_at)}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
}
