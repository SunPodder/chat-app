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
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function Contacts() {
	const {
		data: contacts,
		error,
		isLoading,
	} = useQuery<User[]>({
		queryKey: ["contacts"],
		queryFn: () => GET("http://localhost:5000/contacts"),
	});

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
				{contacts.map((contact) => (
					<Link to={`/chat/${contact.id}`} key={contact.id}>
						<Card
							key={contact.id}
							className="mb-2 p-4 cursor-pointer"
						>
							<div className="flex items-center w-full h-full gap-2">
								<Avatar className="w-9 h-9">
									<AvatarImage
										src={contact?.avatar?.url}
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
					</Link>
				))}
			</CardContent>
		</Card>
	);
}
