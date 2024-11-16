import {
	TriangleAlertIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useEffect, useRef, useState } from "react";
import { CardContent } from "../../components/ui/card";

export default function AccountDeletion() {
	const [showDialog, setShowDialog] = useState(false);

	const ConfirmDialog = () => {
		const [confirm, setConfirm] = useState("");
		const [password, setPassword] = useState("");
		const formRef = useRef<HTMLFormElement>(null);
		const parent = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const handleClick = (e) => {
				if (formRef.current?.contains(e.target)) return;
				setShowDialog(false);
			};
			const p = parent.current;
			p?.addEventListener("click", handleClick);

			return () => {
				p?.removeEventListener("click", handleClick);
			};
		});

		function onSubmit(e: React.FormEvent) {
			e.preventDefault();
		}

		if (!showDialog) return null;
		return (
			<div
				className="w-screen h-screen fixed top-0 left-0 z-10 bg-black bg-opacity-40 grid place-items-center"
				ref={parent}
			>
				<form
					onSubmit={onSubmit}
					className="bg-background p-8 rounded-lg grid gap-2"
					ref={formRef}
				>
					<p className="font-medium grid">
						Are you sure you want to delete your account? This
						action is irreversible.
					</p>
					<Input
						type="text"
						placeholder="Type 'DELETE' to confirm"
						value={confirm}
						className="bg-red-100 focus-visible:ring-none"
						onChange={(e) => setConfirm(e.target.value)}
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button
						className="bg-red-500 text-white"
						disabled={confirm !== "DELETE" || password === ""}
					>
						Yes, Delete My Account
					</Button>
				</form>
			</div>
		);
	};
	return (
		<>
			<ConfirmDialog />
			<CardContent>
				<h2 className="text-xl font-bold">Account Deletion</h2>
				<p className="bg-red-400 text-white p-2 rounded mt-3">
					<TriangleAlertIcon className="w-10 h-8 inline-block" />
					Deleting your account will permanently remove all your data
					from the server.
					<b>Procceed with caution.</b>
				</p>
				<Button
					className="bg-red-500 text-white mt-1"
					onClick={() => setShowDialog(true)}
				>
					Delete Account
				</Button>
			</CardContent>
		</>
	);
}
