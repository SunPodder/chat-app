import { LoginUserSchema, vLoginUser } from "../../../common/zod_schema";
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
import { useSetAtom } from "jotai";
import { User } from "../lib/store";

export default function Login() {
	const form = useForm<LoginUserSchema>({
		resolver: valibotResolver(vLoginUser),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const setUser: any = useSetAtom(User as any);

	async function onSubmit(data: LoginUserSchema) {
		const user = await POST("/login", data);
		setUser(user);
	}

	return (
		<div className="w-full h-screen flex justify-center mt-28 text-left">
			<Card className="h-fit">
				<CardHeader>
					<CardTitle className="text-3xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="flex flex-col gap-4">
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
											<div className="flex">
												<FormLabel>Password</FormLabel>
												<Link
													to="#"
													className="ml-auto inline-block text-sm underline"
												>
													Forgot your password?
												</Link>
											</div>
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
								Login
							</Button>
							<div className="mt-4 text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link to="/register" className="underline">
									Register
								</Link>
							</div>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
