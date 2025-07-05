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
		<nav className="flex flex-row md:flex-col items-center gap-4 md:gap-8 justify-center md:justify-start py-2 md:py-5 h-full flex-grow p-4 md:px-8 px-4">
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							to="/me"
							className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base rounded-full"
						>
							<Avatar className="rounded-full">
								<AvatarImage
									src={user?.avatar?.url}
									alt={user?.name.first}
									className="rounded-full"
								/>
								<AvatarFallback>
									{user?.name.first[0]}
								</AvatarFallback>
							</Avatar>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" className="md:block hidden">Profile</TooltipContent>
					<TooltipContent side="top" className="md:hidden block">Profile</TooltipContent>
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
					<TooltipContent side="right" className="md:block hidden">Chats</TooltipContent>
					<TooltipContent side="top" className="md:hidden block">Chats</TooltipContent>
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
					<TooltipContent side="right" className="md:block hidden">Contacts</TooltipContent>
					<TooltipContent side="top" className="md:hidden block">Contacts</TooltipContent>
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
					<TooltipContent side="right" className="md:block hidden">Settings</TooltipContent>
					<TooltipContent side="top" className="md:hidden block">Settings</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</nav>
	);
}
