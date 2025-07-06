import { Image, Send } from "lucide-react";
import { Input } from "../../components/ui/input";
import { socket } from "../../lib/socket";
import { useEffect, useRef, useState } from "react";

export function ChatInput({chat, chatId}: { chat: Chat, chatId: string | null }) {
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [message, setMessage] = useState<string>("");
	const [images, setImages] = useState<File[]>([]);
	const [imagePreview, setImagePreview] = useState<string[]>([]);
	console.log(images);
	

	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			imagePreview.forEach((preview) => {
				URL.revokeObjectURL(preview);
			});
		};
	}, [imagePreview]);

	const handleTextInputChange = (inputValue: string) => {
		setMessage(inputValue);

		if (!socket.connected || !chatId) {
			return;
		}

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		if (inputValue.length > 0) {
			socket.emit("typing", {
				chatId,
				isTyping: true,
			});

			// Set a timeout to send the "not typing" event after 2 seconds
			typingTimeoutRef.current = setTimeout(() => {
				socket.emit("typing", {
					chatId,
					isTyping: false,
				});
			}, 3000);
		} else {
			socket.emit("typing", {
				chatId,
				isTyping: false,
			});
		}
	};

	function handleImageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setImages(files);

			const previews = files.map((file) => URL.createObjectURL(file));
			setImagePreview(previews);
		}
	}

	async function sendMsg(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!message) return;

		if (socket?.connected) {
			socket.emit(
				"send_message",
				{
					to: chatId,
					message,
				},
				chat.last_message === null
			);

			setMessage("");
		}
	}

	return (
		<div className="w-full p-4 min-h-[60px] relative">
			{imagePreview.length > 0 && (
				<div className="absolute bottom-[75%] left-0 right-0 flex gap-2 mx-12 mb-4 bg-white/95 backdrop-blur-sm rounded-t-lg p-2 border border-b-0 shadow-lg">
					{imagePreview.map((preview, index) => (
						<img
							key={index}
							src={preview}
							alt={`Preview ${index}`}
							className="w-16 h-16 object-cover rounded-md"
							onLoad={() => {
								URL.revokeObjectURL(preview);
							}}
							onError={() => {
								URL.revokeObjectURL(preview);
							}
							}
						/>
					))}
				</div>
			)}
			<form
				className="flex justify-center items-center w-full gap-2"
				onSubmit={sendMsg}
			>
				<label>
					<Image className="w-8 h-8" />
					<input type="file" accept="image/*" className="hidden" onChange={handleImageInputChange} />
					<span className="sr-only">Upload an image</span>
				</label>
				<Input
					value={message}
					type="text"
					placeholder="Type a message"
					className="flex-grow flex-1"
					onChange={(e) => handleTextInputChange(e.target.value)}
				/>
				<button type="submit">
					<Send className="w-8 h-8" />
				</button>
			</form>
		</div>
	);
}
