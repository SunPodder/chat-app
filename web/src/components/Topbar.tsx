import { MessageSquareIcon } from "lucide-react";

export default function Topbar() {
	return (
		<header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 w-full">
			<h1 className="text-xl font-semibold flex items-center">
				<MessageSquareIcon className="size-5" />
				RChat
			</h1>
		</header>
	);
}
