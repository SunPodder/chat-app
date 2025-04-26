import { Image, Send } from "lucide-react";
import { Input } from "../../components/ui/input";

export function ChatInput({
	onSubmit,
	onChange,
	value,
}: {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	onChange: (e: string) => void;
	value: string;
}) {
	return (
		<div className="w-full p-4 py-8">
			<form
				className="flex justify-center items-center w-full gap-2"
				onSubmit={(e) => onSubmit(e)}
			>
				<Image className="w-8 h-8" />
				<Input
					value={value}
					type="text"
					placeholder="Type a message"
					className="flex-grow flex-1"
					onChange={(e) => onChange(e.target.value)}
				/>
				<button type="submit">
					<Send className="w-8 h-8" />
				</button>
			</form>
		</div>
	);
}
