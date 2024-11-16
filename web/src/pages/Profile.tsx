import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAtom } from "jotai";
import { User } from "../lib/store";
import { useForm } from "react-hook-form";
import { zProfile } from "../../../common/zod_schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";
import { EditIcon } from "lucide-react";

const ProfileImage = ({ user, form }) => {
	function makeObjectURL(file: File) {
		if (!(file instanceof File)) return;
		return URL.createObjectURL(file);
	}

	return (
		<div className="w-full flex justify-center">
			<FormField
				control={form.control}
				name="avatar"
				render={({ field: { value, onChange, ...fieldProps } }) => (
					<FormItem>
						<FormLabel>
							<Avatar className="flex relative cursor-pointer">
								<AvatarImage
									src={makeObjectURL(value) || user?.avatar}
									alt={user?.name.first}
									className="w-40 h-40 rounded-full"
								/>
								<AvatarFallback>
									{user?.name.first[0]}
								</AvatarFallback>
								<EditIcon className="w-10 h-10 absolute bottom-1 right-1 bg-background p-2 rounded-full" />
							</Avatar>
						</FormLabel>
						<FormControl>
							<Input
								{...fieldProps}
								placeholder="Avatar"
								type="file"
								accept="image/png, image/jpeg, image/jpg"
								onChange={(event) =>
									onChange(
										event.target.files &&
											event.target.files[0]
									)
								}
								className="hidden"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};

export default function Profile() {
	const [user, setUser]: [any, any] = useAtom(User);

	const form = useForm<z.infer<typeof zProfile>>({
		resolver: zodResolver(zProfile),
		defaultValues: {
			email: user?.email,
			username: user?.username,
			name: {
				first: user?.name.first,
				last: user?.name.last,
			},
			avatar: "",
		},
	});

	async function onSubmit() {
		const formData = new FormData();
		formData.append("avatar", form.getValues("avatar"));
		formData.append("name", JSON.stringify(form.getValues("name")));
		formData.append("username", form.getValues("username"));
		formData.append("email", form.getValues("email"));

		const response = await fetch("http://localhost:5000/profile/edit", {
			method: "POST",
			body: formData,
			credentials: "include",
			mode: "cors",
		});

		if (response.ok) {
			const data = await response.json();
			setUser(data);
		}
	}

	return (
		<Card className="w-full h-full flex flex-col">
			<CardHeader>
				<CardTitle className="py-2 flex items-center">
					<span className="flex-1">Profile</span>
				</CardTitle>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent>
						<ProfileImage user={user} form={form} />
						<div className="grid grid-cols-1 lg:grid-cols-2 mt-8 gap-4">
							<FormField
								control={form.control}
								name="name.first"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First name</FormLabel>
										<FormControl>
											<Input
												placeholder="First name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="name.last"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last name</FormLabel>
										<FormControl>
											<Input
												placeholder="Last name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Username"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex gap-4 ml-4">
						<Button
							disabled={!form.formState.isDirty}
							onClick={() => form.reset()}
						>
							Reset
						</Button>
						<Button
							disabled={!form.formState.isDirty}
							type="submit"
						>
							Save
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
