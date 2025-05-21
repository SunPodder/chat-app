interface BaseUser {
	readonly id: string;
	username: string;
	name: {
		first: string;
		last: string;
	};
	readonly created_at: Date;
}

interface BaseMessage {
	readonly id: string;
	text: string;
	from: string;
	to: string;
	readonly created_at: Date;
}

interface Media {
	readonly id: string;
	type: string;
	url: string;
	user_id: string;
	readonly created_at: Date;
}

interface ServerUser extends BaseUser {
	email: string;
    avatar?: string;
}

interface ServerMessage extends BaseMessage {
	media?: string[];
}

interface ServerSession {
	id: string;
	user_id: string;
	created_at: Date;
    expires_at: Date;
    ip: string;
    user_agent: string;
}

interface ClientUser extends BaseUser {
	email?: string;
	avatar?: Media;
}

interface ClientMessage extends BaseMessage {
	media?: Media[];
}

interface ClientChat {
	to: ClientUser;
	last_message: ServerMessage;
}
