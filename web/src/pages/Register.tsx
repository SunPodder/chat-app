import { RegisterUserSchema, vRegisterUser } from "../../../common/zod_schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";
import { POST } from "../lib/fetch";
import { User } from "../lib/store";
import { useSetAtom } from "jotai";

export default function Register() {
	const form = useForm<RegisterUserSchema>({
		resolver: valibotResolver(vRegisterUser),
		defaultValues: {
			name: {
				first: "",
				last: "",
			},
			username: "",
			email: "",
			password: "",
		},
		mode: "onBlur",
	});

	const setUser: any = useSetAtom(User as any);

	async function onSubmit(data: RegisterUserSchema) {
		const user = await POST("/register", data);
		setUser(user);
		console.log(user);
	}

	return (
		<div className="w-full h-screen flex justify-center text-left mt-12">
			<Card className="h-fit">
				<CardHeader>
					<CardTitle className="text-3xl">Register</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="flex flex-col gap-4">
							<div className="flex gap-2">
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
							</div>
							<div>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input
													placeholder="username"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div>
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
							<div>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="Password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col">
							<Button type="submit" className="w-full">
								Register
							</Button>
							<div className="mt-4 text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link to="/login" className="underline">
									Login
								</Link>
							</div>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
