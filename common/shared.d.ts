interface User {
	readonly id: string;
	email?: string;
	username: string;
	name: {
		first: string;
		last: string;
	};
	readonly created_at: Date;
    readonly updated_at: Date;
    last_online: Date;
	avatar?: Media;
}

interface Message {
	readonly id: string;
	text: string;
	from: string;
	to: string;
	media?: Media[];
	readonly created_at: Date;
}

interface Media {
	readonly id: string;
	type: string;
	url: string;
	user_id: string;
	thumbnail?: string;
	message_id?: string;
	readonly created_at: Date;
}

interface Session {
	id: string;
	user_id: string;
	created_at: Date;
    expires_at: Date;
    ip: string;
    user_agent: string;
}

interface Chat {
	to: User;
	last_message: Message;
}
