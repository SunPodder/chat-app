import { Link } from "react-router-dom";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAtomValue } from "jotai";
import { User } from "../lib/store";
import { useEffect } from "react";
import { ContactRound, HomeIcon, Settings2 } from "lucide-react";

export default function Sidebar() {
	const user: any = useAtomValue(User);

	useEffect(() => {}, [user]);

	return (
		<nav className="flex flex-col items-center gap-8 sm:py-5 h-full flex-grow p-4 px-8">
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							to="/me"
							className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base rounded-full"
						>
							<Avatar className="rounded-full">
								<AvatarImage
									src={user?.avatar}
									alt={user?.name.first}
									className="rounded-full"
								/>
								<AvatarFallback>
									{user?.name.first[0]}
								</AvatarFallback>
							</Avatar>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Profile</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							to="/"
							className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						>
							<HomeIcon />
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Chats</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							to="/contacts"
							className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						>
							<ContactRound />
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Contacts</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							to="/settings"
							className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						>
							<Settings2 />
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Settings</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</nav>
	);
}
