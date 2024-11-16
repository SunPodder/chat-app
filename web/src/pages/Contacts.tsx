import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { GET } from "../lib/fetch";
import { Avatar } from "../components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { useSetAtom } from "jotai";
import { activeConversation } from "../lib/store";
import { useQuery } from "@tanstack/react-query";

export default function Contacts() {
	const setActiveConv = useSetAtom(activeConversation as any);
	const {
		data: contacts,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["contacts"],
		queryFn: () => GET("http://localhost:5000/contacts"),
	});

	function openChat(contact: any) {
		const c = {to: ''};
		c.to = contact;

		setActiveConv(c);
	}

	if (error) return <div>Error: {error.message}</div>;
	if (isLoading) return <div>Loading...</div>;

	return (
		<Card className="w-full h-full">
			<CardHeader>
				<CardTitle className="py-2 flex items-center">
					<span className="flex-1">Contacts</span>
				</CardTitle>
				<form>
					<div className="flex items-center">
						<Input
							type="text"
							placeholder="Search contacts"
							className="rounded-r-none"
						/>
						<Button type="submit" className="rounded-l-none">
							<Search />
						</Button>
					</div>
				</form>
			</CardHeader>
			<CardContent>
				{contacts.map((contact: any) => (
					<Card
						key={contact.id}
						className="mb-2 p-4 cursor-pointer"
						onClick={() => openChat(contact)}
					>
						<div className="flex items-center w-full h-full gap-2">
							<Avatar className="w-9 h-9">
								<AvatarImage
									src={contact?.avatar}
									alt={contact?.name.first}
								/>
								<AvatarFallback>
									{contact?.name.first[0]}
								</AvatarFallback>
							</Avatar>
							<div className="font-semibold">
								{contact?.name.first} {contact?.name.last}
							</div>
						</div>
					</Card>
				))}
			</CardContent>
		</Card>
	);
}
